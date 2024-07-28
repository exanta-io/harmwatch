from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import QueryRequest, QueryResponse, QueryRag, MessageCreate
from app.dependencies import get_db
from app import crud
from app.services import rag

import logging

router = APIRouter()
logger = logging.getLogger(__name__)



@router.post("/query", response_model=QueryResponse)
async def query_rag_system(query_request: QueryRequest, db: AsyncSession = Depends(get_db)):
    try:
        query = query_request.query
        conversation_id = query_request.conversation_id

        if conversation_id:
            conversation_id = UUID(conversation_id)
            conversation = await crud.get_conversation(db, conversation_id=conversation_id)
            filename = conversation.filename
        else:
            filename = None

        response =  await rag.query_rag_system(QueryRag(query=query, filename=filename))
        if response:
           await  crud.create_message(db, MessageCreate(conversation_id=conversation_id, content=query, role="user"))
           await  crud.create_message(db, MessageCreate(conversation_id=conversation_id, content=response.response, role="assistant"))
           
        return response
    except Exception as e:
        logger.error(f"Error querying system: {e}")
        raise HTTPException(status_code=500, detail=str(e))