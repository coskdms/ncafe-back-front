'use client';

import React, { useEffect, useRef } from 'react';
import styles from './FallingBeans.module.css';

interface FallingItem {
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

const EMOJIS = ['⭐', '💛', '☕', '🦆', '⭐', '💛'];

function createSprites(): HTMLCanvasElement[] {
    return EMOJIS.map((emoji) => {
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

export default function FallingBeans() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const itemsRef = useRef<FallingItem[]>([]);
    const spritesRef = useRef<HTMLCanvasElement[]>([]);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        spritesRef.current = createSprites();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const createItem = (randomY = false): FallingItem => ({
            x: Math.random() * canvas.width,
            y: randomY ? Math.random() * canvas.height : -50 - Math.random() * 100,
            spriteIdx: Math.floor(Math.random() * spritesRef.current.length),
            rotation: (Math.random() - 0.5) * 0.6,
            rotationSpeed: (Math.random() - 0.5) * 0.008,
            speed: Math.random() * 0.5 + 0.15,
            wobbleOffset: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.01 + 0.003,
            opacity: Math.random() * 0.3 + 0.12,
        });

        for (let i = 0; i < 12; i++) {
            itemsRef.current.push(createItem(true));
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            itemsRef.current.forEach((item) => {
                item.y += item.speed;
                item.rotation += item.rotationSpeed;
                item.wobbleOffset += item.wobbleSpeed;
                item.x += Math.sin(item.wobbleOffset) * 0.3;

                if (item.y > canvas.height + 50) {
                    item.y = -50;
                    item.x = Math.random() * canvas.width;
                }

                const sprite = spritesRef.current[item.spriteIdx];
                ctx.save();
                ctx.translate(item.x, item.y);
                ctx.rotate(item.rotation);
                ctx.globalAlpha = item.opacity;
                ctx.drawImage(sprite, -18, -18);
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
