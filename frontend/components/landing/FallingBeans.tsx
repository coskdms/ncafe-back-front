'use client';

import React, { useEffect, useRef } from 'react';
import styles from './FallingBeans.module.css';

interface FallingBean {
    x: number;
    y: number;
    spriteIdx: number;
    rotation: number;
    rotationSpeed: number;
    speed: number;
    wobbleOffset: number;
    wobbleSpeed: number;
    opacity: number;
}

function createEmojiSprites(): HTMLCanvasElement[] {
    const emojis = ['☕', '🫘', '🫘', '🫘', '☕'];
    return emojis.map((emoji) => {
        const c = document.createElement('canvas');
        c.width = 40;
        c.height = 40;
        const cx = c.getContext('2d')!;
        cx.font = '30px serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText(emoji, 20, 22);
        return c;
    });
}

export default function FallingBeans() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beansRef = useRef<FallingBean[]>([]);
    const spritesRef = useRef<HTMLCanvasElement[]>([]);
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

        const createBean = (randomY = false): FallingBean => ({
            x: Math.random() * canvas.width,
            y: randomY ? Math.random() * canvas.height : -50 - Math.random() * 100,
            spriteIdx: Math.floor(Math.random() * spritesRef.current.length),
            rotation: (Math.random() - 0.5) * 0.6,
            rotationSpeed: (Math.random() - 0.5) * 0.008,
            speed: Math.random() * 0.5 + 0.2,
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.01 + 0.003,
            opacity: Math.random() * 0.35 + 0.15,
        });

        for (let i = 0; i < 12; i++) {
            beansRef.current.push(createBean(true));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            beansRef.current.forEach((bean) => {
                bean.y += bean.speed;
                bean.rotation += bean.rotationSpeed;
                bean.wobbleOffset += bean.wobbleSpeed;
                bean.x += Math.sin(bean.wobbleOffset) * 0.3;

                if (bean.y > canvas.height + 50) {
                    bean.y = -50;
                    bean.x = Math.random() * canvas.width;
                }

                const sprite = spritesRef.current[bean.spriteIdx];
                ctx.save();
                ctx.translate(bean.x, bean.y);
                ctx.rotate(bean.rotation);
                ctx.globalAlpha = bean.opacity;
                ctx.drawImage(sprite, -20, -20);
                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
