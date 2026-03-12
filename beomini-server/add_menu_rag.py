import sys
import os

# Add /app to sys.path to import app modules if running in docker
# Or use current directory structure
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'app')))

from app.services.embedding import get_embedding
from app.services.vector_db import save_document, init_db

# Ensure DB is initialized
init_db()

menu_knowledge = [
    {
        "title": "카페인 없는 음료 추천 (디카페인)",
        "content": """[고라파덕 카페 카페인 프리 메뉴 가이드]

밤늦게 커피 마시기 부담스럽거나 카페인에 민감한 분들을 위한 추천 메뉴다덕!

1. 바나나 라떼 (Best! 🍌)
- 커피가 전혀 들어가지 않은 달콤하고 고소한 바나나 우유 맛 라떼다덕! 아이들도 아주 좋아한다덕.

2. 음료/티 카테고리의 과일 에이드류
- 신선한 과일로 만든 시원한 에이드들은 카페인이 전혀 없다덕!

앗, 우리 카페의 모든 커피 메뉴는 아쉽게도 아직 '디카페인 원두' 변경 서비스는 준비 중이다덕. 커피 맛을 위해 조금만 더 기다려달라덕!"""
    },
    {
        "title": "알레르기 유발 물질 안내 (쿠키/디저트)",
        "content": """[고라파덕 카페 알레르기 안내]

맛있는 디저트를 안전하게 즐기기 위해 확인해달라덕!

1. 견과류 알레르기 주의:
- '아몬드 쿠키': 아몬드 슬라이스가 가득 들어있다덕! 🥜
- '두바이 쫀득 쿠키': 피스타치오 스프레드가 포함되어 있을 수 있으니 주의해달라덕.
- 모든 쿠키류는 같은 제조 시설에서 만들어지므로 소량의 견과류가 혼입될 가능성이 있다덕.

2. 유제품/달걀:
- 모든 케이크류(딸기 케이크, 초코 무스)와 샌드위치, 빵류에는 우유와 달걀이 포함되어 있다덕.

혹시 못 먹는 음식이 있다면 주문 전에 꼭 나(파덕이)나 사장님께 물어봐달라덕!"""
    },
    {
        "title": "시그니처 커피 상세 정보",
        "content": """[고라파덕 카페 시그니처 커피]

우리 카페에서만 맛볼 수 있는 특별한 메뉴, '시그니처 커피'를 소개한다덕! ✨

- 맛의 특징: 진한 에스프레소 위에 사장님만의 비법이 담긴 '수제 고구마 크림'이 듬뿍 올라간 아인슈페너 스타일의 커피다덕.
- 먹는 법: 빨대를 쓰지 말고 컵을 기울여 크림과 커피를 한 번에 마시는 게 가장 맛있다덕!
- 가격: 6,000원

달콤 쌉쌀한 맛이 머리아픈 고민을 싹 날려줄 거다덕~ quack!"""
    }
]

print("Adding detailed menu & safety RAG data...")

for doc in menu_knowledge:
    content = doc["content"]
    title = doc["title"]
    embedding = get_embedding(content)
    save_document(title, content, embedding)
    print(f"Added: {title}")

print("RAG data expansion complete!")
