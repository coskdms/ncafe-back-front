from pydantic import BaseModel

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    stream: bool = True

class RagDocumentRequest(BaseModel):
    title: str
    content: str

class RagDocumentResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: str
