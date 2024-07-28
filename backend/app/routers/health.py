from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.dependencies import get_db
from typing import Dict

router = APIRouter()

@router.get("/")
async def health(db: AsyncSession = Depends(get_db)) -> Dict[str, str]:
    """
    Health check endpoint.
    """
    await db.execute(text("SELECT 1"))
    return {"status": "alive"}
