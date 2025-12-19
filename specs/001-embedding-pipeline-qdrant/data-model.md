# Data Model

This document describes the data model for the objects stored in the Qdrant vector database.

## DocumentChunk

This entity represents a chunk of text from a crawled web page, ready to be stored in Qdrant.

**Fields**:

-   `id` (string, UUID): A unique identifier for the chunk.
-   `text` (string): The text content of the chunk.
-   `source_url` (string): The URL of the page from which the chunk was extracted.
-   `embedding` (vector): The vector embedding of the `text`.

**Validation Rules**:

-   `id` must be a valid UUID.
-   `text` must not be empty.
--   `source_url` must be a valid URL.
-   `embedding` must be a vector of the correct dimension for the chosen Cohere model.

**State Transitions**: N/A - This is a static data model for storage.
