/**
 * 메뉴의 옵션 정보를 가져와서 필수 옵션을 디폴트로 선택한 결과를 반환합니다.
 * 
 * @param menuId 메뉴 ID
 * @returns { options, additionalPrice } 또는 null (옵션 없음)
 */
export async function getDefaultOptions(menuId: number): Promise<{
    options: Record<string, string>;
    additionalPrice: number;
} | null> {
    try {
        const res = await fetch(`/api/menus/${menuId}`);
        if (!res.ok) return null;
        
        const detail = await res.json();
        if (!detail.optionGroups || detail.optionGroups.length === 0) return null;
        
        const options: Record<string, string> = {};
        let additionalPrice = 0;
        
        for (const group of detail.optionGroups) {
            if (group.isRequired && group.optionDetails.length > 0) {
                // 필수 옵션: 첫 번째 항목을 디폴트로 선택
                const firstOption = group.optionDetails[0];
                options[group.name] = firstOption.name;
                additionalPrice += firstOption.additionalPrice || 0;
            }
        }
        
        return { options, additionalPrice };
    } catch (err) {
        console.error('Failed to fetch menu options:', err);
        return null;
    }
}
