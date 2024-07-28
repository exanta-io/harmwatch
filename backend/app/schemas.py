from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime
from enum import Enum


class MessageRoleEnum(str, Enum):
    user = "user"
    assistant = "assistant"


class MessageCreate(BaseModel):
    conversation_id: UUID4
    content: str
    role: str


class Message(BaseModel):
    id: UUID4
    conversation_id: UUID4
    created_at: datetime
    content: str
    role: str

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    filename: str
    title: Optional[str] = None


class ConversationResponse(BaseModel):
    id: UUID4
    filename: str
    title: Optional[str] = None
    messages: List[Message] = None

    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    conversations: List[ConversationResponse] = None

    class Config:
        from_attributes = True


class UpdateConversationTitle(BaseModel):
    title: str


class QueryRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None


class QueryRag(BaseModel):
    query: str
    filename: Optional[str] = None


class QueryResponse(BaseModel):
    response: str
    sources: List[str]


class File(BaseModel):
    filename: str


class DocumentListResponse(BaseModel):
    documents: List[File]

    class Config:
        from_attributes = True
