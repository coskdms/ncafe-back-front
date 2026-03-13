/**
 * 전화번호 유효성 검사 (하이픈 포함/미포함 모두 허용)
 * 010-1234-5678 또는 01012345678 형태
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/[-\s]/g, '');
    return /^01[016789]\d{7,8}$/.test(cleaned);
}

/**
 * 전화번호 포맷팅 (표시용: 010-1234-5678)
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/[-\s]/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

/**
 * 비밀번호 유효성 검사
 * - 8자 이상
 * - 영문, 숫자, 특수문자 각각 1개 이상 포함
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
    if (password.length < 8) {
        return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
    }
    if (!/[A-Za-z]/.test(password)) {
        return { isValid: false, message: '비밀번호에 영문자를 포함해주세요.' };
    }
    if (!/\d/.test(password)) {
        return { isValid: false, message: '비밀번호에 숫자를 포함해주세요.' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
        return { isValid: false, message: '비밀번호에 특수문자를 포함해주세요.' };
    }
    return { isValid: true, message: '' };
}

/**
 * 비밀번호 강도 확인 (UI 표시용)
 */
export function getPasswordStrength(password: string): { level: number; label: string; color: string } {
    if (!password) return { level: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Za-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: '약함', color: '#ef4444' };
    if (score <= 3) return { level: 2, label: '보통', color: '#f59e0b' };
    if (score <= 4) return { level: 3, label: '강함', color: '#22c55e' };
    return { level: 4, label: '매우 강함', color: '#059669' };
}

/**
 * 아이디(닉네임) 유효성 검사
 * - 2~20자
 * - 영문, 숫자, 한글, 밑줄(_)만 허용
 */
export function validateNickname(nickname: string): { isValid: boolean; message: string } {
    if (nickname.length < 2) {
        return { isValid: false, message: '아이디는 2자 이상이어야 합니다.' };
    }
    if (nickname.length > 20) {
        return { isValid: false, message: '아이디는 20자 이하여야 합니다.' };
    }
    if (!/^[a-zA-Z0-9가-힣_]+$/.test(nickname)) {
        return { isValid: false, message: '아이디는 영문, 숫자, 한글, 밑줄(_)만 사용 가능합니다.' };
    }
    return { isValid: true, message: '' };
}

/**
 * 주소 유효성 검사
 */
export function isValidAddress(address: string): boolean {
    return address.trim().length >= 5;
}

/**
 * 이름 유효성 검사
 */
export function isValidName(name: string): boolean {
    return name.trim().length >= 1;
}
