'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import styles from './ImageUpload.module.css';

export type ImageFile = File | { id?: string; url: string; isPrimary?: boolean };

interface ImageUploadProps {
    images: ImageFile[];
    onChange: (files: ImageFile[]) => void;
    maxFiles?: number;
}

export default function ImageUpload({ images, onChange, maxFiles = 5 }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const getImageSrc = (file: ImageFile) => {
        if (file instanceof File) {
            return URL.createObjectURL(file);
        }
        return file.url;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files));
        }
    };

    const addFiles = (newFiles: File[]) => {
        const availableSlots = maxFiles - images.length;
        if (availableSlots <= 0) return;

        const filesToAdd = newFiles.filter(file => file.type.startsWith('image/')).slice(0, availableSlots);

        if (filesToAdd.length > 0) {
            onChange([...images, ...filesToAdd]);
        }
    };

    const removeFile = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
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

    return (
        <div className={styles.container}>
            <div
                className={`${styles.uploadArea} ${isDragging ? styles.active : ''} ${isFull ? styles.disabled : ''}`}
                onClick={() => !isFull && fileInputRef.current?.click()}
                onDragOver={!isFull ? handleDragOver : undefined}
                onDragLeave={!isFull ? handleDragLeave : undefined}
                onDrop={!isFull ? handleDrop : undefined}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className={styles.fileInput}
                    onChange={handleFileChange}
                    disabled={isFull}
                />
                <Upload size={32} className={styles.uploadIcon} />
                {isFull ? (
                    <p className={styles.uploadText}>
                        <strong>이미지가 최대 {maxFiles}장입니다</strong><br />
                        기존 이미지를 삭제 후 추가해주세요
                    </p>
                ) : (
                    <>
                        <p className={styles.uploadText}>
                            <strong>클릭하여 업로드</strong> 또는 파일을 여기까지 드래그하세요
                        </p>
                        <p className={styles.uploadText} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            ({images.length} / {maxFiles}장)
                        </p>
                    </>
                )}
            </div>

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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
