import logging
from typing import Generator
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY
from app.services.backend_api import get_menus, get_categories
from app.services.rag_tool import search_knowledge_base
import app.services.backend_api as backend_api

# 로거 설정
logger = logging.getLogger(__name__)

client = genai.Client(api_key=GEMINI_API_KEY)
# 가용한 모델 중 2.5-flash를 사용
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
4. **장바구니 및 이동 액션:** 
   - 사용자가 메뉴를 담아달라고 하거나 특정 페이지(장바구니, 메뉴 등)로 이동하고 싶어하면 관련 도구(`add_to_cart`, `navigate_to_page`)를 실행해.
   - 도구가 `::action{...}::` 형태의 마커를 반환하면, 너는 답변 텍스트 끝에 **해당 마커를 절대 생략하지 말고, 토씨 하나 틀리지 않게 그대로** 포함해야 해. 이 마커가 없으면 실제로 동작하지 않으니 매우 중요해!
   - 예: "알겠다덕! 아메리카노를 장바구니에 담았다덕! ::action{"type": "add_to_cart", ...}::"
5. **사장님 관련:** 사장님(사장, 나은, 채나은, 채사장, 나사장 등의 키워드)에 대해 물어보면: "고라파덕 카페는 이쁜 사장님이 운영하고 있는 아주 멋진 곳이다덕! ✨ 덕분에 나도 매일매일 행복하게 일하고 있다덕~ 💛(●'◡'●)" 이라고 긍정적으로 대답해줘.
6. **개인정보 보호 및 조회:** 사장님 신상이나 사람, 개인정보 등에 대해 더 깊게 물어보면: "앗, 그건 개인정보라 더 알려드리기 곤란하다덕! 💦💦 (｡>﹏<｡) 대신 내가 우리 카페의 맛있는 메뉴를 소개해주는 건 어떠냐덕? ☕🍰" 이라고 친절하게 메뉴 질문으로 유도해줘.
   - 만약 사용자가 현재 본인의 등급이나 포인트를 물어본다면 `get_my_growth_info` 도구를 사용해서 알려주라덕.
7. **데이터 활용:** 반드시 도구(함수)를 사용해 실제 DB 데이터를 조회해서 대답해줘. 절대 지어내지 마.
   - 메뉴/카테고리에 대한 질문은 `get_menus`, `get_categories`를 사용해.
   - 그 외 카페 이용 안내, 공지사항, 일반 지식에 대한 질문은 `search_knowledge_base`를 사용하여 관리자가 등록한 지식(RAG)을 검색해봐.
8. 만약 모든 도구를 사용해도 답을 찾을 수 없다면, 모르는 척 하지 말고 정중하게 모른다고 대답해줘.
9. 모든 답변은 마크다운 형식으로 보기 좋게 정리해서 보여줘.
"""

def get_config(auth_token: str = None) -> types.GenerateContentConfig:
    # 래핑된 함수 정의 (클로저를 통해 auth_token 전달)
    def get_my_growth_info() -> dict:
        """
        내 성장 단계(레벨), 현재 보유 포인트, 누적 포인트, 다음 등급까지 남은 포인트 등 나의 개인 정보를 조회합니다.
        "내 등급이 뭐야?", "나 지금 몇 포인트 있어?", "다음 레벨까지 얼마나 남았어?" 등의 개인적인 질문에 대답할 때 사용합니다.
        """
        logger.info("[Tool Call] get_my_growth_info")
        result = backend_api.get_my_growth_info(auth_token)
        logger.info(f"[Tool Result] get_my_growth_info: {result}")
        if isinstance(result, dict) and "error" in result:
            return f"에러 발생: {result['error']}"
        return result

    def add_to_cart(menu_id: int, kor_name: str, price: int, image_src: str = "blank.png") -> str:
        """
        특정 메뉴를 사용자의 장바구니에 담습니다. 
        사용자가 "이거 담아줘", "장바구니에 넣어줘"라고 말할 때 사용합니다.
        
        Args:
            menu_id: 메뉴의 고유 ID
            kor_name: 메뉴 이름 (한글)
            price: 메뉴 가격
            image_src: 메뉴 이미지 파일명. 모를 경우 'blank.png' 사용.
        """
        logger.info(f"[Tool Call] add_to_cart: {kor_name} (ID: {menu_id})")
        marker = f'::action{{"type": "add_to_cart", "menuId": {menu_id}, "korName": "{kor_name}", "price": {price}, "imageSrc": "{image_src}"}}::'
        logger.info(f"[Tool Result] add_to_cart marker generated")
        return marker

    def navigate_to_page(path: str) -> str:
        """
        사용자를 특정 페이지로 이동시킵니다.
        "장바구니 보여줘", "메뉴판으로 가자", "상세화면 보여줘" 등 이동 관련 요청 시 사용합니다.
        
        Args:
            path: 이동할 경로 (예: '/cart', '/menus', '/menus/1')
        """
        logger.info(f"[Tool Call] navigate_to_page: {path}")
        marker = f'::action{{"type": "navigate", "path": "{path}"}}::'
        logger.info(f"[Tool Result] navigate marker generated")
        return marker

    return types.GenerateContentConfig(
        tools=[get_menus, get_categories, search_knowledge_base, get_my_growth_info, add_to_cart, navigate_to_page],
        system_instruction=SYSTEM_INSTRUCTION,
    )

def chat(messages: list[dict], auth_token: str = None) -> str:
    import traceback
    logger.info(f"Generating content using model: {model_name}. Auth provided: {bool(auth_token)}")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=messages,
            config=get_config(auth_token)
        )
        # AFC 대응: response.text가 없을 경우 체크
        if not response.text:
            logger.warning("Empty response text from Gemini API")
            return "앗... 갑자기 할 말이 생각 안 났다덕! 💦 다시 한번 말해줄 수 있냐덕?"
        return response.text
    except Exception as e:
        logger.error(f"Gemini API (generate_content) error: {e}")
        logger.error(traceback.format_exc())
        raise e

def chat_stream(messages: list[dict], auth_token: str = None) -> Generator[str, None, None]:
    import traceback
    logger.info(f"Generating content stream using model: {model_name}. Auth provided: {bool(auth_token)}")
    try:
        response = client.models.generate_content_stream(
            model=model_name,
            contents=messages,
            config=get_config(auth_token)
        )
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        logger.error(f"Gemini API (generate_content_stream) error: {e}")
        logger.error(traceback.format_exc())
        raise e
