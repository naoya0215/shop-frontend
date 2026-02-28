"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import { useToast } from '../components/Toast';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    category: string;
    message: string;
}

const ContactPage = () => {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [form, setForm] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        category: '',
        message: ''
    });

    // フォーム更新
    const updateForm = (field: keyof ContactForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // バリデーション
    const validateForm = () => {
        const required = ['name', 'email', 'category', 'message'];
        const missing = required.filter(field => !form[field as keyof ContactForm].trim());
        
        if (missing.length > 0) {
            showToast('必須項目を入力してください', 'error');
            return false;
        }

        // メールアドレス形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            showToast('正しいメールアドレスを入力してください', 'error');
            return false;
        }

        return true;
    };

    // フォーム送信
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // バリデーションに失敗したら送信しない
        if (!validateForm()) return;
        // 送信状態を管理
        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:8001/api/contacts', { // APIエンドポイント
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast(data.message, 'success');
                
                // フォームリセット
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    category: '',
                    message: ''
                });
            } else {
                const errorMessage = data.errors 
                    ? Object.values(data.errors).flat().join('\n')
                    : data.message || '送信中にエラーが発生しました';
                showToast(errorMessage, 'error');
            }
            
        } catch (error) {
            console.error('送信エラー:', error);
            showToast('送信中にエラーが発生しました。時間をおいて再度お試しください。', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">お問い合わせ</h1>
                
                {/* デモ注意書き */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-blue-800 mb-1">デモサイトについて</h3>
                            <p className="text-sm text-blue-700">
                                これはデモサイトです。お問い合わせは実際には送信されませんので、テスト用の内容で構いません。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* お問い合わせフォーム */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            お名前 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => updateForm('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="山田 太郎"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            メールアドレス <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => updateForm('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            電話番号
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => updateForm('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="090-1234-5678"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            お問い合わせの種類 <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => updateForm('category', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">選択してください</option>
                                            <option value="product">商品について</option>
                                            <option value="order">注文について</option>
                                            <option value="shipping">配送について</option>
                                            <option value="payment">お支払いについて</option>
                                            <option value="return">返品・交換について</option>
                                            <option value="technical">技術的な問題</option>
                                            <option value="other">その他</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            お問い合わせ内容 <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => updateForm('message', e.target.value)}
                                            rows={8}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="お問い合わせ内容を詳しくご記入ください"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? '送信中...' : 'お問い合わせを送信'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* サイドバー情報 */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* 営業時間・連絡先 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">店舗情報</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">営業時間</h4>
                                    <p className="text-gray-600">
                                        月〜金：10:00 - 17:00<br />
                                        土日祝：定休日
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">電話番号</h4>
                                    <p className="text-gray-600">
                                        <span className="text-teal-600 hover:text-teal-700">
                                            042-000-0000
                                        </span>
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">メールアドレス</h4>
                                    <p className="text-gray-600">
                                        <a href="mailto:support@nexus-store.jp" className="text-teal-600 hover:text-teal-700">
                                            support@nexus-store.jp
                                        </a>
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">住所</h4>
                                    <p className="text-gray-600">
                                        〒182-0011<br />
                                        大阪府大阪市...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* よくある質問 */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">よくある質問</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-900">送料について</h4>
                                    <p className="text-gray-600">5,000円以上のご購入で送料無料です。</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900">配送日数</h4>
                                    <p className="text-gray-600">通常2-3営業日でお届けします。</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900">返品・交換</h4>
                                    <p className="text-gray-600">商品到着から30日以内であれば可能です。</p>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-900">お支払い方法</h4>
                                    <p className="text-gray-600">クレジットカード、銀行振込、代引きに対応。</p>
                                </div>
                            </div>
                        </div>

                        {/* お問い合わせ後の流れ */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">お問い合わせ後の流れ</h3>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-medium text-teal-600">1</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">自動返信メール</h4>
                                        <p className="text-xs text-gray-600">お問い合わせ受付の確認メールをお送りします</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-medium text-teal-600">2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">内容確認</h4>
                                        <p className="text-xs text-gray-600">担当者がお問い合わせ内容を確認いたします</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-xs font-medium text-teal-600">3</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">ご回答</h4>
                                        <p className="text-xs text-gray-600">2営業日以内にメールでご回答いたします</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;