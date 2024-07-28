from typing import Optional, List
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, asc
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import text
from uuid import UUID
import app.models as models
import app.schemas as schemas


async def get_conversation(
    db: AsyncSession, conversation_id: UUID
) -> schemas.ConversationResponse:
    result = await db.execute(
        select(models.Conversation)
        .options(selectinload(models.Conversation.messages))
        .filter(models.Conversation.id == conversation_id)
    )
    conversation = result.scalars().first()
    if conversation:
        # Ensure messages are sorted by created_at
        conversation.messages.sort(key=lambda message: message.created_at)
        return schemas.ConversationResponse.from_orm(conversation)
    return None


async def get_conversation_from_db(
    db: AsyncSession, conversation_id: UUID
) -> models.Conversation:
    result = await db.execute(
        select(models.Conversation)
        .options(selectinload(models.Conversation.messages))
        .filter(models.Conversation.id == conversation_id)
    )
    conversation = result.scalars().first()
    if conversation:
        # Ensure messages are sorted by created_at
        conversation.messages.sort(key=lambda message: message.created_at)
    return conversation


async def create_conversation(
    db: AsyncSession, convo_payload: schemas.ConversationCreate
) -> schemas.ConversationResponse:

    conversation = models.Conversation(
        filename=convo_payload.filename, title=convo_payload.title
    )
    db.add(conversation)
    await db.commit()
    await db.refresh(conversation)
    await db.refresh(conversation, attribute_names=["messages"])

    return schemas.ConversationResponse.from_orm(conversation)


async def delete_conversation(db: AsyncSession, conversation_id: UUID) -> bool:
    result = await db.execute(
        select(models.Conversation).filter(models.Conversation.id == conversation_id)
    )
    conversation = result.scalars().first()
    if conversation:
        await db.delete(conversation)
        await db.commit()
        return True
    return False


async def create_message(
    db: AsyncSession, message: schemas.MessageCreate
) -> schemas.Message:
    db_message = models.Message(**message.dict())
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return schemas.Message.from_orm(db_message)


async def get_all_conversations(db: AsyncSession) -> schemas.ConversationListResponse:
    result = await db.execute(
        select(models.Conversation).options(joinedload(models.Conversation.messages))
    )
    conversations = result.unique().scalars().all()
    response = [
        schemas.ConversationResponse.from_orm(conversation)
        for conversation in conversations
    ]

    return schemas.ConversationListResponse(conversations=response)


async def delete_all_conversations(db: AsyncSession) -> bool:
    try:
        await db.execute(delete(models.Conversation))
        await db.commit()
        return True
    except Exception as e:
        print(f"Error deleting all conversations: {e}")
        await db.rollback()
        return False


async def delete_all_messages(db: AsyncSession) -> bool:
    try:
        await db.execute(delete(models.Message))
        await db.commit()
        return True
    except Exception as e:
        print(f"Error deleting all messages: {e}")
        await db.rollback()
        return False


async def delete_all_data(db: AsyncSession):
    try:
        # Disable referential integrity temporarily
        await db.execute(text("SET session_replication_role = 'replica';"))

        # Delete all data from tables
        await db.execute(
            text(
                "TRUNCATE TABLE messages, conversations, data_document RESTART IDENTITY CASCADE;"
            )
        )

        # Enable referential integrity back
        await db.execute(text("SET session_replication_role = 'origin';"))

        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        print(f"Error deleting all data: {e}")
        return False
