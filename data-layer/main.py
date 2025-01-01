from fastapi import FastAPI
from routers import document_controller, qa_controller
import uvicorn

app = FastAPI(title="Data layer RAG Backend", description="Document ingestion and RAG Q&A")

# Include routers
app.include_router(document_controller.router, prefix="/documents", tags=["Document Ingestion & selection"])
app.include_router(qa_controller.router, prefix="/qa", tags=["Q&A"])

# Run with `uvicorn app.main:app --reload`

# Run the application programmatically
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)