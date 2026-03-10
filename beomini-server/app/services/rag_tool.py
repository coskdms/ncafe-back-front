from app.services.embedding import get_embedding
from app.services.vector_db import search_documents

def search_knowledge_base(query: str) -> str:
    """
    카페 이용 안내, 공지사항, FAQ 등 지식 베이스(RAG)에서 관련 정보를 검색합니다.
    메뉴 정보 이외의 일반적인 질문에 대답할 때 사용합니다.
    
    Args:
        query: 검색할 질문 또는 키워드
    """
    try:
        # 1. 쿼리 임베딩 생성 (e5 모델은 query: 접두사 권장)
        # embedding.py의 get_embedding은 passage: 를 붙이므로, 
        # 검색용으로는 query: 를 붙이는 별도 로직이나 수정이 필요할 수 있음.
        # 일단은 통일성을 위해 embedding.py를 참고하여 처리.
        
        # 검색 시에는 "query: " 접두사를 사용하는 것이 성능상 좋음
        from app.services.embedding import model
        processed_query = f"query: {query}"
        embedding = model.encode(processed_query).tolist()
        
        # 2. DB 검색
        results = search_documents(embedding, limit=3)
        
        if not results:
            return "지식 베이스에서 관련 정보를 찾지 못했다덕.."
            
        # 3. 결과 포맷팅
        context = "관련 지식 베이스 검색 결과다덕:\n\n"
        for i, res in enumerate(results, 1):
            context += f"[{i}] 제목: {res['title']}\n내용: {res['content']}\n\n"
            
        return context
    except Exception as e:
        return f"지식 베이스 검색 중 오류가 발생했다덕: {str(e)}"
