'use client';

import React, { useEffect, useRef } from 'react';
import styles from './CursorBeans.module.css';

interface Bean {
    x: number;
    y: number;
    spriteIdx: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    velocityX: number;
    velocityY: number;
    life: number;
}

function createEmojiSprites(): HTMLCanvasElement[] {
    const emojis = ['☕', '🫘', '🫘', '🫘'];
    return emojis.map((emoji) => {
        const c = document.createElement('canvas');
        c.width = 36;
        c.height = 36;
        const cx = c.getContext('2d')!;
        cx.font = '26px serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(emoji, 18, 20);
        return c;
    });
}

export default function CursorBeans() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beansRef = useRef<Bean[]>([]);
    const spritesRef = useRef<HTMLCanvasElement[]>([]);
    const mouseRef = useRef({ x: -100, y: -100 });
    const lastSpawnRef = useRef(0);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        spritesRef.current = createEmojiSprites();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const handleMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', handleMove);

        const spawnBean = () => {
            const { x, y } = mouseRef.current;
            if (x < 0) return;
            if (beansRef.current.length > 20) return;

            beansRef.current.push({
                x,
                y,
                spriteIdx: Math.floor(Math.random() * spritesRef.current.length),
                rotation: (Math.random() - 0.5) * 0.8,
                rotationSpeed: (Math.random() - 0.5) * 0.05,
                opacity: 0.85,
                velocityX: (Math.random() - 0.5) * 1.5,
                velocityY: Math.random() * 1.2 + 0.4,
                life: 1,
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            if (now - lastSpawnRef.current > 120) {
                spawnBean();
                lastSpawnRef.current = now;
            }

            beansRef.current.forEach((bean) => {
                bean.x += bean.velocityX;
                bean.y += bean.velocityY;
                bean.rotation += bean.rotationSpeed;
                bean.life -= 0.018;
                bean.opacity = Math.max(0, bean.life * 0.85);
            });

            beansRef.current = beansRef.current.filter((b) => b.life > 0);

            beansRef.current.forEach((bean) => {
                const sprite = spritesRef.current[bean.spriteIdx];
                ctx.save();
                ctx.translate(bean.x, bean.y);
                ctx.rotate(bean.rotation);
                ctx.globalAlpha = bean.opacity;
                ctx.drawImage(sprite, -18, -18);
                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
