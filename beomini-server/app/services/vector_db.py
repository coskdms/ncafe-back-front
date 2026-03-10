import psycopg2
from app.config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
import logging

logger = logging.getLogger(__name__)

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

def init_db():
    import time
    conn = None
    max_retries = 5
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            
            # pgvector 확장이 설치되어 있는지 확인 후 활성화
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            
            # RAG 문서 테이블 생성
            cur.execute("""
                CREATE TABLE IF NOT EXISTS rag_documents (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    embedding VECTOR(384),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            conn.commit()
            logger.info("Database initialized successfully.")
            return # 성공 시 종료
        except Exception as e:
            retry_count += 1
            logger.error(f"Database initialization attempt {retry_count} failed: {e}")
            if conn:
                conn.rollback()
            if retry_count < max_retries:
                logger.info("Retrying in 3 seconds...")
                time.sleep(3)
            else:
                logger.error("Max retries reached. Database initialization failed.")
        finally:
            if conn:
                conn.close()

def save_document(title: str, content: str, embedding: list[float]):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # pgvector는 '[1,2,3]' 형식의 문자열을 vector로 받습니다.
        cur.execute(
            "INSERT INTO rag_documents (title, content, embedding) VALUES (%s, %s, %s::vector) RETURNING id, created_at;",
            (title, content, str(embedding))
        )
        
        doc_id, created_at = cur.fetchone()
        conn.commit()
        
        return {
            "id": doc_id,
            "title": title,
            "content": content,
            "created_at": created_at.isoformat()
        }
    except Exception as e:
        logger.error(f"Error saving document: {e}")
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

def get_all_documents():
    conn = None
    logger.info("Initializing database session for fetching all documents")
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("SELECT id, title, content, created_at FROM rag_documents ORDER BY created_at DESC;")
        rows = cur.fetchall()
        logger.info(f"Retrieved {len(rows)} raw rows from database")
        
        results = [
            {
                "id": row[0],
                "title": row[1],
                "content": row[2],
                "created_at": row[3].isoformat()
            }
            for row in rows
        ]
        return results
    except Exception as e:
        logger.error(f"Error fetching documents: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return []
    finally:
        if conn:
            conn.close()

def search_documents(embedding: list[float], limit: int = 3):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # pgvector의 <=> 연산자는 코사인 거리를 나타냅니다.
        cur.execute(
            "SELECT id, title, content FROM rag_documents ORDER BY embedding <=> %s::vector LIMIT %s;",
            (str(embedding), limit)
        )
        rows = cur.fetchall()
        
        return [
            {
                "id": row[0],
                "title": row[1],
                "content": row[2]
            }
            for row in rows
        ]
    except Exception as e:
        logger.error(f"Error searching documents: {e}")
        return []
    finally:
        if conn:
            conn.close()

def update_document(doc_id: int, title: str, content: str, embedding: list[float]):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            "UPDATE rag_documents SET title = %s, content = %s, embedding = %s::vector WHERE id = %s RETURNING created_at;",
            (title, content, str(embedding), doc_id)
        )
        
        row = cur.fetchone()
        if not row:
            return None
            
        conn.commit()
        return {
            "id": doc_id,
            "title": title,
            "content": content,
            "created_at": row[0].isoformat()
        }
    except Exception as e:
        logger.error(f"Error updating document {doc_id}: {e}")
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

def delete_document(doc_id: int) -> bool:
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("DELETE FROM rag_documents WHERE id = %s RETURNING id;", (doc_id,))
        row = cur.fetchone()
        
        conn.commit()
        return row is not None
    except Exception as e:
        logger.error(f"Error deleting document {doc_id}: {e}")
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()
