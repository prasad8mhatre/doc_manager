import uuid
from transformers import pipeline
from sqlalchemy.orm import Session
from models import Embedding
from typing import Optional, List
from transformers import pipeline
from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_core.documents import Document
from langchain_postgres import PGVector
from langchain_postgres.vectorstores import PGVector
import os
from dotenv import load_dotenv
from langchain_core.documents import Document
import psycopg2
from psycopg2.extras import RealDictCursor
load_dotenv()



from sqlalchemy import func

DATABASE_URL = os.environ.get("DATABASE_URL")

# Initialize embedding pipeline
embedding_pipeline = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

hf_embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
collection_name = "my_docs"

pgvector_store = PGVector(embeddings=hf_embeddings, collection_name=collection_name,connection=DATABASE_URL, use_jsonb=True,)




def get_retriever():
    return pgvector_store.as_retriever()

async def generate_embedding(content: str):
    return hf_embeddings.embed_documents([content])[0]



async def store_embeddings(docs):
    pgvector_store.add_documents(docs, ids=[doc.metadata["id"] for doc in docs])
    return True

   

async def retrieve_embeddings(query, docId, top_k=2):
    """
    Perform a similarity search on embeddings within a specific document.

    Args:
        query (str): The query for similarity search.
        docId (str): The document ID to restrict the search.
        top_k (int): Number of top results to return.

    Returns:
        List[Document]: Top-k similar documents.
    """
    # Query to filter embeddings by docId
    filtered_query = f"""
        SELECT document, cmetadata
        FROM langchain_pg_embedding
        WHERE cmetadata->>'document_id' = %s
        ORDER BY embedding <-> %s::vector
        LIMIT %s
    """

    embedded_query = await generate_embedding(query)

    # Execute the query
    with psycopg2.connect(os.environ.get("DATABASE_URL_1")) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(filtered_query, (docId,embedded_query,top_k))
            results = cursor.fetchall()

    # Convert results to Document objects
    documents = [
        Document(
            page_content=row["document"],  # Assuming content is in the first column
            metadata=row["cmetadata"]      # Assuming metadata is in the second column
        )
        for row in results
    ]

    return documents