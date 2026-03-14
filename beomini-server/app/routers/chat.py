import json
import logging
import traceback
from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from app.models.schemas import ChatRequest, Message
from app.services.gemini import chat, chat_stream

router = APIRouter()
logger = logging.getLogger(__name__)

def to_gemini_messages(messages: list[Message]) -> list[dict]:
    return [{"role": m.role, "parts": [{"text": m.content}]} for m in messages]

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    authorization: str = Header(None),
    x_user_role: str = Header("GUEST"),
):
    try:
        messages = to_gemini_messages(request.messages)
        logger.info(f"Chat request received. Stream: {request.stream}, Auth: {bool(authorization)}, Role: {x_user_role}")
        
        if not request.stream:
            content = await chat(messages, auth_token=authorization, user_role=x_user_role)
            logger.info("Chat success (non-stream)")
            return {"content": content}
        
        async def event_generator():
            try:
                async for chunk in chat_stream(messages, auth_token=authorization, user_role=x_user_role):
                    if isinstance(chunk, dict):
                        # dict 타입은 프론트엔드 액션으로 간주하여 그대로 JSON 전송
                        yield {"data": json.dumps(chunk, ensure_ascii=False)}
                    elif chunk:
                        # str 타입은 텍스트 내용으로 전송
                        yield {"data": json.dumps({"content": chunk}, ensure_ascii=False)}
                yield {"data": "[DONE]"}
            except Exception as e:
                logger.error(f"Stream error: {e}")
                logger.error(traceback.format_exc())
                yield {"data": json.dumps({"error": str(e)}, ensure_ascii=False)}
    
        return EventSourceResponse(event_generator())
    except Exception as e:
        logger.error(f"Endpoint error: {e}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

