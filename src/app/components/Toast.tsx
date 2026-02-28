"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// トーストプロバイダー
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000) => {
        const id = Date.now().toString();
        const newToast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // 指定時間後に自動削除
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

// トーストコンテナーコンポーネント
const ToastContainer: React.FC<{ 
    toasts: Toast[]; 
    onRemove: (id: string) => void; 
}> = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <ToastItem 
                    key={toast.id} 
                    toast={toast} 
                    onRemove={() => onRemove(toast.id)} 
                />
            ))}
        </div>
    );
};

// 個別トーストアイテム
const ToastItem: React.FC<{ 
    toast: Toast; 
    onRemove: () => void; 
}> = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // マウント時にアニメーション開始
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onRemove, 300); // アニメーション完了後に削除
    };

    const getToastStyles = () => {
        const baseStyles = "flex items-center p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform";
        
        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
            case 'info':
                return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
            default:
                return `${baseStyles} bg-gray-50 border-gray-400 text-gray-800`;
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <span className="text-green-500 mr-3">✓</span>;
            case 'error':
                return <span className="text-red-500 mr-3">✕</span>;
            case 'info':
                return <span className="text-blue-500 mr-3">ℹ</span>;
            default:
                return null;
        }
    };

    return (
        <div
            className={`${getToastStyles()} ${
                isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-full'
            }`}
        >
            {getIcon()}
            <span className="flex-1">{toast.message}</span>
            <button
                onClick={handleClose}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                ✕
            </button>
        </div>
    );
};

// カスタムフック
export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};