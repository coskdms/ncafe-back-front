/**
 * 폼 유효성 검사 유틸리티
 * 빈 필수 입력란으로 스크롤 이동 + 포커스 + 시각적 하이라이트
 */

/**
 * 첫 번째 비어있는 필수 입력란으로 스크롤 이동 + 포커스
 * @param formRef - form 요소 또는 CSS 선택자
 * @returns 유효하면 true, 비어있는 필드가 있으면 false
 */
export function scrollToFirstEmpty(formRef: HTMLFormElement | string): boolean {
    const form = typeof formRef === 'string' 
        ? document.querySelector<HTMLFormElement>(formRef)
        : formRef;
    
    if (!form) return true;

    const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input[required], select[required], textarea[required]'
    );

    for (const field of fields) {
        const value = field.value.trim();
        const isEmpty = !value || (field.tagName === 'SELECT' && value === '');
        
        if (isEmpty) {
            highlightAndScroll(field);
            return false;
        }
    }

    return true;
}

/**
 * 특정 요소로 스크롤 + 포커스 + 흔들림 애니메이션
 */
export function highlightAndScroll(element: HTMLElement): void {
    // 스무스 스크롤
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });

    // 포커스 (스크롤 완료 후)
    setTimeout(() => {
        element.focus({ preventScroll: true });
    }, 400);

    // 흔들림 + 하이라이트 애니메이션
    element.classList.add('field-shake');
    element.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.3)';
    element.style.borderColor = '#ef4444';
    
    setTimeout(() => {
        element.classList.remove('field-shake');
        element.style.boxShadow = '';
        element.style.borderColor = '';
    }, 1500);
}

/**
 * ID로 요소를 찾아서 스크롤 + 포커스
 */
export function scrollToField(fieldId: string): void {
    const el = document.getElementById(fieldId);
    if (el) highlightAndScroll(el);
}
