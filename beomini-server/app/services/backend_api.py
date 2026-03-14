import requests
import os

# Docker 네트워크 내부에서 Spring Boot 백엔드에 접근하기 위한 기본 URL
BACKEND_URL = os.getenv("API_BASE_URL", "http://backend:8032")

def get_menus() -> list:
    """
    카페에서 판매 중인 모든 메뉴 목록을 조회합니다.
    """
    try:
        response = requests.get(f"{BACKEND_URL}/menus")
        response.raise_for_status()
        data = response.json()
        # API가 {"menus": [...]} 형태로 반환
        if isinstance(data, dict) and "menus" in data:
            return data["menus"]
        return data
    except Exception as e:
        return {"error": f"메뉴 목록을 가져오는 데 실패했습니다: {str(e)}"}

def get_categories() -> list:
    """
    카페 메뉴의 카테고리 목록(예: 커피, 음료, 디저트 등)을 조회합니다.
    """
    try:
        response = requests.get(f"{BACKEND_URL}/categories")
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and "categories" in data:
            return data["categories"]
        return data
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

def get_my_orders(auth_token: str = None) -> dict:
    """
    로그인한 사용자의 최근 주문 내역 목록을 조회합니다.
    "내 주문 내역 보여줘", "내가 최근에 뭐 시켰어?" 등의 질문에 답변할 때 사용합니다.
    """
    if not auth_token:
        return {"error": "로그인이 필요한 기능이다덕! 로그인 후 다시 물어봐달라덕~"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.get(f"{BACKEND_URL}/orders/mine", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"주문 내역을 가져오는 데 실패했다덕: {str(e)}"}

def get_order_status(payment_id: str, auth_token: str = None) -> dict:
    """
    특정 주문ID(paymentId)에 대한 상세 정보 및 진행 상태를 조회합니다.
    "내 주문 지금 어떤 상태야?", "주문 잘 들어갔어?" 등의 질문에 답변할 때 사용합니다.
    """
    if not auth_token:
        return {"error": "로그인이 필요한 기능이다덕! 로그인 후 다시 물어봐달라덕~"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.get(f"{BACKEND_URL}/orders/{payment_id}", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"주문 정보를 가져오는 데 실패했다덕: {str(e)}"}

def cancel_order(payment_id: str, auth_token: str = None) -> dict:
    """
    특정 주문ID(paymentId)를 가진 주문을 취소 처리합니다.
    사용자가 "주문 취소해줘", "이 주문 안 할래"라고 요청할 때 사용합니다.
    """
    if not auth_token:
        return {"error": "로그인이 필요한 기능이다덕! 로그인 후 다시 물어봐달라덕~"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.post(f"{BACKEND_URL}/orders/{payment_id}/cancel", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"주문 취소에 실패했다덕: {str(e)}"}

def get_shop_info() -> dict:
    """
    카페의 영업시간, 위치, 공지사항, 배달비 등 전반적인 매장 정보를 조회합니다.
    "언제 문 열어?", "주차 돼?", "지금 공지 있어?" 등의 질문에 답변할 때 사용합니다.
    """
    try:
        response = requests.get(f"{BACKEND_URL}/settings")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"매장 정보를 가져오는 데 실패했다덕: {str(e)}"}


# ═══════════════════════════════════════
# 관리자 전용 API
# ═══════════════════════════════════════

def get_all_orders(auth_token: str = None, status: str = None) -> dict:
    """
    전체 주문 목록을 조회합니다 (관리자 전용).
    """
    if not auth_token:
        return {"error": "관리자 인증이 필요한 기능이다덕!"}
    
    try:
        headers = {"Authorization": auth_token}
        params = {}
        if status:
            params["status"] = status
        response = requests.get(f"{BACKEND_URL}/admin/orders", headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"주문 목록을 가져오는 데 실패했다덕: {str(e)}"}

def update_order_status(auth_token: str, payment_id: str, new_status: str) -> dict:
    """
    특정 주문의 상태를 변경합니다 (관리자 전용).
    paymentId 기반, PATCH 메서드 사용.
    """
    if not auth_token:
        return {"error": "관리자 인증이 필요한 기능이다덕!"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.patch(
            f"{BACKEND_URL}/admin/orders/{payment_id}/status",
            headers=headers,
            json={"status": new_status}
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"주문 상태 변경에 실패했다덕: {str(e)}"}

def get_sales_summary(auth_token: str, period: str = "today") -> dict:
    """
    대시보드 통계 (오늘 주문 수, 메뉴 수, 품절 수, 오늘 매출)를 조회합니다 (관리자 전용).
    """
    if not auth_token:
        return {"error": "관리자 인증이 필요한 기능이다덕!"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.get(f"{BACKEND_URL}/admin/dashboard/stats", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"매출 정보를 가져오는 데 실패했다덕: {str(e)}"}


def get_my_favorites(auth_token: str) -> list:
    """
    회원의 찜한 메뉴 ID 목록을 조회합니다.
    """
    if not auth_token:
        return {"error": "로그인이 필요한 기능이다덕!"}
    
    try:
        headers = {"Authorization": auth_token}
        response = requests.get(f"{BACKEND_URL}/favorites/ids", headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"찜 목록을 가져오는 데 실패했다덕: {str(e)}"}
