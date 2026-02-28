"use client";

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';

const OrderCompletePage = () => {
    // 注文番号を生成（実際はAPIから取得）
    const orderNumber = `ORD-${Date.now()}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="max-w-2xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                    {/* 成功アイコン */}
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">ご注文ありがとうございました！</h1>
                    
                    <p className="text-gray-600 mb-8">
                        ご注文を正常に受け付けました。<br />
                        確認メールをお送りしておりますので、ご確認ください。
                    </p>

                    {/* 注文情報 */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">注文番号</h3>
                                <p className="text-lg font-mono">{orderNumber}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">お届け予定日</h3>
                                <p className="text-lg">{estimatedDelivery.toLocaleDateString('ja-JP')}</p>
                            </div>
                        </div>
                    </div>

                    {/* 次のステップ */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start space-x-3 text-left">
                            <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-medium text-teal-600">1</span>
                            </div>
                            <div>
                                <h4 className="font-medium">注文確認メール送信</h4>
                                <p className="text-sm text-gray-600">ご登録のメールアドレスに確認メールをお送りしました</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 text-left">
                            <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-medium text-teal-600">2</span>
                            </div>
                            <div>
                                <h4 className="font-medium">商品準備・発送</h4>
                                <p className="text-sm text-gray-600">1-2営業日以内に商品を準備し、発送いたします</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 text-left">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-xs font-medium text-gray-600">3</span>
                            </div>
                            <div>
                                <h4 className="font-medium">お届け</h4>
                                <p className="text-sm text-gray-600">発送後、1-2日でお届け予定です</p>
                            </div>
                        </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="space-y-4">
                        <Link 
                            href="/products"
                            className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors inline-block"
                        >
                            引き続きお買い物する
                        </Link>
                        
                        <Link 
                            href="/"
                            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors inline-block"
                        >
                            ホームに戻る
                        </Link>
                    </div>

                    {/* お問い合わせ */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            ご不明な点がございましたら、<br />
                            <a href="mailto:support@nexus-store.jp" className="text-teal-600 hover:text-teal-700">
                                support@nexus-store.jp
                            </a> までお気軽にお問い合わせください。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCompletePage;