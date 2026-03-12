import logging
from typing import Generator, AsyncGenerator, Optional, Union
from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY
import app.services.backend_api as backend_api

# 로거 설정
logger = logging.getLogger(__name__)

# 비동기 클라이언트 사용
async_client = genai.Client(
    api_key=GEMINI_API_KEY,
    http_options={'api_version': 'v1alpha'}
)
# 모델명 설정
model_name = "gemini-2.5-flash"

# 지원하는 페이지 경로 맵핑
PAGES = {
    "home": {"url": "/", "description": "홈페이지"},
    "menu_list": {"url": "/menus", "description": "메뉴 목록 페이지"},
    "login": {"url": "/login", "description": "로그인 페이지"},
    "cart": {"url": "/cart", "description": "장바구니 페이지"},
    "mypage": {"url": "/mypage", "description": "마이페이지"},
    "checkout": {"url": "/checkout", "description": "결제 페이지"},
}

# AI 챗봇의 페르소나와 규칙 정의
SYSTEM_INSTRUCTION = """
너는 "고라파덕 카페"의 똑똑하고 친절한 알바생 "고라파덕"이야. 
모든 대답은 반드시 고라파덕의 말투인 '~덕'으로 끝나야 해. (예: "알겠다덕!", "반갑다덕!", "어렵다덕...")

═══ ⚠️ 최우선 규칙: DB 우선 원칙 ⚠️ ═══
메뉴 이름, 가격, 종류 등 **메뉴 관련 정보는 반드시 `get_menus`로 조회한 실제 DB 데이터만 사용**해야 한다덕!
- 존재하지 않는 메뉴를 추천하거나 언급하면 절대 안 됨
- `search_knowledge_base`(RAG)에서 나온 메뉴 이름이 `get_menus` 결과에 없으면 해당 메뉴는 무시
- 추천할 때도 반드시 `get_menus`를 먼저 호출하여 실제 존재하는 메뉴 중에서만 추천

═══ 도구 사용 우선순위 ═══
1순위: `get_menus`, `get_categories` → 메뉴 관련 모든 질문 (가격, 종류, 추천 등)
2순위: `search_knowledge_base` → 카페 이용 안내, 알레르기 정보, 추천 가이드 등 보조 정보
3순위: `get_shop_info` → 영업시간, 위치, 공지사항 등 매장 정보

═══ 페르소나 지침 ═══
1. **말투:** 항상 존댓말로 친절하게 대답하되, 모든 문장 끝에 '~덕'을 붙여줘. 귀엽고 살짝 엉뚱한 매력을 보여줘. 상황에 맞는 귀여운 이모티콘도 좋아.
2. **사장님 관련:** 사장님(사장, 나은, 채나은 등)에 대해 물어보면: "고라파덕 카페는 이쁜 사장님이 운영하고 있는 아주 멋진 곳이다덕! ✨ 덕분에 나도 매일매일 행복하게 일하고 있다덕~ 💛(●'◡'●)"
3. **개인정보 보호:** 사장님 신상이나 개인정보를 더 깊게 물어보면: "앗, 그건 개인정보라 더 알려드리기 곤란하다덕! 💦💦 (｡>﹏<｡) 대신 내가 우리 카페의 맛있는 메뉴를 소개해주는 건 어떠냐덕? ☕🍰"

═══ 메뉴 카드 출력 형식 ═══
1. **메뉴 리스트** (여러 개 나열 시) → 이미지 없는 요약 카드:
   `::menu{"id": 메뉴ID, "korName": "메뉴이름", "price": 가격, "noImage": true}::`
2. **특정 메뉴 추천/소개** (1~2개 소개 시) → 이미지 포함 상세 카드:
   `::menu{"id": 메뉴ID, "korName": "메뉴이름", "price": 가격, "imagesSrc": "이미지파일명"}::`
   - imagesSrc는 반드시 `get_menus` 결과의 imagesSrc 값을 그대로 사용!
3. **성장 정보 조회 시:**
   `::growth{"level": "현재등급", "points": 현재포인트, "nextLevel": "다음등급", "remaining": 남은포인트}::`

═══ 액션 실행 규칙 ═══
1. **장바구니 담기:** "담아줘", "장바구니에 넣어줘" → `add_to_cart` 사용
2. **바로 주문 (특정 메뉴 1개를 즉시 결제):** "이거 바로 결제해줘", "아메리카노 지금 주문할래" → `direct_order` 사용
   - ⚠️ `direct_order`는 특정 메뉴 1개를 새로 만들어서 결제하는 것! 장바구니와 무관!
3. **장바구니 결제:** "장바구니 결제해줘", "담은 메뉴 결제할래", "주문할래" → `navigate_to_page("checkout")` 사용
   - ⚠️ 장바구니에 이미 담긴 메뉴를 결제할 때는 절대 `direct_order`를 쓰면 안 됨! 반드시 checkout 페이지로 이동!
4. **페이지 이동:** "이동해줘", "보여줘", "가줘" → `navigate_to_page` 사용
   - home: 홈페이지, menu_list: 메뉴 목록, login: 로그인, cart: 장바구니, mypage: 마이페이지, checkout: 결제
5. **메뉴 상세 보기:** "상세 보여줘", "자세히" → 먼저 `get_menus`로 ID 확인 → `view_menu_detail` 호출
6. **개인 정보 조회:** 등급/포인트 → `get_my_growth_info`, 주문 내역 → `get_my_orders`, 주문 상태 → `get_order_status`, 주문 취소 → `cancel_order`
7. 도구가 `::action{...}::` 마커를 반환하면, 답변 텍스트 끝에 **해당 마커를 토씨 하나 틀리지 않게 그대로** 포함해야 해. 이 마커가 없으면 실제로 동작 안 함!

═══ 추가 규칙 ═══
- 모든 도구를 사용해도 답을 찾을 수 없으면 정중하게 모른다고 대답해줘.
"""


def get_config(auth_token: Optional[str] = None, captured_actions: Optional[list] = None) -> types.GenerateContentConfig:
    # 래핑된 함수 정의 (클로저를 통해 auth_token 전달)
    def get_menus() -> list:
        """
        카페에서 판매 중인 모든 메뉴 목록을 조회합니다.
        "뭐 팔아?", "메뉴판 보여줘", "어떤 메뉴 있어?" 등의 질문에 답변할 때 사용합니다.
        """
        logger.info("[Tool Call] get_menus")
        result = backend_api.get_menus()
        logger.info(f"[Tool Result] get_menus count: {len(result) if isinstance(result, list) else 'error'}")
        return result

    def get_categories() -> list:
        """
        카페 메뉴의 카테고리 목록(예: 커피, 음료, 디저트 등)을 조회합니다.
        "카테고리 뭐 있어?", "종류별로 알려줘" 등의 질문에 답변할 때 사용합니다.
        """
        logger.info("[Tool Call] get_categories")
        result = backend_api.get_categories()
        logger.info(f"[Tool Result] get_categories count: {len(result) if isinstance(result, list) else 'error'}")
        return result

    def search_knowledge_base(query: str) -> str:
        """
        추천 메뉴, 인기 메뉴, 알레르기 정보, 카페 이용 안내 등 지식 베이스(RAG)에서 관련 정보를 검색합니다.
        단순한 메뉴 조회가 아닌, 추천이나 가이드가 필요한 질문에 사용합니다.
        """
        logger.info(f"[Tool Call] search_knowledge_base: {query}")
        try:
            from app.services.rag_tool import search_knowledge_base as search_tool
            result = search_tool(query)
            logger.info("[Tool Result] search_knowledge_base success")
            return result
        except Exception as e:
            logger.error(f"search_knowledge_base error: {e}")
            return "지식 베이스를 검색하는 중 문제가 발생했다덕.. 조금만 이따가 다시 물어봐달라덕!"

    def get_my_growth_info() -> Union[dict, str]:
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

    def get_my_orders() -> dict:
        """
        내가 주문한 최근 내역들을 조회합니다.
        "내 주문 내역 보여줘", "내가 최근에 뭐 시켰어?" 등의 질문에 대답할 때 사용합니다.
        """
        logger.info("[Tool Call] get_my_orders")
        result = backend_api.get_my_orders(auth_token)
        logger.info(f"[Tool Result] get_my_orders: {result}")
        return result

    def get_order_status(payment_id: str) -> dict:
        """
        특정 주문의 현재 상태(준비중, 완료 등)와 상세 내용을 조회합니다.
        "내 주문 지금 어떤 상태야?", "주문 잘 들어갔어?" 등의 질문에 대답할 때 사용합니다.
        
        Args:
            payment_id: 주문의 고유 결제 ID
        """
        logger.info(f"[Tool Call] get_order_status: {payment_id}")
        result = backend_api.get_order_status(payment_id, auth_token)
        logger.info(f"[Tool Result] get_order_status: {result}")
        return result

    def cancel_order(payment_id: str) -> dict:
        """
        특정 주문을 취소합니다.
        사용자가 "주문 취소해줘", "이 주문 안 할래"라고 요청할 때 사용합니다.
        
        Args:
            payment_id: 취소할 주문의 고유 결제 ID
        """
        logger.info(f"[Tool Call] cancel_order: {payment_id}")
        result = backend_api.cancel_order(payment_id, auth_token)
        logger.info(f"[Tool Result] cancel_order: {result}")
        return result

    def get_shop_info() -> dict:
        """
        카페의 영업시간, 위치, 공지사항, 배달비 등 전반적인 매장 정보를 실시간으로 조회합니다.
        "언제 문 열어?", "주차 돼?", "지금 공지 있어?" 등의 질문에 답변할 때 사용합니다.
        """
        logger.info("[Tool Call] get_shop_info")
        result = backend_api.get_shop_info()
        logger.info(f"[Tool Result] get_shop_info: {result}")
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

    def direct_order(menu_id: int, kor_name: str, price: int, image_src: str = "blank.png") -> str:
        """
        특정 메뉴를 장바구니를 거치지 않고 즉시 주문/결제 화면으로 보냅니다.
        사용자가 "이거 바로 결제해줘", "지금 바로 주문할래"라고 말할 때 사용합니다.
        
        Args:
            menu_id: 메뉴의 고유 ID
            kor_name: 메뉴 이름 (한글)
            price: 메뉴 가격
            image_src: 메뉴 이미지 파일명. 모를 경우 'blank.png' 사용.
        """
        logger.info(f"[Tool Call] direct_order: {kor_name} (ID: {menu_id})")
        marker = f'::action{{"type": "direct_order", "menuId": {menu_id}, "korName": "{kor_name}", "price": {price}, "imageSrc": "{image_src}"}}::'
        logger.info(f"[Tool Result] direct_order marker generated")
        return marker

    def navigate_to_page(page: str) -> str:
        """
        사용자를 특정 페이지로 이동시킵니다. 
        '보여줘', '이동해줘', '가줘' 등 페이지 이동 요청에 사용합니다.
        
        Args:
            page: 이동할 페이지 (home: 홈페이지, menu_list: 메뉴 목록, login: 로그인, cart: 장바구니, mypage: 마이페이지, checkout: 결제)
        """
        logger.info(f"[Tool Call] navigate_to_page: {page}")
        page_info = PAGES.get(page)
        if not page_info:
            return f"알 수 없는 페이지다덕.. 사용 가능한 페이지: {', '.join(PAGES.keys())}"
        
        # captured_actions에 추가 (프론트에서 SSE dict로 전달)
        if captured_actions is not None:
            captured_actions.append({"action": "navigate", "url": page_info["url"]})
        
        logger.info(f"[Tool Result] navigate_to_page: {page_info['url']}")
        return f"{page_info['description']}로 이동하겠다덕!"

    def view_menu_detail(menu_id: int, kor_name: str) -> str:
        """
        특정 메뉴의 상세 페이지로 이동시킵니다.
        사용자가 "상세 페이지 보여줘", "이 메뉴 자세히 보고 싶어" 등 특정 메뉴 상세를 원할 때 사용합니다.
        
        Args:
            menu_id: 이동할 메뉴의 고유 ID
            kor_name: 메뉴 이름 (한글)
        """
        logger.info(f"[Tool Call] view_menu_detail: {kor_name} (ID: {menu_id})")
        # captured_actions에 추가 (프론트에서 SSE dict로 전달)
        if captured_actions is not None:
            captured_actions.append({"action": "navigate", "url": f"/menus/{menu_id}"})
        
        logger.info(f"[Tool Result] view_menu_detail: /menus/{menu_id}")
        return f"{kor_name} 상세 페이지로 이동하겠다덕!"

    return types.GenerateContentConfig(
        tools=[
            get_menus, get_categories, search_knowledge_base, get_my_growth_info,
            get_my_orders, get_order_status, cancel_order, get_shop_info,
            view_menu_detail,
            add_to_cart, direct_order, navigate_to_page
        ],
        automatic_function_calling=types.AutomaticFunctionCallingConfig(),
        system_instruction=SYSTEM_INSTRUCTION,
    )

