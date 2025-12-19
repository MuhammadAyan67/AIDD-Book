
import os
import glob
import logging # Added logging
import traceback # Added traceback for detailed logs
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import cohere
import qdrant_client
from qdrant_client.http import models
import requests
from bs4 import BeautifulSoup
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")

# Log environment variables (sensitive info should be masked in production)
logging.info(f"COHERE_API_KEY: {'*****' if COHERE_API_KEY else 'Not set'}")
logging.info(f"QDRANT_API_KEY: {'*****' if QDRANT_API_KEY else 'Not set'}")
logging.info(f"QDRANT_URL: {QDRANT_URL if QDRANT_URL else 'Not set'}")

# Initialize clients
try:
    co = cohere.Client(COHERE_API_KEY)
    logging.info("Cohere client initialized.")
except Exception as e:
    logging.error(f"Failed to initialize Cohere client: {e}")
    co = None # Ensure co is None if initialization fails

try:
    qdrant_client = qdrant_client.QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    logging.info("Qdrant client initialized.")
except Exception as e:
    logging.error(f"Failed to initialize Qdrant client: {e}")
    qdrant_client = None # Ensure qdrant_client is None if initialization fails


# FastAPI app
app = FastAPI()

# Pydantic model for request body
class UrlRequest(BaseModel):
    url: str

class ChatRequest(BaseModel):
    message: str

def fetch_text_from_url(url: str) -> str:
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        logging.info(f"Successfully fetched and parsed text from URL: {url}")
        return soup.get_text()
    except requests.RequestException as e:
        logging.error(f"Error fetching URL {url}: {e}")
        raise HTTPException(status_code=400, detail=f"Error fetching URL: {e}")

def chunk_text(text: str) -> list[str]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,
        chunk_overlap=100,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_text(text)
    logging.info(f"Chunked text into {len(chunks)} chunks.")
    return chunks

def ingest_docs():
    docs_path = "../docs/"
    md_files = glob.glob(os.path.join(docs_path, "**/*.md"), recursive=True)
    logging.info(f"Found {len(md_files)} markdown files in {docs_path}")

    all_chunks = []
    sources = []
    for file_path in md_files:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
            chunks = chunk_text(text)
            all_chunks.extend(chunks)
            sources.extend([os.path.basename(file_path)] * len(chunks))
    logging.info(f"Prepared {len(all_chunks)} chunks for ingestion.")

    if not all_chunks:
        logging.warning("No chunks to ingest. Qdrant collection might be empty.")
        return

    try:
        response = co.embed(
            texts=all_chunks,
            model="embed-english-v3.0",
            input_type="search_document"
        )
        embeddings = response.embeddings
        logging.info(f"Generated {len(embeddings)} embeddings for ingestion.")

        points = [
            models.PointStruct(
                id=i,
                vector=embedding,
                payload={"text": chunk, "source": source}
            )
            for i, (embedding, chunk, source) in enumerate(zip(embeddings, all_chunks, sources))
        ]

        qdrant_client.upsert(
            collection_name="web-pages",
            points=points,
            wait=True,
        )
        logging.info(f"Successfully upserted {len(points)} points to Qdrant collection 'web-pages'.")
    except Exception as e:
        logging.error(f"Error ingesting docs: {e}\n{traceback.format_exc()}")
        # Original print statement was here, now using logging with traceback


@app.on_event("startup")
async def startup_event():
    logging.info("Startup event triggered.")
    if qdrant_client is None:
        logging.error("Qdrant client not initialized. Skipping collection check and doc ingestion.")
        return
    try:
        qdrant_client.get_collection(collection_name="web-pages")
        logging.info("Qdrant collection 'web-pages' already exists.")
    except Exception:
        logging.warning("Qdrant collection 'web-pages' not found. Recreating it.")
        try:
            qdrant_client.recreate_collection(
                collection_name="web-pages",
                vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE),
            )
            logging.info("Qdrant collection 'web-pages' recreated.")
        except Exception as e:
            logging.error(f"Failed to recreate Qdrant collection 'web-pages': {e}\n{traceback.format_exc()}")
            return # Stop further startup if collection recreation fails
    
    ingest_docs()
    logging.info("Doc ingestion process completed during startup.")


@app.post("/process-url/")
async def process_url(request: UrlRequest):
    logging.info(f"Processing URL: {request.url}")
    if co is None or qdrant_client is None:
        detail = "Cohere or Qdrant client not initialized. Cannot process URL."
        logging.error(detail)
        raise HTTPException(status_code=500, detail=detail)

    # Fetch and clean text
    text = fetch_text_from_url(request.url)
    
    # Chunk text
    chunks = chunk_text(text)
    
    # Generate embeddings
    try:
        response = co.embed(
            texts=chunks,
            model="embed-english-v3.0",
            input_type="search_document"
        )
        embeddings = response.embeddings
        logging.info(f"Generated {len(embeddings)} embeddings for URL {request.url}.")
    except cohere.CohereError as e:
        logging.error(f"Cohere API error during embedding for {request.url}: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Cohere API error: {e}")
        
    # Prepare points for Qdrant
    points = [
        models.PointStruct(
            id=i,
            vector=embedding,
            payload={"text": chunk, "source": request.url}
        )
        for i, (embedding, chunk) in enumerate(zip(embeddings, chunks))
    ]
    
    # Upsert into Qdrant
    try:
        qdrant_client.upsert(
            collection_name="web-pages",
            points=points,
            wait=True,
        )
        logging.info(f"Successfully upserted {len(points)} points from {request.url} to Qdrant.")
    except Exception as e:
        logging.error(f"Qdrant error during upsert for {request.url}: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Qdrant error: {e}")
        
    return {"status": "success", "message": f"Processed and upserted content from {request.url}"}

@app.post("/chat/")
async def chat(request: ChatRequest):
    logging.info(f"Chat request received: {request.message}")
    if co is None or qdrant_client is None:
        detail = "Cohere or Qdrant client not initialized. Cannot process chat request."
        logging.error(detail)
        raise HTTPException(status_code=500, detail=detail)

    try:
        # Embed the user's message
        logging.info("Embedding user message...")
        query_embedding_response = co.embed(
            texts=[request.message],
            model="embed-english-v3.0",
            input_type="search_query"
        )
        query_embedding = query_embedding_response.embeddings[0]
        logging.info("User message embedded successfully.")

        # Search for relevant documents
        logging.info("Searching for relevant documents in Qdrant...")
        search_result = qdrant_client.search(
            collection_name="web-pages",
            query_vector=query_embedding,
            limit=3
        )
        logging.info(f"Found {len(search_result)} relevant documents.")

        documents = [{"title": hit.payload["source"], "snippet": hit.payload["text"]} for hit in search_result]

        # Generate a response using the chat endpoint
        logging.info("Generating response with Cohere chat model...")
        chat_response = co.chat(
            message=request.message,
            documents=documents,
            model="command-r-plus",
            temperature=0.3
        )
        logging.info("Cohere chat response generated.")

        return {"response": chat_response.text}

    except cohere.CohereError as e:
        logging.error(f"Cohere API error during chat processing: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Cohere API error: {e}")
    except Exception as e:
        logging.error(f"Error during chat processing: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error during chat processing: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
