"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import { useCart } from '../../components/CartProvider';
import { useToast } from '../../components/Toast';

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    image_path: string;
    display_order: number;
    is_selling: boolean;
    created_at: string;
    updated_at?: string;
}

const ProductDetail = () => {
    const params = useParams();
    const id = params.id as string;
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('25.0');
    const [mainImage, setMainImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    
    const { addItem } = useCart();
    const { showToast } = useToast();

    // 商品詳細データを取得
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log('商品詳細取得開始:', id);
                const response = await fetch(`http://localhost:8001/api/products/${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('商品詳細レスポンス:', data);

                if (data.success) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.error('商品詳細取得エラー:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // 画像URL生成
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) {
            return "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=300&fit=crop";
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        return `http://localhost:8000/api/images/${imagePath}`;
    };

    // カートに追加
    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image_path: product.image_path,
            size: selectedSize,
        };

        addItem({ ...cartItem, quantity });
        showToast(`${product.name} (サイズ: ${selectedSize}) をカートに追加しました！`, 'success');
    };

    // 数量変更
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    // ローディング表示
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
                        <p className="mt-4 text-gray-600">商品情報を読み込み中...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 商品が見つからない場合
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">商品が見つかりません</h2>
                        <Link href="/" className="text-teal-600 hover:text-teal-800">
                            ホームに戻る
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // サンプルの複数画像
    const productImages = [
        getImageUrl(product.image_path),
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop"
    ];

    const sizes = ['24.0', '24.5', '25.0', '25.5', '26.0', '26.5', '27.0', '27.5'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBackButton={true} />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-teal-600">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-teal-600">Products</Link>
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </div>
                </nav>

                {/* Product Detail Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
                            <img 
                                src={productImages[mainImage]}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        
                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-4 gap-2">
                            {productImages.map((img, index) => (
                                <div 
                                    key={index}
                                    className={`aspect-square rounded overflow-hidden cursor-pointer ${
                                        mainImage === index 
                                            ? 'border-2 border-teal-500' 
                                            : 'border border-gray-200 opacity-70 hover:opacity-100'
                                    }`}
                                    onClick={() => setMainImage(index)}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`${product.name} ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-xl text-teal-600 font-medium">{product.price}</p>
                        </div>

                        <div className="prose text-gray-600">
                            <p>{product.description}</p>
                        </div>

                        {/* Product Specs */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">商品仕様</h3>
                            <dl className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">商品ID</dt>
                                    <dd className="text-gray-900">#{product.id}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">カテゴリ</dt>
                                    <dd className="text-gray-900">商品</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">在庫状況</dt>
                                    <dd className="text-green-600">在庫あり</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">サイズを選択</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`border rounded py-2 text-sm transition-colors ${
                                            selectedSize === size
                                                ? 'border-2 border-teal-500 bg-teal-50 text-teal-600'
                                                : 'border-gray-300 hover:border-teal-500 hover:text-teal-600'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selection */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">数量</h3>
                            <div className="flex items-center border border-gray-300 rounded-md w-fit">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-6 py-2 border-x border-gray-300 min-w-[4rem] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="px-4 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    disabled={quantity >= 10}
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">※最大10個まで</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all transform hover:scale-105"
                            >
                                カートに追加
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    ♡ お気に入り
                                </button>
                                <button className="border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    📤 シェア
                                </button>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-4 border">
                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex items-center">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>送料無料（¥5,000以上のご注文）</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>最短翌日配送</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-600 mr-2">✓</span>
                                    <span>30日間返品・交換保証</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-cursive text-teal-600 text-center mb-8">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { id: 1, name: "ランニングシューズ", price: "¥8,500（＋税）", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&h=300&fit=crop" },
                            { id: 2, name: "カジュアルスニーカー", price: "¥6,200（＋税）", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop" },
                            { id: 3, name: "ハイカットスニーカー", price: "¥9,800（＋税）", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop" },
                            { id: 4, name: "トレーニングシューズ", price: "¥7,300（＋税）", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop" }
                        ].map((relatedProduct) => (
                            <Link 
                                href={`/products/show/${relatedProduct.id}`}
                                key={relatedProduct.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow block"
                            >
                                <img src={relatedProduct.image} className="w-full h-48 object-cover rounded-t-lg" alt={relatedProduct.name} />
                                <div className="p-4">
                                    <h3 className="font-medium mb-2">{relatedProduct.name}</h3>
                                    <p className="text-teal-600">{relatedProduct.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <style jsx>{`
                .font-cursive {
                    font-family: 'Dancing Script', cursive;
                }
            `}</style>
        </div>
    );
};

export default ProductDetail;