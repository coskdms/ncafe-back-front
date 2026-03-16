'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/common/Button';
import { useCategories } from '@/app/admin/_components/category/CategoryTabs/useCategories';
import ImageUpload, { ImageFile } from '@/components/common/ImageUpload/ImageUpload';
import OptionManager from '@/app/admin/menus/_components/OptionManager/OptionManager';
import { MenuFormData as BaseMenuFormData } from '@/types/menu';
import styles from './MenuForm.module.css';

// MenuFormData 재정의
export interface MenuFormData extends Omit<BaseMenuFormData, 'images'> {
    images: ImageFile[];
}

interface MenuFormProps {
    initialData?: Partial<MenuFormData>;
    onSubmit: (data: MenuFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function MenuForm({ initialData, onSubmit, onCancel, isLoading }: MenuFormProps) {
    const { categories } = useCategories();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<MenuFormData>({
        defaultValues: {
            isAvailable: true,
            description: '',
            engName: '',
            images: [],
            optionGroups: [],
            ...initialData
        }
    });

    // initialData가 비동기로 전달될 때 (수정 모드) 폼 값을 재동기화
    useEffect(() => {
        if (initialData) {
            reset({
                isAvailable: true,
                description: '',
                engName: '',
                images: [],
                optionGroups: [],
                ...initialData,
                // categoryId를 String으로 통일 (select option value와 일치시키기 위해)
                categoryId: String(initialData.categoryId || ''),
            });
        }
    }, [initialData, reset]);

    const images = watch('images') || [];
    const optionGroups = watch('optionGroups') || [];

    // 가격 콤마 포맷용
    const [priceDisplay, setPriceDisplay] = useState('');
    useEffect(() => {
        if (initialData?.price !== undefined) {
            setPriceDisplay(Number(initialData.price).toLocaleString());
        }
    }, [initialData?.price]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* 기본 정보 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>기본 정보</h3>
                    <p className={styles.sectionDescription}>메뉴의 이름과 분류를 입력해주세요.</p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.fullWidth}>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                한글 메뉴명 <span className={styles.required}>*</span>
                            </label>
                            <input
                                {...register('korName', { required: '한글 메뉴명을 입력해주세요' })}
                                className={styles.input}
                                placeholder="예: 아메리카노"
                                maxLength={50}
                            />
                            {errors.korName && <span className={styles.errorMsg}>{errors.korName.message}</span>}
                        </div>
                    </div>

                    <div className={styles.fullWidth}>
                        <div className={styles.field}>
                            <label className={styles.label}>영문 메뉴명</label>
                            <input
                                {...register('engName')}
                                className={styles.input}
                                placeholder="예: Americano"
                                maxLength={100}
                            />
                        </div>
                    </div>

                    <div>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                카테고리 <span className={styles.required}>*</span>
                            </label>
                            <select
                                {...register('categoryId', { required: '카테고리를 선택해주세요' })}
                                className={`${styles.input} ${styles.select}`}
                            >
                                <option value="">선택해주세요</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <span className={styles.errorMsg}>{errors.categoryId.message}</span>}
                        </div>
                    </div>

                    <div>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                가격 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={priceDisplay}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                    if (raw === '') {
                                        setPriceDisplay('');
                                        setValue('price', 0 as any);
                                        return;
                                    }
                                    let num = parseInt(raw, 10);
                                    if (num > 9999999) num = 9999999;
                                    setPriceDisplay(num.toLocaleString());
                                    setValue('price', num as any, { shouldValidate: true });
                                }}
                                className={styles.input}
                                placeholder="0"
                            />
                            <input
                                type="hidden"
                                {...register('price', {
                                    required: '가격을 입력해주세요',
                                    min: { value: 0, message: '가격은 0원 이상이어야 합니다' },
                                    max: { value: 9999999, message: '가격은 9,999,999원 이하로 입력해주세요' }
                                })}
                            />
                            {errors.price && <span className={styles.errorMsg}>{errors.price.message}</span>}
                        </div>
                    </div>
                </div>
            </section>

            {/* 메뉴 이미지 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>메뉴 이미지</h3>
                    <p className={styles.sectionDescription}>
                        메뉴 이미지를 등록해주세요. 첫 번째 이미지가 대표 이미지가 됩니다.
                    </p>
                </div>
                <ImageUpload
                    images={images}
                    onChange={(files) => setValue('images', files)}
                />
            </section>

            {/* 옵션 설정 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>옵션 설정</h3>
                    <p className={styles.sectionDescription}>
                        사이즈, 샷 추가 등 메뉴의 옵션을 설정해주세요.
                    </p>
                </div>
                <OptionManager
                    options={optionGroups}
                    onChange={(newOptions) => setValue('optionGroups', newOptions)}
                />
            </section>

            {/* 상세 정보 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>상세 정보</h3>
                    <p className={styles.sectionDescription}>고객에게 보여질 상세 설명을 입력해주세요.</p>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>메뉴 설명</label>
                    <textarea
                        {...register('description')}
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="메뉴에 대한 설명을 입력해주세요."
                        maxLength={500}
                    />
                </div>
            </section>

            {/* 판매 설정 */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>판매 설정</h3>
                </div>
                <div className={styles.field} style={{ flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                    <input
                        type="checkbox"
                        id="isAvailable"
                        {...register('isAvailable')}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="isAvailable" className={styles.label} style={{ cursor: 'pointer', margin: 0 }}>
                        판매 가능 상태로 등록하기
                    </label>
                </div>
            </section>

            <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? '저장 중...' : '메뉴 저장하기'}
                </Button>
            </div>
        </form>
    );
}
