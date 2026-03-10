import requests
import os

# Docker 네트워크 내부에서 Spring Boot 백엔드에 접근하기 위한 기본 URL
BACKEND_URL = os.getenv("API_BASE_URL", "http://backend:8032")

def get_menus() -> dict:
    """
    카페에서 판매 중인 모든 메뉴 목록을 조회합니다.
    """
    try:
        response = requests.get(f"{BACKEND_URL}/menus")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"메뉴 목록을 가져오는 데 실패했습니다: {str(e)}"}

def get_categories() -> dict:
    """
    카페 메뉴의 카테고리 목록(예: 커피, 음료, 디저트 등)을 조회합니다.
    """
    try:
        response = requests.get(f"{BACKEND_URL}/categories")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"카테고리 목록을 가져오는 데 실패했습니다: {str(e)}"}

def get_my_growth_info(auth_token: str = None) -> dict:
    """
    로그인한 사용자의 현재 포인트, 누적 포인트, 성장 단계(레벨) 등 성장 정보를 조회합니다.
    """
    if not auth_token:
        return {"error": "로그인이 필요한 기능이다덕! 로그인 후 다시 물어봐달라덕~"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.get(f"{BACKEND_URL}/members/growth", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"성장 정보를 가져오는 데 실패했다덕: {str(e)}"}
