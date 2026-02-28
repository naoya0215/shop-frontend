"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, CartItem } from '../components/CartProvider';
import Header from '../components/Header';
import { useToast } from '../components/Toast';

const CartPage = () => {
    const { items, removeItem, updateQuantity, clearCart, getTotalAmount } = useCart();
    const { showToast } = useToast();
    const totalAmount = getTotalAmount();

    // 画像URL生成（商品詳細ページと同じロジック）
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) {
            return "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=300&fit=crop";
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        return `http://localhost:8000/api/images/${imagePath}`;
    };

    // 数量変更ハンドラー
    const handleQuantityChange = (item: CartItem, newQuantity: number) => {
        if (newQuantity < 1) {
            handleRemoveItem(item);
            return;
        }
        updateQuantity(item.id, item.size, newQuantity);
    };

    // アイテム削除ハンドラー
    const handleRemoveItem = (item: CartItem) => {
        removeItem(item.id, item.size);
        showToast(`${item.name} (サイズ: ${item.size}) をカートから削除しました`, 'info');
    };

    // カート全削除ハンドラー
    const handleClearCart = () => {
        if (confirm('カート内の商品をすべて削除しますか？')) {
            clearCart();
            showToast('カートを空にしました', 'info');
        }
    };

    // 価格文字列から数値を抽出
    const parsePrice = (priceStr: string): number => {
        return parseFloat(priceStr.replace(/[^\d]/g, '')) || 0;
    };

    // 価格を表示用にフォーマット
    const formatPrice = (price: number): string => {
        return `¥${price.toLocaleString()}`;
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                
                <main className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="bg-white rounded-lg shadow-lg p-12">
                            <div className="text-6xl mb-6">🛒</div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">カートは空です</h1>
                            <p className="text-gray-600 mb-8">お気に入りの商品を見つけてカートに追加しましょう。</p>
                            
                            <div className="space-x-4">
                                <Link 
                                    href="/products"
                                    className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all"
                                >
                                    商品を探す
                                </Link>
                                <Link 
                                    href="/"
                                    className="inline-block border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    ホームに戻る
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* ページタイトル */}
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">ショッピングカート</h1>
                    <p className="text-gray-600">{items.length}件の商品がカートに入っています</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* カートアイテム一覧 */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* カート操作ボタン */}
                        <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
                            <span className="text-sm text-gray-600">
                                合計 {items.reduce((sum, item) => sum + item.quantity, 0)} 点
                            </span>
                            <button
                                onClick={handleClearCart}
                                className="text-red-600 hover:text-red-700 text-sm transition-colors"
                            >
                                カートを空にする
                            </button>
                        </div>

                        {/* 商品リスト */}
                        {items.map((item) => (
                            <div 
                                key={`${item.id}-${item.size}`} 
                                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex gap-4">
                                    {/* 商品画像 */}
                                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                        <img 
                                            src={getImageUrl(item.image_path)}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* 商品情報 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                                <p className="text-sm text-gray-600">サイズ: {item.size}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* 数量調整 */}
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* 価格 */}
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-teal-600">
                                                    {formatPrice(parsePrice(item.price) * item.quantity)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    単価: {item.price}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 注文サマリー */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">注文内容</h2>
                            
                            {/* 合計詳細 */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>商品小計</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>送料</span>
                                    <span>{totalAmount >= 5000 ? '無料' : '¥500'}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>合計</span>
                                        <span>{formatPrice(totalAmount + (totalAmount >= 5000 ? 0 : 500))}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 送料無料まであといくら */}
                            {totalAmount < 5000 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                                    <p className="text-sm text-yellow-800 text-center">
                                        <strong>{formatPrice(5000 - totalAmount)}</strong>以上のお買い物で送料無料！
                                    </p>
                                </div>
                            )}

                            {/* 購入ボタン */}
                            <Link 
                                href="/checkout"
                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all mb-4 block text-center"
                            >
                                購入手続きへ
                            </Link>

                            {/* 買い物を続けるボタン */}
                            <Link 
                                href="/products"
                                className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                買い物を続ける
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CartPage;