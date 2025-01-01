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

   

def retrieve_embeddings(query, top_k=5):
    # Use pgvector similarity search to find the top-k closest vectors
    return pgvector_store.similarity_search(query, k=top_k)