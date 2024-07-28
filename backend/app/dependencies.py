import os
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator
from app.database import SessionLocal
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.vector_stores.postgres import PGVectorStore
import os


# Fetch environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")


def get_embedding_model(model_name, embed_batch_size=100):
    if model_name == "text-embedding-ada-002":
        return OpenAIEmbedding(
            model=model_name, embed_batch_size=embed_batch_size, api_key=OPENAI_API_KEY
        )


def get_postgres_store():
    return PGVectorStore.from_params(
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        table_name="document",
        port=DB_PORT,
        embed_dim=1536,
    )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
