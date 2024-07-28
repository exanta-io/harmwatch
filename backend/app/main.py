from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import query, document, conversation, health, vector_store

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router, prefix="/api", tags=["query"])
app.include_router(document.router, prefix="/api", tags=["document"])
app.include_router(conversation.router, prefix="/api", tags=["conversation"])
app.include_router(vector_store.router, prefix="/api", tags=["vector_store"])
app.include_router(health.router, prefix="/health", tags=["health"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
