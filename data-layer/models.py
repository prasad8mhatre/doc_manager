from sqlalchemy import Column, String, Text
from utils.database import Base
from pydantic import BaseModel
from typing import List, Optional


# Database Model
class Embedding(Base):
    __tablename__ = "embeddings"
    id = Column(String, primary_key=True, index=True)
    document_name = Column(String, index=True)
    content = Column(Text)
    embedding = Column(Text)  # Store embeddings as JSON


# Pydantic Schemas
class QAModel(BaseModel):
    question: str
    document_ids: Optional[List[str]] = None


class DocumentModel(BaseModel):
    id: str
    name: str
    content: str


class DocumentResponse(BaseModel):
    id: str
    name: str
