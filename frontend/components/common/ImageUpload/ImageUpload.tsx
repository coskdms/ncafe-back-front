'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import styles from './ImageUpload.module.css';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

export type ImageFile = File | { id?: string; url: string; isPrimary?: boolean };

interface ImageUploadProps {
    images: ImageFile[];
    onChange: (files: ImageFile[]) => void;
    maxFiles?: number;
    maxFileSize?: number; // bytes, 기본 10MB
}

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUpload({
    images,
    onChange,
    maxFiles = 5,
    maxFileSize = DEFAULT_MAX_FILE_SIZE
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);

    const getImageSrc = (file: ImageFile) => {
        if (file instanceof File) {
            return URL.createObjectURL(file);
        }
        return file.url;
    };

    const getFileSize = (file: ImageFile): string | null => {
        if (file instanceof File) {
            return formatFileSize(file.size);
        }
        return null;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
        // input 초기화 (같은 파일 재선택 가능하도록)
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const addFiles = async (newFiles: File[]) => {
        setStatusMessage(null);

        const availableSlots = maxFiles - images.length;
        if (availableSlots <= 0) return;

        // 이미지 파일만 필터링
        const imageFiles = newFiles
            .filter(file => file.type.startsWith('image/'))
            .slice(0, availableSlots);

        if (imageFiles.length === 0) {
            setStatusMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' });
            return;
        }

        // 원본 크기 체크 (너무 큰 파일 사전 경고)
        const oversizedOriginals = imageFiles.filter(f => f.size > maxFileSize);

        setIsCompressing(true);
        setStatusMessage({ type: 'info', text: '이미지를 최적화하고 있습니다...' });

        try {
            // 모든 이미지 압축
            const compressedFiles = await Promise.all(
                imageFiles.map(file => compressImage(file))
            );

            // 압축 후에도 제한 초과하는 파일 체크
            const stillOversized = compressedFiles.filter(f => f.size > maxFileSize);
            const validFiles = compressedFiles.filter(f => f.size <= maxFileSize);

            if (stillOversized.length > 0) {
                const names = stillOversized.map(f => f.name).join(', ');
                setStatusMessage({
                    type: 'error',
                    text: `${stillOversized.length}개 파일(${names})이 압축 후에도 ${formatFileSize(maxFileSize)}를 초과합니다. 더 작은 이미지를 사용해주세요.`
                });
            } else if (oversizedOriginals.length > 0) {
                // 원본은 초과했지만 압축으로 해결된 경우
                const totalOriginal = imageFiles.reduce((sum, f) => sum + f.size, 0);
                const totalCompressed = compressedFiles.reduce((sum, f) => sum + f.size, 0);
                const savedPercent = Math.round((1 - totalCompressed / totalOriginal) * 100);
                setStatusMessage({
                    type: 'success',
                    text: `이미지가 자동 압축되었습니다 (${formatFileSize(totalOriginal)} → ${formatFileSize(totalCompressed)}, ${savedPercent}% 절약)`
                });
            } else {
                // 모든 파일이 정상 범위 내
                const totalOriginal = imageFiles.reduce((sum, f) => sum + f.size, 0);
                const totalCompressed = compressedFiles.reduce((sum, f) => sum + f.size, 0);
                if (totalOriginal > totalCompressed) {
                    const savedPercent = Math.round((1 - totalCompressed / totalOriginal) * 100);
                    setStatusMessage({
                        type: 'success',
                        text: `이미지 최적화 완료 (${savedPercent}% 절약)`
                    });
                } else {
                    setStatusMessage(null);
                }
            }

            if (validFiles.length > 0) {
                onChange([...images, ...validFiles]);
            }
        } catch (err) {
            console.error('이미지 압축 오류:', err);
            setStatusMessage({ type: 'error', text: '이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.' });
        } finally {
            setIsCompressing(false);
        }
    };

    const removeFile = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
        setStatusMessage(null);
    };

    const setPrimary = (index: number) => {
        if (index === 0) return;
        const newImages = [...images];
        const [target] = newImages.splice(index, 1);
        newImages.unshift(target);
        onChange(newImages);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            addFiles(Array.from(e.dataTransfer.files));
        }
    };

    const isFull = images.length >= maxFiles;
    const isDisabled = isFull || isCompressing;

    return (
        <div className={styles.container}>
            <div
                className={`${styles.uploadArea} ${isDragging ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}
                onClick={() => !isDisabled && fileInputRef.current?.click()}
                onDragOver={!isDisabled ? handleDragOver : undefined}
                onDragLeave={!isDisabled ? handleDragLeave : undefined}
                onDrop={!isDisabled ? handleDrop : undefined}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className={styles.fileInput}
                    onChange={handleFileChange}
                    disabled={isDisabled}
                />

                {isCompressing ? (
                    <>
                        <Loader2 size={32} className={`${styles.uploadIcon} ${styles.spinning}`} />
                        <p className={styles.uploadText}>
                            <strong>이미지 최적화 중...</strong><br />
                            잠시만 기다려주세요
                        </p>
                    </>
                ) : isFull ? (
                    <> 
                        <Upload size={32} className={styles.uploadIcon} />
                        <p className={styles.uploadText}>
                            <strong>이미지가 최대 {maxFiles}장입니다</strong><br />
                            기존 이미지를 삭제 후 추가해주세요
                        </p>
                    </>
                ) : (
                    <>
                        <Upload size={32} className={styles.uploadIcon} />
                        <p className={styles.uploadText}>
                            <strong>클릭하여 업로드</strong> 또는 파일을 여기까지 드래그하세요
                        </p>
                        <p className={styles.uploadHint}>
                            {images.length} / {maxFiles}장 · 파일당 최대 {formatFileSize(maxFileSize)} · 자동 압축 적용
                        </p>
                    </>
                )}
            </div>

            {/* 상태 메시지 (압축 결과, 에러 등) */}
            {statusMessage && (
                <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
                    {statusMessage.text}
                </div>
            )}

            {images.length > 0 && (
                <div className={styles.previewGrid}>
                    {images.map((file, index) => (
                        <div
                            key={index}
                            className={`${styles.previewItem} ${index === 0 ? styles.primary : ''}`}
                            onClick={() => setPrimary(index)}
                            title={index === 0 ? "대표 이미지입니다" : "클릭하여 대표 이미지로 설정"}
                        >
                            <Image
                                src={getImageSrc(file)}
                                alt={`Preview ${index}`}
                                fill
                                className={styles.image}
                                unoptimized={true}
                            />

                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                            >
                                <X size={14} />
                            </button>

                            {index === 0 ? (
                                <span className={styles.primaryBadge}>대표</span>
                            ) : (
                                <div className={styles.setPrimaryOverlay}>
                                    <span className={styles.setPrimaryBtn}>대표 설정</span>
                                </div>
                            )}

                            {/* 파일 크기 표시 */}
                            {getFileSize(file) && (
                                <span className={styles.fileSizeBadge}>
                                    {getFileSize(file)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
