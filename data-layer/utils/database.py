from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import Embedding
load_dotenv()


DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def query_database_for_docs(self, docID: str) -> dict:
    database = get_db()
    db_documents = database.query(Embedding).filter(Embedding.cmetadata.docId == docID).find()
    return db_documents
