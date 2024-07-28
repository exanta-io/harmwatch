from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.dependencies import get_db, get_postgres_store
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/vector_store_data")
async def get_vector_store_data(db: AsyncSession = Depends(get_db)):
    try:
        vector_store = get_postgres_store()
        table_name = (
            vector_store.table_name
        )  # Get the table name from vector store config

        # Execute the query on the identified table
        result = await db.execute(text("SELECT * FROM data_document"))
        vector_store_data = result.fetchall()

        if not vector_store_data:
            return {"message": "No data found in vector store"}

        # Process and return the data
        data = [
            {"id": row[0], "embedding": row[1], "metadata": row[2]}
            for row in vector_store_data
        ]
        return {"vector_store_data": data}
    except Exception as e:
        logger.error(f"Error retrieving vector store data: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
