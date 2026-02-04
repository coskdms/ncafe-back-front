'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { MenuOption, OptionItem } from '@/types/menu';
import styles from './OptionManager.module.css';

interface OptionManagerProps {
    options: MenuOption[];
    onChange: (options: MenuOption[]) => void;
}

export default function OptionManager({ options, onChange }: OptionManagerProps) {
    const addOptionGroup = () => {
        const newOption: MenuOption = {
            id: crypto.randomUUID(),
            name: '',
            type: 'radio',
            required: false,
            items: []
        };
        onChange([...options, newOption]);
    };

    const removeOptionGroup = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        onChange(newOptions);
    };

    const updateOptionGroup = (index: number, field: keyof MenuOption, value: any) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        onChange(newOptions);
    };

    const addItem = (groupIndex: number) => {
        const newOptions = [...options];
        const newItem: OptionItem = {
            id: crypto.randomUUID(),
            name: '',
            priceDelta: 0
        };
        newOptions[groupIndex].items.push(newItem);
        onChange(newOptions);
    };

    const removeItem = (groupIndex: number, itemIndex: number) => {
        const newOptions = [...options];
        newOptions[groupIndex].items.splice(itemIndex, 1);
        onChange(newOptions);
    };

    const updateItem = (groupIndex: number, itemIndex: number, field: keyof OptionItem, value: any) => {
        const newOptions = [...options];
        const item = newOptions[groupIndex].items[itemIndex];
        newOptions[groupIndex].items[itemIndex] = { ...item, [field]: value };
        onChange(newOptions);
    };

    return (
        <div className={styles.container}>
            {options.map((option, groupIndex) => (
                <div key={option.id} className={styles.optionCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerInputs}>
                            <div className={styles.inputGroup} style={{ flex: 2 }}>
                                <label className={styles.label}>옵션 그룹명</label>
                                <input
                                    value={option.name}
                                    onChange={(e) => updateOptionGroup(groupIndex, 'name', e.target.value)}
                                    placeholder="예: 사이즈 선택"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>선택 방식</label>
                                <select
                                    value={option.type}
                                    onChange={(e) => updateOptionGroup(groupIndex, 'type', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="radio">단일 선택</option>
                                    <option value="checkbox">다중 선택</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>필수 여부</label>
                                <select
                                    value={option.required ? 'true' : 'false'}
                                    onChange={(e) => updateOptionGroup(groupIndex, 'required', e.target.value === 'true')}
                                    className={styles.select}
                                >
                                    <option value="true">필수</option>
                                    <option value="false">선택</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => removeOptionGroup(groupIndex)}
                            className={styles.removeBtn}
                            title="옵션 그룹 삭제"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <div className={styles.itemsSection}>
                        <div className={styles.itemList}>
                            {option.items.map((item, itemIndex) => (
                                <div key={item.id} className={styles.itemRow}>
                                    <input
                                        value={item.name}
                                        onChange={(e) => updateItem(groupIndex, itemIndex, 'name', e.target.value)}
                                        placeholder="옵션명 (예: Large)"
                                        className={styles.input}
                                        style={{ flex: 2 }}
                                    />
                                    <div className={styles.priceInputWrapper}>
                                        <span className={styles.pricePrefix}>+</span>
                                        <input
                                            type="number"
                                            value={item.priceDelta}
                                            onChange={(e) => updateItem(groupIndex, itemIndex, 'priceDelta', Number(e.target.value))}
                                            placeholder="추가 금액"
                                            className={styles.priceInput}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(groupIndex, itemIndex)}
                                        className={styles.removeBtn}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addItem(groupIndex)}
                            className={styles.addBtn}
                        >
                            + 옵션 아이템 추가
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addOptionGroup}
                className={styles.addOptionBtn}
            >
                <Plus size={20} />
                새 옵션 그룹 추가
            </button>
        </div>
    );
}
