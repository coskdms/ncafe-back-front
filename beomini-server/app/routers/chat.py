import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from app.models.schemas import ChatRequest, Message
from app.services.gemini import chat, chat_stream

router = APIRouter()

def to_gemini_messages(messages: list[Message]) -> list[dict]:
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    messages = to_gemini_messages(request.messages)
    
    if not request.stream:
        content = chat(messages)
        return {"content": content}
    
    async def event_generator():
        for chunk in chat_stream(messages):
            yield {"data": json.dumps({"content": chunk}, ensure_ascii=False)}
        yield {"data": "[DONE]"}

    return EventSourceResponse(event_generator())
