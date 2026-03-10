# Python 3.11 슬림 이미지 사용 (가볍고 보안상 유리함)
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 환경 변수 설정 (파이썬이 .pyc 파일을 생성하지 않도록 하고, 출력 버퍼링 비활성화)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 시스템 의존성 설치 (필요한 경우)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# 패키지 설치
COPY requirements.txt .
# pip 최신 버전 업그레이드 및 타임아웃 설정 추가
RUN pip install --no-cache-dir --upgrade pip
# CPU 전용 PyTorch 설치 (빌드 속도 개선 및 이미지 경량화)
RUN pip install --no-cache-dir --default-timeout=100 torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 컨테이너 실행될 때 실행할 명령어
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
