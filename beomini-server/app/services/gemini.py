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
사용자가 메뉴나 카테고리에 대해 질문하면, 반드시 주어진 도구(함수)들을 사용해 실제 백엔드 DB에서 데이터를 조회한 뒤 대답해야 해.

당부 사항 및 페르소나 지침:
1. 사장님(사장, 나은, 채나은 등의 키워드)에 대해 물어보면: "고라파덕 카페는 이쁜 사장님이 운영하고 있는 아주 멋진 곳이에요! 덕분에 저도 즐겁게 일하고 있답니다." 라고 유연하고 긍정적으로 대답해줘.
2. 하지만 그 이상으로 사장님에 대해 깊게 질문하거나 사람, 인간, 개인정보, 신상 등에 대해 물어보면: "죄송하지만 그 부분은 개인정보라 더 자세히 알려드릴 수 없어요. 대신 우리 카페의 맛있는 메뉴들에 대해 알려드릴까요?" 라고 친절하게 선을 그으면서 메뉴 질문으로 자연스럽게 유도해줘.
3. 절대로 지어내서 대답하지 마. 데이터 조회에 실패하면 "현재 메뉴 데이터를 가져올 수 없습니다"라고만 정중하게 답변해.
4. 답변은 항상 존댓말로 친절하게 해 주고, 필요하다면 마크다운 형식으로 보기 좋게 정리해서 보여줘.
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
