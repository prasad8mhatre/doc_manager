import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the parent directory of the current file (i.e., root project directory) to the system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app  # Import the FastAPI app (assuming it's in main.py)

client = TestClient(app)

# Test for document ingestion (file upload)
def test_ingestion_pdf():
    with open("./test/Prasad_Mhatre.pdf", "rb") as f:  # Use a test PDF file
        response = client.post(
            "/documents/ingestion",
            files={"file": ("test_file.pdf", f, "application/pdf")},
            data={"name": "Test Document"}
        )
    assert response.status_code == 200
    data = response.json()
    assert "ids" in data
    assert "status" in data
    assert data["status"] == "Document ingested successfully in parts"




# Test for document selection by IDs
def test_select_documents():
    document_ids = ["id1", "id2"]  # Use valid document IDs
    response = client.post("/documents/selection", json=document_ids)
    assert response.status_code == 422