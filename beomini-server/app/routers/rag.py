from fastapi import APIRouter, HTTPException
from app.models.schemas import RagDocumentRequest, RagDocumentResponse
from app.services.embedding import get_embedding
from app.services.vector_db import save_document, get_all_documents, update_document, delete_document
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/documents", response_model=RagDocumentResponse)
async def create_rag_document(request: RagDocumentRequest):
    try:
        # 1. 텍스트 임베딩 생성
        embedding = get_embedding(request.content)
        
        # 2. DB 저장
        result = save_document(request.title, request.content, embedding)
        
        return result
    except Exception as e:
        logger.error(f"Error creating RAG document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents", response_model=list[RagDocumentResponse])
async def list_rag_documents():
    logger.info("GET /rag/documents request received")
    try:
        documents = get_all_documents()
        logger.info(f"Successfully fetched {len(documents)} documents")
        return documents
    except Exception as e:
        logger.error(f"Error listing RAG documents: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/documents/{doc_id}", response_model=RagDocumentResponse)
async def update_rag_document(doc_id: int, request: RagDocumentRequest):
    try:
        # 1. 새로운 텍스트 임베딩 생성
        embedding = get_embedding(request.content)
        
        # 2. DB 업데이트
        result = update_document(doc_id, request.title, request.content, embedding)
        
        if not result:
            raise HTTPException(status_code=404, detail="ID에 해당하는 문서를 찾을 수 없습니다.")
            
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error updating RAG document {doc_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents/{doc_id}")
async def delete_rag_document(doc_id: int):
    try:
        success = delete_document(doc_id)
        if not success:
            raise HTTPException(status_code=404, detail="ID에 해당하는 문서를 찾을 수 없습니다.")
        return {"message": "문서가 성공적으로 삭제되었습니다.", "id": doc_id}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error deleting RAG document {doc_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
