/**
 * 이미지 압축 유틸리티
 *
 * Canvas API를 사용하여 브라우저에서 이미지를 리사이즈 + JPEG 압축합니다.
 * 서버로 전송하기 전에 파일 크기를 줄여 업로드 속도와 안정성을 개선합니다.
 */

/** 리사이즈 최대 해상도 (px) */
const MAX_DIMENSION = 1280;
/** JPEG 압축 품질 (0~1) */
const QUALITY = 0.85;
/** 압축 건너뛰기 임계값: 이 크기 이하면 압축하지 않음 */
const SKIP_THRESHOLD = 500 * 1024; // 500KB

/**
 * 이미지를 리사이즈 + JPEG 압축하여 File 객체로 반환
 * - 500KB 이하 이미지는 압축을 건너뜁니다.
 * - 압축 결과가 원본보다 크면 원본을 반환합니다.
 * - 에러 발생 시 원본 File을 그대로 반환합니다.
 */
export async function compressImage(file: File): Promise<File> {
    // 이미지 파일이 아닌 경우 원본 반환
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // 이미 충분히 작은 파일은 압축 생략
    if (file.size <= SKIP_THRESHOLD) {
        return file;
    }

    return new Promise<File>((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            // 리사이즈 비율 계산 (긴 변 기준)
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            // Canvas에 그리기
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(file);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // JPEG Blob으로 변환
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // 파일명에서 확장자 제거 후 .jpg 붙이기
                    const baseName = file.name.replace(/\.[^.]+$/, '');
                    const compressedFile = new File(
                        [blob],
                        `${baseName}.jpg`,
                        { type: 'image/jpeg', lastModified: Date.now() }
                    );

                    // 압축 결과가 원본보다 크면 원본 반환
                    resolve(compressedFile.size < file.size ? compressedFile : file);
                },
                'image/jpeg',
                QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // 에러 시 원본 반환
        };

        img.src = url;
    });
}

/**
 * 바이트 크기를 사람이 읽기 쉬운 문자열로 변환
 * ex) 1048576 → "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
