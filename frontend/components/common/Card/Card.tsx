'use client';

import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export default function Card({
    children,
    className = '',
    onClick,
    hoverable = false
}: CardProps) {
    const classNames = [
        styles.card,
        hoverable ? styles.hoverable : '',
        onClick ? styles.clickable : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    );
}
