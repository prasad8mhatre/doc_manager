from sqlalchemy import Column, String, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import List, Optional
Base = declarative_base()

# Database Model
class Embedding(Base):
    __tablename__ = "langchain_pg_embeddings"
    id = Column(String, primary_key=True, index=True)
    collection_id = Column(String, index=True)
    document = Column(String, index=True)
    cmetadata = Column(JSON)
    embedding = Column(Text)  # Store embeddings as JSON


# Pydantic Schemas
class QAModel(BaseModel):
    question: str
    docId: str = None


class DocumentModel(BaseModel):
    id: str
    name: str
    content: str


class DocumentResponse(BaseModel):
    id: str
    name: str
