from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app import crud
from app import schemas
from app.services import rag
from app.dependencies import get_db
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get(
    "/conversations/{conversation_id}/chat", response_model=schemas.QueryResponse
)
async def query_rag_system(
    conversation_id: UUID, query_request: str, db: AsyncSession = Depends(get_db)
):
    try:
        query = query_request
        if not query:
            raise ValueError("Query should not be None")
        conversation_id = conversation_id

        if conversation_id:
            conversation = await crud.get_conversation(
                db, conversation_id=conversation_id
            )
            filename = conversation.filename

        response = await rag.query_rag_system(
            schemas.QueryRag(query=query, filename=filename)
        )

        if response:
            await crud.create_message(
                db,
                schemas.MessageCreate(
                    conversation_id=conversation_id, content=query, role="user"
                ),
            )
            await crud.create_message(
                db,
                schemas.MessageCreate(
                    conversation_id=conversation_id,
                    content=response.response,
                    role="assistant",
                ),
            )

        return response
    except Exception as e:
        logger.error(f"Error querying system: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/conversations", response_model=schemas.ConversationResponse)
async def create_conversation(
    conversation_create: schemas.ConversationCreate, db: AsyncSession = Depends(get_db)
):
    conversation = await crud.create_conversation(db, conversation_create)
    return conversation


@router.get(
    "/conversations/{conversation_id}", response_model=schemas.ConversationResponse
)
async def get_conversation(conversation_id: UUID, db: AsyncSession = Depends(get_db)):
    conversation = await crud.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.delete("/conversations/{conversation_id}", response_model=dict)
async def delete_conversation(
    conversation_id: UUID, db: AsyncSession = Depends(get_db)
):
    success = await crud.delete_conversation(db, conversation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}


@router.post(
    "/conversations/{conversation_id}/messages", response_model=schemas.Message
)
async def create_message(
    conversation_id: UUID,
    message_create: schemas.MessageCreate,
    db: AsyncSession = Depends(get_db),
):
    conversation = await crud.get_conversation(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return await crud.create_message(db, message_create)


@router.get("/conversations", response_model=schemas.ConversationListResponse)
async def list_conversations(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_conversations(db)


@router.delete("/conversations", response_model=dict)
async def delete_all_conversations(db: AsyncSession = Depends(get_db)):
    messages = await crud.delete_all_messages(db)
    response = await crud.delete_all_conversations(db)
    if not response or not messages:
        raise HTTPException(status_code=500, detail="Error deleting all conversations")
    return {"message": "All conversations deleted successfully"}


@router.put(
    "/conversations/{conversation_id}", response_model=schemas.ConversationResponse
)
async def update_conversation_title(
    conversation_id: UUID,
    request: schemas.UpdateConversationTitle,
    db: AsyncSession = Depends(get_db),
):
    # Fetch the conversation instance from the database using the ORM model
    conversation = await crud.get_conversation_from_db(db, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Update the title of the conversation
    conversation.title = request.title

    # Add the conversation instance to the database session
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)

    # Return the conversation as a Pydantic model
    return schemas.ConversationResponse.from_orm(conversation)
