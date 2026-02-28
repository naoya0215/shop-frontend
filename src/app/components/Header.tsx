"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';

interface HeaderProps {
    showBackButton?: boolean;
    onBackClick?: () => void;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
    showBackButton = false,
    onBackClick,
    className = ''
}) => {
    const router = useRouter();
    const { getCartItemsCount } = useCart();
    const cartItemCount = getCartItemsCount();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 戻るボタンのハンドラー
    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            router.back();
        }
    };

    return (
        <header className={`bg-white shadow-sm sticky top-0 z-50 ${className}`}>
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* ロゴ */}
                    <Link href="/" className="flex-shrink-0">
                        <div>
                            <div className="text-2xl font-cursive text-teal-600">NEXUS STORE</div>
                            <div className="text-sm font-serif">ネクサス・ストア</div>
                        </div>
                    </Link>

                    {/* デスクトップナビゲーション */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link 
                            href="/" 
                            className="text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/products" 
                            className="text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            Product
                        </Link>
                        <Link 
                            href="/contact" 
                            className="text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            contact
                        </Link>
                    </nav>

                    {/* 右側のアクション */}
                    <div className="flex items-center space-x-4">
                        {/* カートアイコン */}
                        <Link 
                            href="/cart"
                            className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            <svg 
                                className="w-6 h-6" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L21 21H7m0-8v8a2 2 0 002 2h10a2 2 0 002-2v-8m-4-4v4m-6-4v4" 
                                />
                            </svg>
                            
                            {/* カートバッジ */}
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* 戻るボタン */}
                        {showBackButton && (
                            <button 
                                onClick={handleBackClick}
                                className="text-gray-600 hover:text-teal-600 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                戻る
                            </button>
                        )}

                        {/* モバイルメニューボタン */}
                        <button 
                            className="md:hidden w-6 h-6 flex flex-col justify-center items-center space-y-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <div className="text-2xl">✕</div>
                            ) : (
                                <>
                                    <div className="w-5 h-0.5 bg-gray-600"></div>
                                    <div className="w-5 h-0.5 bg-gray-600"></div>
                                    <div className="w-5 h-0.5 bg-gray-600"></div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* モバイルメニュー */}
            {isMenuOpen && (
                <div className="md:hidden bg-gradient-to-br from-teal-500 to-cyan-400 text-white">
                    <div className="px-4 py-6 space-y-4">
                        <Link 
                            href="/" 
                            className="block text-2xl font-medium hover:text-teal-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/products" 
                            className="block text-2xl font-medium hover:text-teal-100 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link 
                            href="/cart" 
                            className="block text-2xl font-medium hover:text-teal-100 transition-colors border-t border-teal-300 pt-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cart {cartItemCount > 0 && `(${cartItemCount})`}
                        </Link>
                    </div>
                </div>
            )}

            <style jsx>{`
                .font-cursive {
                    font-family: 'Dancing Script', cursive;
                }
            `}</style>
        </header>
    );
};

export default Header;