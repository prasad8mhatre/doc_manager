from fastapi import FastAPI
from routers import document_controller, qa_controller
import uvicorn
from starlette.middleware.cors import CORSMiddleware

app = FastAPI(title="Data layer RAG Backend", description="Document ingestion and RAG Q&A")

# List of allowed origins (you can allow multiple or a wildcard '*')
origins = [
    "*",                      # Allow all origins (not recommended for production)
]

# Adding CORSMiddleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Specify the allowed origins
    allow_credentials=True,        # Allow credentials like cookies, authorization headers
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Allowed HTTP methods
    allow_headers=["Content-Type", "Authorization"],            # Allowed headers
)

# Include routers
app.include_router(document_controller.router, prefix="/documents", tags=["Document Ingestion & selection"])
app.include_router(qa_controller.router, prefix="/qa", tags=["Q&A"])

# Run with `uvicorn app.main:app --reload`

# Run the application programmatically
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)