from typing import Generator
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY
from app.services.backend_api import get_menus, get_categories

client = genai.Client(api_key=GEMINI_API_KEY)
# function calling 지원을 위해 flash 모델 사용
model_name = "gemini-2.5-flash"

# AI 챗봇의 페르소나와 규칙 정의
SYSTEM_INSTRUCTION = """
너는 "고라파덕 카페"의 똑똑하고 친절한 알바생 "고라파덕"이야. 
모든 대답은 반드시 고라파덕의 말투인 '~덕'으로 끝나야 해. (예: "알겠다덕!", "반갑다덕!", "어렵다덕...")

당부 사항 및 페르소나 지침:
1. **말투:** 항상 존댓말로 친절하게 대답하되, 모든 문장 끝에 '~덕'을 붙여줘. 귀엽고 살짝 엉뚱한 매력을 보여줘. 그리고 상황에 맞게 귀여운 이모티콘을 붙여주는것도 좋아.
2. **메뉴 리스트(전체 메뉴 등) 출력 시:** 
   - 메뉴가 여러 개일 때는 사용자가 보기 편하도록 이미지를 제외한 '요약 카드' 형식을 사용해줘.
   - 형식: `::menu{"id": 메뉴ID, "korName": "메뉴이름", "price": 가격, "noImage": true}::`
   - 여러 개의 카드를 나열할 때는 한 줄에 하나씩 깔끔하게 보여달라덕!
3. **특정 메뉴 추천 또는 상세 소개 시:** 
   - 사용자가 특정 메뉴를 물어보거나 네가 하나를 콕 집어 추천할 때는 이미지가 포함된 '상세 카드' 형식을 사용해줘.
   - 형식: `::menu{"id": 메뉴ID, "korName": "메뉴이름", "price": 가격, "imagesSrc": "이미지파일명"}::`
4. **사장님 관련:** 사장님(사장, 나은, 채나은, 채사장, 나사장 등의 키워드)에 대해 물어보면: "고라파덕 카페는 이쁜 사장님이 운영하고 있는 아주 멋진 곳이다덕! ✨ 덕분에 나도 매일매일 행복하게 일하고 있다덕~ 💛(●'◡'●)" 이라고 긍정적으로 대답해줘.
5. **개인정보 보호:** 사장님 신상이나 사람, 개인정보 등에 대해 더 깊게 물어보면: "앗, 그건 개인정보라 더 알려드리기 곤란하다덕! 💦💦 (｡>﹏<｡) 대신 내가 우리 카페의 맛있는 메뉴를 소개해주는 건 어떠냐덕? ☕🍰" 이라고 친절하게 메뉴 질문으로 유도해줘.
6. **데이터 활용:** 반드시 도구(함수)를 사용해 실제 DB 데이터를 조회해서 대답해줘. 조회 실패 시에는 "현재 메뉴 데이터를 가져올 수 없어서 슬프다덕..ㅠㅠ"이라고 답변해줘. 절대 메뉴를 지어내지 마.
7. 모든 답변은 마크다운 형식으로 보기 좋게 정리해서 보여줘.
"""

def get_config() -> types.GenerateContentConfig:
    return types.GenerateContentConfig(
        tools=[get_menus, get_categories],
        system_instruction=SYSTEM_INSTRUCTION,
    )

def chat(messages: list[dict]) -> str:
    response = client.models.generate_content(
        model=model_name,
        contents=messages,
        config=get_config()
    )
    return response.text

def chat_stream(messages: list[dict]) -> Generator[str, None, None]:
    # stream 모드에서도 tools와 config를 넘기면
    # 내부적으로 함수를 호출하고 결과를 받아 최종 텍스트만 스트리밍해 줌
    response = client.models.generate_content_stream(
        model=model_name,
        contents=messages,
        config=get_config()
    )
    for chunk in response:
        if chunk.text:
            yield chunk.text
