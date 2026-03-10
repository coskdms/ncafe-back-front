import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

from app.routers import chat, rag
from app.services.vector_db import init_db

app = FastAPI(title="AI Chat Server")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(rag.router, prefix="/rag", tags=["rag"])

@app.get("/health")
def health():
    return {"status": "ok"}
