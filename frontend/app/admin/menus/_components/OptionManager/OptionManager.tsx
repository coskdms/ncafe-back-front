'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { MenuOptionGroup, MenuOptionDetail } from '@/types/menu';
import styles from './OptionManager.module.css';

interface OptionManagerProps {
    options: MenuOptionGroup[];
    onChange: (options: MenuOptionGroup[]) => void;
}

export default function OptionManager({ options, onChange }: OptionManagerProps) {
    const addOptionGroup = () => {
        const newOption: MenuOptionGroup = {
            name: '',
            isMultiple: false,
            isRequired: false,
            sortOrder: options.length + 1,
            optionDetails: []
        };
        onChange([...options, newOption]);
    };

    const addDefaultDrinkOptions = () => {
        const newGroups: MenuOptionGroup[] = [
            {
                name: '온도',
                isMultiple: false,
                isRequired: true,
                sortOrder: options.length + 1,
                optionDetails: [
                    { name: 'HOT', additionalPrice: 0, sortOrder: 1 },
                    { name: 'ICE', additionalPrice: 0, sortOrder: 2 }
                ]
            },
            {
                name: '사이즈',
                isMultiple: false,
                isRequired: true,
                sortOrder: options.length + 2,
                optionDetails: [
                    { name: 'Regular (기본)', additionalPrice: 0, sortOrder: 1 },
                    { name: 'Large', additionalPrice: 500, sortOrder: 2 },
                    { name: 'Max', additionalPrice: 1000, sortOrder: 3 }
                ]
            }
        ];
        onChange([...options, ...newGroups]);
    };

    const removeOptionGroup = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        onChange(newOptions);
    };

    const updateOptionGroup = (index: number, field: keyof MenuOptionGroup, value: any) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        onChange(newOptions);
    };

    const addItem = (groupIndex: number) => {
        const newOptions = [...options];
        const newItem: MenuOptionDetail = {
            name: '',
            additionalPrice: 0,
            sortOrder: newOptions[groupIndex].optionDetails.length + 1
        };
        newOptions[groupIndex].optionDetails.push(newItem);
        onChange(newOptions);
    };

    const removeItem = (groupIndex: number, itemIndex: number) => {
        const newOptions = [...options];
        newOptions[groupIndex].optionDetails.splice(itemIndex, 1);
        onChange(newOptions);
    };

    const updateItem = (groupIndex: number, itemIndex: number, field: keyof MenuOptionDetail, value: any) => {
        const newOptions = [...options];
        const item = newOptions[groupIndex].optionDetails[itemIndex];
        newOptions[groupIndex].optionDetails[itemIndex] = { ...item, [field]: value };
        onChange(newOptions);
    };

    return (
        <div className={styles.container}>
            {options.map((option, groupIndex) => (
                <div key={option.id || `group-${groupIndex}`} className={styles.optionCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerInputs}>
                            <div className={styles.inputGroup} style={{ flex: 2 }}>
                                <label className={styles.label}>옵션 그룹명</label>
                                <input
                                    value={option.name}
                                    onChange={(e) => updateOptionGroup(groupIndex, 'name', e.target.value)}
                                    placeholder="예: 사이즈 선택"
                                    className={styles.input}
                                    maxLength={30}
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>선택 방식</label>
                                <select
                                    value={option.isMultiple ? 'true' : 'false'}
                                    onChange={(e) => updateOptionGroup(groupIndex, 'isMultiple', e.target.value === 'true')}
                                    className={styles.select}
                                >
                                    <option value="false">단일 선택</option>
                                    <option value="true">다중 선택</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>필수 여부</label>
                                <select
                                    value={option.isRequired ? 'true' : 'false'}
                                    onChange={(e) => updateOptionGroup(groupIndex, 'isRequired', e.target.value === 'true')}
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
                            {option.optionDetails.map((item, itemIndex) => (
                                <div key={item.id || `item-${groupIndex}-${itemIndex}`} className={styles.itemRow}>
                                    <input
                                        value={item.name}
                                        onChange={(e) => updateItem(groupIndex, itemIndex, 'name', e.target.value)}
                                        placeholder="옵션명 (예: Large)"
                                        className={styles.input}
                                        style={{ flex: 2 }}
                                        maxLength={30}
                                    />
                                    <div className={styles.priceInputWrapper}>
                                        <span className={styles.pricePrefix}>+</span>
                                        <input
                                            type="number"
                                            value={item.additionalPrice}
                                            onChange={(e) => updateItem(groupIndex, itemIndex, 'additionalPrice', Number(e.target.value))}
                                            placeholder="추가 금액"
                                            className={styles.priceInput}
                                            min={0}
                                            max={999999}
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                const num = Number(input.value);
                                                if (num > 999999) input.value = '999999';
                                                if (num < 0) input.value = '0';
                                            }}
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

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    onClick={addOptionGroup}
                    className={styles.addOptionBtn}
                >
                    <Plus size={20} />
                    새 옵션 그룹 추가
                </button>

                <button
                    type="button"
                    onClick={addDefaultDrinkOptions}
                    className={styles.addOptionBtn}
                    style={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}
                >
                    <Plus size={20} />
                    (기본) 음료 옵션 추가
                </button>
            </div>
        </div>
    );
}
