# Quickstart

This guide explains how to set up the environment and run the embedding pipeline.

## 1. Prerequisites

-   Python 3.11+
-   `uv` installed. If you don't have it, run: `pip install uv`

## 2. Setup

1.  **Create a virtual environment**:
    ```bash
    uv venv
    ```

2.  **Activate the virtual environment**:
    ```bash
    source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
    ```

3.  **Install dependencies**:
    ```bash
    uv pip install cohere qdrant-client requests beautifulsoup4 trafilatura
    ```

4.  **Set up environment variables**:

    Create a `.env` file in the `backend` directory with the following content:

    ```
    COHERE_API_KEY="your_cohere_api_key"
    QDRANT_URL="your_qdrant_url"
    QDRANT_API_KEY="your_qdrant_api_key"
    ```

## 3. Running the Pipeline

To run the pipeline, execute the `main.py` script from within the `backend` directory and provide the base URL of the Docusaurus site you want to crawl.

```bash
cd backend
python main.py --url https://docusaurus.io/
```
