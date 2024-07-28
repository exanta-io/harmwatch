from sqlalchemy import Column, String, Enum, ForeignKey, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from uuid import uuid4
from app.database import Base


class MessageRoleEnum(str, PyEnum):
    user = "user"
    assistant = "assistant"


class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    filename = Column(Text, nullable=False)
    title = Column(Text, nullable=False)
    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"))
    content = Column(Text, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    conversation = relationship("Conversation", back_populates="messages")
