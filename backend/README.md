# Backend Service

This service provides an API to process a URL, fetch its content, generate embeddings using Cohere, and store them in a Qdrant database.

## Setup

1.  **Install dependencies:**

    ```bash
    uv pip install -r requirements.txt
    ```

2.  **Set up environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```
    COHERE_API_KEY=your_cohere_api_key
    QDRANT_API_KEY=your_qdrant_api_key
    QDRANT_URL=your_qdrant_url
    ```

    You will also need to create a collection in Qdrant named `web-pages`.

3.  **Run the application:**

    ```bash
    uvicorn main:app --reload
    ```

## API

### POST /process-url/

Processes a URL and upserts its content into the Qdrant database.

**Request body:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Processed and upserted content from https://example.com"
}
```
