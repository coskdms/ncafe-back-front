/**
 * 카카오(다음) 우편번호 검색 유틸리티
 * API 키 불필요, 무료 서비스
 */

declare global {
    interface Window {
        daum: any;
    }
}

interface AddressResult {
    zonecode: string;      // 우편번호
    roadAddress: string;   // 도로명 주소
    jibunAddress: string;  // 지번 주소
    fullAddress: string;   // 최종 주소 (도로명 우선)
}

/**
 * 카카오 우편번호 검색 팝업을 열고 선택된 주소를 반환
 */
export function openAddressSearch(): Promise<AddressResult> {
    return new Promise((resolve, reject) => {
        if (!window.daum || !window.daum.Postcode) {
            reject(new Error('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.'));
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data: any) => {
                // 도로명 주소를 우선 사용
                let fullAddress = data.roadAddress || data.jibunAddress;

                // 건물명이 있으면 추가
                if (data.buildingName) {
                    fullAddress += ` (${data.buildingName})`;
                }

                resolve({
                    zonecode: data.zonecode,
                    roadAddress: data.roadAddress,
                    jibunAddress: data.jibunAddress,
                    fullAddress,
                });
            },
            onclose: () => {
                // 팝업이 닫힐 때 (X 버튼 등)
            },
            width: '100%',
            height: '100%',
        }).open();
    });
}
