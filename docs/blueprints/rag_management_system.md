# RAG Management System Blueprint

## 1. 개요 (Overview)
AI 에이전트의 지식 베이스를 관리하기 위한 RAG(Retrieval-Augmented Generation) 문서 관리 시스템입니다. 관리자는 텍스트 파일을 업로드하거나 직접 타이핑하여 문서를 등록하고, AI 서버는 이를 임베딩하여 벡터 DB에 저장합니다.

## 2. 기술 스택 (Tech Stack)
- **Frontend**: Next.js (Admin UI)
- **Backend (AI Server)**: FastAPI (`beomini-server`)
- **Embedding Model**: `SentenceTransformer("intfloat/multilingual-e5-small")` (384 Dimensions)
- **Database**: PostgreSQL with `pgvector`
- **Communication**: REST API (JSON)

## 3. 주요 기능 (Key Features)
- **문서 등록**: 
    - 순수 텍스트(`.txt`) 파일 업로드 지원
    - 게시글 작성 형식의 직접 타이핑 지원 (제목, 내용 입력)
- **문서 조회/관리**: 
    - 저장된 RAG 문서 목록 조회 및 삭제 기능
- **자동 임베딩**: 
    - 업로드된 텍스트를 `multilingual-e5-small` 모델을 통해 384차원 벡터로 변환 및 저장

## 4. 데이터베이스 스키마 (Database Schema)
`pgvector` 확장을 사용하여 벡터 데이터를 저장합니다.

```sql
-- pgvector 확장 활성화
CREATE EXTENSION IF NOT EXISTS vector;

-- RAG 문서 저장 테이블
CREATE TABLE rag_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(384), -- multilingual-e5-small 모델 차원
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 5. 아키텍처 흐름 (Architecture Flow)

### Step 1: 문서 입력 (Admin Dashboard)
관리자가 Next.js 프론트엔드의 `/admin/rag` 페이지에서 문서를 작성하거나 파일을 업로드합니다.

### Step 2: API 요청
프론트엔드에서 AI 서버(`beomini:8000`)로 `POST /rag/documents` 요청을 보냅니다.
- Payload: `{ "title": "제목", "content": "본문 텍스트" }`

### Step 3: 임베딩 프로세스 (AI Server)
AI 서버는 `SentenceTransformer`를 사용하여 전달받은 `content`를 벡터 값으로 변환합니다.

### Step 4: DB 저장
임베딩된 벡터 값과 문서 원본(제목, 내용)을 PostgreSQL `rag_documents` 테이블에 저장합니다.

## 6. 구현 체크리스트 (Implementation Checklist)
- [ ] PostgreSQL `pgvector` 확장 설치 및 테이블 생성
- [ ] AI 서버에 `sentence-transformers`, `psycopg2-binary` 라이브러리 추가
- [ ] AI 서버 내 임베딩 및 DB 저장 엔드포인트 구현
- [ ] Next.js `/admin/rag` 페이지 및 UI 컴포넌트 개발
- [ ] 프론트엔드-AI 서버 간 API 연동 및 테스트
