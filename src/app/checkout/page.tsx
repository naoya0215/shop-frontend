"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useCart } from '../components/CartProvider';
import { useToast } from '../components/Toast';

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    address: string;
    building: string;
    notes: string;
}

interface PaymentInfo {
    method: 'credit' | 'bank' | 'cod';
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    cardName: string;
}

const CheckoutPage = () => {
    const router = useRouter();
    const { items, getTotalAmount, clearCart } = useCart();
    const { showToast } = useToast();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        postalCode: '',
        prefecture: '',
        city: '',
        address: '',
        building: '',
        notes: ''
    });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        method: 'credit',
        cardNumber: '',
        expiryDate: '',
        securityCode: '',
        cardName: ''
    });

    const totalAmount = getTotalAmount();
    const shippingFee = totalAmount >= 5000 ? 0 : 500;
    const finalAmount = totalAmount + shippingFee;

    // カートが空の場合はリダイレクト
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">カートが空です</h2>
                    <p className="text-gray-600 mb-8">注文するにはまず商品をカートに追加してください。</p>
                    <button 
                        onClick={() => router.push('/products')}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
                    >
                        商品を見る
                    </button>
                </div>
            </div>
        );
    }

    // 入力値の更新
    const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
    };

    const updatePaymentInfo = (field: keyof PaymentInfo, value: string) => {
        setPaymentInfo(prev => ({ ...prev, [field]: value }));
    };

    // バリデーション
    const validateStep1 = () => {
        const required = ['name', 'email', 'phone', 'postalCode', 'prefecture', 'city', 'address'];
        return required.every(field => customerInfo[field as keyof CustomerInfo].trim() !== '');
    };

    const validateStep2 = () => {
        if (paymentInfo.method === 'credit') {
            return paymentInfo.cardNumber && paymentInfo.expiryDate && 
                   paymentInfo.securityCode && paymentInfo.cardName;
        }
        return true;
    };

    // ステップ進行
    const nextStep = () => {
        if (currentStep === 1 && !validateStep1()) {
            showToast('必須項目を入力してください', 'error');
            return;
        }
        if (currentStep === 2 && !validateStep2()) {
            showToast('決済情報を正しく入力してください', 'error');
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // 注文確定
    const submitOrder = async () => {
        setIsProcessing(true);
        
        try {
            const orderData = {
                customer: customerInfo,
                payment: paymentInfo,
                items: items,
                amounts: {
                    subtotal: totalAmount,
                    shipping: shippingFee,
                    total: finalAmount
                }
            };

            const response = await fetch('http://localhost:8001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                clearCart();
                showToast(data.message, 'success');
                router.push('/order-complete');
            } else {
                const errorMessage = data.errors 
                    ? Object.values(data.errors).flat().join('\n')
                    : data.message || '注文処理中にエラーが発生しました';
                showToast(errorMessage, 'error');
            }
            
        } catch (error) {
            console.error('注文エラー:', error);
            showToast('注文処理中にエラーが発生しました', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    // 価格フォーマット
    const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">ご注文手続き</h1>
                
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
                                これはデモサイトです。実際の決済は行われませんので、お客様情報には適当な値を入力してください。<br />
                                クレジットカード情報も架空のもので構いません。
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* プログレスバー */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep >= step 
                                        ? 'bg-teal-600 text-white' 
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {step}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    currentStep >= step ? 'text-teal-600' : 'text-gray-500'
                                }`}>
                                    {step === 1 && 'お客様情報'}
                                    {step === 2 && '決済方法'}
                                    {step === 3 && '注文確認'}
                                </span>
                                {step < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-2">
                        {/* ステップ1: お客様情報 */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-6">お客様情報・お届け先</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            お名前 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.name}
                                            onChange={(e) => updateCustomerInfo('name', e.target.value)}
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
                                            value={customerInfo.email}
                                            onChange={(e) => updateCustomerInfo('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            電話番号 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerInfo.phone}
                                            onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="090-1234-5678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            郵便番号 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.postalCode}
                                            onChange={(e) => updateCustomerInfo('postalCode', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="123-4567"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            都道府県 <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={customerInfo.prefecture}
                                            onChange={(e) => updateCustomerInfo('prefecture', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        >
                                            <option value="">選択してください</option>
                                            <option value="東京都">東京都</option>
                                            <option value="大阪府">大阪府</option>
                                            <option value="神奈川県">神奈川県</option>
                                            {/* 他の都道府県 */}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            市区町村 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.city}
                                            onChange={(e) => updateCustomerInfo('city', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="渋谷区"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            番地・町名 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.address}
                                            onChange={(e) => updateCustomerInfo('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="神南1-2-3"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            建物名・部屋番号
                                        </label>
                                        <input
                                            type="text"
                                            value={customerInfo.building}
                                            onChange={(e) => updateCustomerInfo('building', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="ネクサスビル 101号室"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            配送に関するご要望
                                        </label>
                                        <textarea
                                            value={customerInfo.notes}
                                            onChange={(e) => updateCustomerInfo('notes', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="時間指定、置き配など"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ステップ2: 決済方法 */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-6">決済方法</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit"
                                            checked={paymentInfo.method === 'credit'}
                                            onChange={(e) => updatePaymentInfo('method', e.target.value as any)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">クレジットカード</div>
                                            <div className="text-sm text-gray-500">Visa, Mastercard, JCB, AMEX</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="bank"
                                            checked={paymentInfo.method === 'bank'}
                                            onChange={(e) => updatePaymentInfo('method', e.target.value as any)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">銀行振込</div>
                                            <div className="text-sm text-gray-500">入金確認後に発送いたします</div>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentInfo.method === 'cod'}
                                            onChange={(e) => updatePaymentInfo('method', e.target.value as any)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">代金引換</div>
                                            <div className="text-sm text-gray-500">商品受け取り時にお支払い（手数料 +330円）</div>
                                        </div>
                                    </label>
                                </div>

                                {/* クレジットカード情報 */}
                                {paymentInfo.method === 'credit' && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium">クレジットカード情報</h3>
                                            <span className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">デモ用：架空の情報でOK</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    カード番号 <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.cardNumber}
                                                    onChange={(e) => updatePaymentInfo('cardNumber', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="1234 5678 9012 3456（デモ用）"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    有効期限 <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.expiryDate}
                                                    onChange={(e) => updatePaymentInfo('expiryDate', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="12/28（デモ用）"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    セキュリティコード <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.securityCode}
                                                    onChange={(e) => updatePaymentInfo('securityCode', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="123（デモ用）"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    カード名義人 <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentInfo.cardName}
                                                    onChange={(e) => updatePaymentInfo('cardName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                                    placeholder="DEMO TARO（デモ用）"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ステップ3: 注文確認 */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                {/* お客様情報確認 */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">お客様情報</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">お名前:</span> {customerInfo.name}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">メール:</span> {customerInfo.email}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">電話:</span> {customerInfo.phone}
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="text-gray-500">お届け先:</span> 
                                            〒{customerInfo.postalCode} {customerInfo.prefecture}{customerInfo.city}{customerInfo.address}
                                            {customerInfo.building && ` ${customerInfo.building}`}
                                        </div>
                                    </div>
                                </div>

                                {/* 決済方法確認 */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">決済方法</h2>
                                    <div className="text-sm">
                                        {paymentInfo.method === 'credit' && 'クレジットカード'}
                                        {paymentInfo.method === 'bank' && '銀行振込'}
                                        {paymentInfo.method === 'cod' && '代金引換'}
                                    </div>
                                </div>

                                {/* 注文内容確認 */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4">注文内容</h2>
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={`${item.id}-${item.size}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                <div className="w-16 h-16 bg-gray-100 rounded">
                                                    <img 
                                                        src={item.image_path} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">サイズ: {item.size}</p>
                                                    <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                                                </div>
                                                <div className="font-medium">
                                                    {formatPrice(parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ナビゲーションボタン */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                戻る
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                >
                                    次へ
                                </button>
                            ) : (
                                <button
                                    onClick={submitOrder}
                                    disabled={isProcessing}
                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? '処理中...' : '注文を確定する'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* サイドバー: 注文サマリー */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                            <h3 className="text-lg font-semibold mb-4">注文サマリー</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span>商品小計 ({items.reduce((sum, item) => sum + item.quantity, 0)}点)</span>
                                    <span>{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>送料</span>
                                    <span>{shippingFee === 0 ? '無料' : formatPrice(shippingFee)}</span>
                                </div>
                                {paymentInfo.method === 'cod' && (
                                    <div className="flex justify-between text-sm">
                                        <span>代引き手数料</span>
                                        <span>¥330</span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>合計</span>
                                        <span>{formatPrice(finalAmount + (paymentInfo.method === 'cod' ? 330 : 0))}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p>・5,000円以上のご注文で送料無料</p>
                                <p>・通常2-3営業日で発送</p>
                                <p>・30日間返品・交換保証</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;