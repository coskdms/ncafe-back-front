-- 아이디/비밀번호 찾기 기능을 위한 보안질문 컬럼 추가
-- 이 SQL은 기존 DB에 대해 한 번만 실행하면 됩니다.

ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer VARCHAR(200);