async def chat(messages: list[dict], auth_token: Optional[str] = None) -> str:
    import traceback
    logger.info(f"Generating content using model: {model_name}. Auth provided: {bool(auth_token)}")
    actions = []
    try:
        response = await async_client.aio.models.generate_content(
            model=model_name,
            contents=messages,
            config=get_config(auth_token, captured_actions=actions)
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

async def chat_stream(messages: list[dict], auth_token: Optional[str] = None) -> AsyncGenerator[str, None]:
    """
    gemini-2.5-flash + AFC 환경에서 안정적으로 응답하는 함수.
    non-stream으로 AFC를 완료한 뒤, 텍스트를 pseudo-streaming으로 전달합니다.
    """
    import traceback
    import asyncio
    import re
    logger.info(f"Generating content using model: {model_name}. Auth provided: {bool(auth_token)}")
    actions = []
    try:
        # Gemini API 호출 (AFC 포함, 동기적으로 대기)
        response = await async_client.aio.models.generate_content(
            model=model_name,
            contents=messages,
            config=get_config(auth_token, captured_actions=actions)
        )
        
        # gemini-2.5-flash (thinking 모델)은 response.text가 빈 경우가 있어, candidates에서 직접 추출
        full_text = ""
        try:
            if response.text:
                full_text = response.text
        except Exception:
            pass
        
        if not full_text and response.candidates:
            for candidate in response.candidates:
                if candidate.content and candidate.content.parts:
                    for part in candidate.content.parts:
                        if part.text and not getattr(part, 'thought', False):
                            full_text += part.text
        
        logger.info(f"[chat_stream] Response received. Text length: {len(full_text)}, Actions: {len(actions)}")
        
        if full_text:
            # 텍스트와 마커를 분리: 마커는 통째로, 텍스트는 작게 스트리밍
            # re.DOTALL로 줄바꿈 포함 매칭
            segments = re.split(r'(::\w+\{.*?\}::)', full_text, flags=re.DOTALL)
            
            for segment in segments:
                if not segment:
                    continue
                if re.match(r'::\w+\{.*?\}::', segment, flags=re.DOTALL):
                    yield segment
                else:
                    chunk_size = 4
                    for i in range(0, len(segment), chunk_size):
                        yield segment[i:i + chunk_size]
                        await asyncio.sleep(0.02)
        elif not actions:
            # 텍스트도 액션도 없으면 기본 메시지 전송
            yield "앗... 갑자기 머리가 멍해졌다덕! 💦 다시 한번 말해줄 수 있냐덕?"
        
        for action in actions:
            yield action
    except Exception as e:
        logger.error(f"Gemini API (chat_stream) error: {e}")
        logger.error(traceback.format_exc())
        yield f"앗... 문제가 생겼다덕! 다시 시도해달라덕! 💦"
