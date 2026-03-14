'use client';

import React, { useState, useEffect } from 'react';
import { Save, Truck, Coins, ShieldCheck, Info } from 'lucide-react';
import styles from './Settings.module.css';
import { fetchAPI } from '@/app/lib/api';
import Button from '@/components/common/Button/Button';
import { toast } from '@/stores/toastStore';
import { getErrorMessage } from '@/utils/errorMessage';

interface ShopSettings {
    shopName: string;
    businessHours: string;
    shopPhone: string;
    shopAddress: string;
    notice: string;
    minOrderAmount: number;
    deliveryFee: number;
    estimatedPrepTime: string;
    pointAccrualRate: number;
    level1Threshold: number;
    level2Threshold: number;
    level3Threshold: number;
    level4Threshold: number;
}

type TabType = 'store' | 'ordering' | 'loyalty' | 'security';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<ShopSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('store');
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const data = await fetchAPI('/admin/settings');
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!settings) return;

        setSettings(prev => {
            if (!prev) return prev;
            
            // Handle number values
            const numFields = ['minOrderAmount', 'deliveryFee', 'pointAccrualRate', 'level1Threshold', 'level2Threshold', 'level3Threshold', 'level4Threshold'];
            if (numFields.includes(name)) {
                return { ...prev, [name]: parseFloat(value) || 0 };
            }
            
            return { ...prev, [name]: value };
        });
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!settings) return;

        setIsSaving(true);
        setSaveMessage('');
        try {
            await fetchAPI('/admin/settings', {
                method: 'PUT',
                body: JSON.stringify(settings)
            });
            setSaveMessage('설정이 저장되었습니다! 🐤✨');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error(getErrorMessage(error, '설정 저장 중 오류가 발생했습니다.'));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <p>파덕이가 설정을 불러오고 있어요... 🐤</p>
            </div>
        );
    }

    if (!settings) return null;

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>관리자 설정 🐤⚙️</h1>
                        <p>매장의 기본 정보와 운영 정책을 관리하세요.</p>
                    </div>
                    <button 
                        onClick={() => handleSave()} 
                        className={styles.saveBtn}
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                        disabled={isSaving}
                    >
                        <Save size={18} />
                        {isSaving ? '저장 중...' : '지금 저장'}
                    </button>
                </div>
            </header>

            <nav className={styles.tabs}>
                <button 
                    type="button"
                    className={`${styles.tab} ${activeTab === 'store' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('store')}
                >
                    매장 정보
                </button>
                <button 
                    type="button"
                    className={`${styles.tab} ${activeTab === 'ordering' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('ordering')}
                >
                    주문 정책
                </button>
                <button 
                    type="button"
                    className={`${styles.tab} ${activeTab === 'loyalty' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('loyalty')}
                >
                    포인트 & 등급
                </button>
            </nav>

            <form onSubmit={handleSave}>
                {activeTab === 'store' && (
                    <div className={styles.section}>
                        <div className={styles.formGrid}>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>매장 이름 ☕️</label>
                                <input 
                                    name="shopName"
                                    value={settings.shopName}
                                    onChange={handleInputChange}
                                    placeholder="N-Cafe 우리동네 커피숍"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>영업 시간 ⏰</label>
                                <input 
                                    name="businessHours"
                                    value={settings.businessHours}
                                    onChange={handleInputChange}
                                    placeholder="09:00 - 20:00"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>매장 전화번호 📞</label>
                                <input 
                                    name="shopPhone"
                                    value={settings.shopPhone}
                                    onChange={handleInputChange}
                                    placeholder="010-0000-0000"
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>매장 주소 📍</label>
                                <input 
                                    name="shopAddress"
                                    value={settings.shopAddress}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>매장 공지사항 (상단 배너 및 팝업 용) 📣</label>
                                <textarea 
                                    name="notice"
                                    value={settings.notice}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ordering' && (
                    <div className={styles.section}>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label>최소 주문 금액 (₩) 🏷️</label>
                                <input 
                                    type="number"
                                    name="minOrderAmount"
                                    value={settings.minOrderAmount}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>기본 배송비 (₩) 🚚</label>
                                <input 
                                    type="number"
                                    name="deliveryFee"
                                    value={settings.deliveryFee}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>예상 조리 시간 ⏱️</label>
                                <input 
                                    name="estimatedPrepTime"
                                    value={settings.estimatedPrepTime}
                                    onChange={handleInputChange}
                                    placeholder="15분 - 20분"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'loyalty' && (
                    <div className={styles.section}>
                        <div className={styles.formGrid}>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>포인트 적립률 (0.01 = 1%) 💰</label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    name="pointAccrualRate"
                                    value={settings.pointAccrualRate}
                                    onChange={handleInputChange}
                                />
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                                    결제 금액의 {(settings.pointAccrualRate * 100).toFixed(1)}% 가 포인트로 적립됩니다.
                                </p>
                            </div>
                            
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{ marginTop: '2rem' }}>
                                <label>등급별 누적 포인트 기준 (Level Thresholds) 🐣</label>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    사용자가 다음 등급으로 진화하기 위해 필요한 '누적 포인트' 값을 설정합니다.
                                </p>
                                
                                <div className={styles.thresholdCard}>
                                    <div className={styles.thresholdHeader}>
                                        <h4>Lv.1 갓 태어난 알</h4>
                                        <input 
                                            type="number"
                                            name="level1Threshold"
                                            value={settings.level1Threshold}
                                            onChange={handleInputChange}
                                            style={{ width: '120px' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>기본 등급입니다 (보통 0 설정)</p>
                                </div>

                                <div className={styles.thresholdCard}>
                                    <div className={styles.thresholdHeader}>
                                        <h4>Lv.2 아기 고라파덕</h4>
                                        <input 
                                            type="number"
                                            name="level2Threshold"
                                            value={settings.level2Threshold}
                                            onChange={handleInputChange}
                                            style={{ width: '120px' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>아기 파덕으로 진화하기 위한 누적 포인트</p>
                                </div>

                                <div className={styles.thresholdCard}>
                                    <div className={styles.thresholdHeader}>
                                        <h4>Lv.3 청소년 골덕</h4>
                                        <input 
                                            type="number"
                                            name="level3Threshold"
                                            value={settings.level3Threshold}
                                            onChange={handleInputChange}
                                            style={{ width: '120px' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>청소년 골덕으로 진화하기 위한 누적 포인트</p>
                                </div>

                                <div className={styles.thresholdCard}>
                                    <div className={styles.thresholdHeader}>
                                        <h4>Lv.4 현자 고라파덕</h4>
                                        <input 
                                            type="number"
                                            name="level4Threshold"
                                            value={settings.level4Threshold}
                                            onChange={handleInputChange}
                                            style={{ width: '120px' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>최종 단계인 현자 파덕이 되는 기준</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <footer className={styles.footer}>
                    {saveMessage && <span className={styles.successMsg}>{saveMessage}</span>}
                    <button 
                        type="submit" 
                        className={styles.saveBtn}
                        disabled={isSaving}
                    >
                        <Save size={20} />
                        {isSaving ? '저장 중...' : '모든 설정 저장하기'}
                    </button>
                </footer>
            </form>
        </main>
    );
}
