'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    fullWidth?: boolean;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        disabled ? styles.disabled : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classNames} disabled={disabled} {...props}>
            {children}
        </button>
    );
}
