"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

const Top = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);

    // getImageUrl 関数
    const getImageUrl = (imagePath: any) => {
        if (!imagePath) {
            return "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=300&fit=crop";
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // 管理者側のAPIから画像を取得
        return `http://localhost:8000/api/images/${imagePath}`;
    };

    // セクションのアニメーション設定
    useEffect(() => {
        const observerOptions = {
            threshold: 0.4,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.section-animate');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    // 新着商品を取得
    useEffect(() => {
        let isMounted = true;

        const fetchNewArrivals = async () => {
            if (!isMounted) return;

            try {
                console.log('API呼び出し開始');
                const response = await fetch('http://localhost:8001/api/products/new-arrivals');
                
                if (!isMounted) return;
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const data = await response.json();
                console.log('APIレスポンス:', data);
                console.log('取得した商品数:', data.products?.length);
            
                if (data.success && isMounted) {
                    console.log('商品データを設定中:', data.products);
                    setNewArrivals(data.products);
                }
            } catch (error) {
                console.error('API通信エラー:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchNewArrivals();

        return () => {
            isMounted = false;
        };
    }, []);

    const drinks = [
        { image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop", name: "カフェラテ", price: "700円（＋税）" },
        { image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop", name: "ルイボスミントティー", price: "600円（＋税）" },
        { image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop", name: "焼きマシュマロショコラドリンク", price: "800円（＋税）" },
        { image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop", name: "イクス・イクス・ビター", price: "800円（＋税）" },
        { image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop", name: "フレッシュライムティー", price: "600円（＋税）" },
        { image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop", name: "ソルティ・ドッグ・コリンズ", price: "800円（＋税）" }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-600">
            {/* 共通ヘッダー */}
            <Header />

            {/* Hero Section */}
            <section className="h-screen flex items-center justify-start relative overflow-hidden">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-black"></div>
                </video>
                
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-gray-900/60 to-black/40 z-10"></div>
                
                <div className="relative z-20 text-left text-white max-w-4xl ml-8 md:ml-16 px-4">
                    <div className="font-serif text-lg md:text-2xl leading-loose md:leading-loose mb-8 writing-mode-vertical md:writing-mode-horizontal">
                        <div className="animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                            ネクサス ストアは<br />
                        </div>
                        <div className="animate-slide-in-left" style={{animationDelay: '0.5s'}}>
                            最先端のプロダクトと出会える<br />
                        </div>
                        <div className="animate-slide-in-left" style={{animationDelay: '0.8s'}}>
                            デジタル コマース プラットフォームです。<br />
                        </div>
                        <div className="animate-slide-in-left" style={{animationDelay: '1.1s'}}>
                            革新的なショッピング体験を<br />
                        </div>
                        <div className="animate-slide-in-left" style={{animationDelay: '1.4s'}}>
                            お楽しみください。
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section id="new-arrivals" className="py-20 bg-white section-animate opacity-0 translate-y-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="text-6xl font-cursive text-teal-600 mb-2">New Arrivals</div>
                        <div className="w-10 h-0.5 bg-gray-300 mx-auto mb-2"></div>
                        <div className="text-sm tracking-wider">新着商品</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {loading ? (
                            Array.from({length: 4}).map((_, index) => (
                                <div key={index} className="border border-gray-200 animate-pulse">
                                    <div className="bg-gray-300 h-56 w-full"></div>
                                    <div className="p-4">
                                        <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
                                        <div className="bg-gray-300 h-3 w-full mb-1"></div>
                                        <div className="bg-gray-300 h-3 w-full mb-1"></div>
                                        <div className="bg-gray-300 h-3 w-1/2 mb-4"></div>
                                        <div className="bg-gray-300 h-4 w-1/4"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            newArrivals.map((item: any, index) => (
                                <Link 
                                    href={`/products/${item.id}`}
                                    key={item.id || index} 
                                    className="border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer block"
                                >
                                    <div className="relative overflow-hidden">
                                        <img 
                                            src={getImageUrl(item.image_path)} 
                                            alt={item.name}
                                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                                            onLoad={(e: any) => {
                                                console.log('画像読み込み成功:', e.target.src);
                                            }}
                                            onError={(e: any) => {
                                                console.error('画像読み込みエラー:', e.target.src);
                                                if (!e.target.dataset.fallback) {
                                                    e.target.dataset.fallback = 'true';
                                                    e.target.src = "https://via.placeholder.com/300x300/f0f0f0/999999?text=No+Image";
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium mb-2 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.description}</p>
                                        <p className="text-sm font-medium text-teal-600">{item.price}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    <div className="text-right">
                        <Link 
                            href="/products"
                            className="border border-gray-600 px-8 py-3 hover:bg-gray-600 hover:text-white transition-colors inline-block"
                        >
                            新着メニュー一覧
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-gray-50 section-animate opacity-0 translate-y-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="text-6xl font-cursive text-teal-600 mb-2">About</div>
                        <div className="w-10 h-0.5 bg-gray-300 mx-auto mb-2"></div>
                        <div className="text-sm tracking-wider">ネクサス・ストアについて</div>
                    </div>

                    <div className="bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop')] bg-cover bg-center rounded-lg overflow-hidden">
                        <div className="bg-black/60 backdrop-blur-sm p-8 md:p-16">
                            <div className="max-w-md">
                                <p className="font-serif text-lg leading-relaxed mb-8 text-white">
                                    ネクサス ストアは従来のECサイトではありません。<br />
                                    あくまで「革新的な商品との出会い」に重点を置き、<br />
                                    厳選されたプレミアムプロダクトを<br />
                                    デジタル空間で自然に発見できることを目的としています。<br />
                                    また最新のテクノロジーを活用した<br />
                                    パーソナライズされたレコメンド機能など<br />
                                    次世代のショッピング体験をご用意しております。<br />
                                    ネクサス ストアで<br />
                                    新しい発見の旅をお楽しみください。
                                </p>
                                <button className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition-colors flex items-center">
                                    <span className="mr-2">⚡</span>
                                    プレミアム メンバーシップについて
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Drink Section */}
            <section id="drink" className="py-20 bg-white relative section-animate opacity-0 translate-y-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="text-6xl font-cursive text-teal-600 mb-2">Drink</div>
                        <div className="w-10 h-0.5 bg-gray-300 mx-auto mb-2"></div>
                        <div className="text-sm tracking-wider">ドリンクメニュー</div>
                    </div>

                    <div className="relative bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop')] bg-cover bg-center rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-teal-900/50"></div>
                        <div className="relative z-10 p-8 md:p-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {drinks.map((drink, index) => (
                                    <div key={index} className="flex items-center space-x-4 text-white animate-fade-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                                        <img 
                                            src={drink.image} 
                                            alt={drink.name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                                        />
                                        <div>
                                            <h3 className="font-medium mb-1">{drink.name}</h3>
                                            <p className="text-sm opacity-90">{drink.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-16 section-animate opacity-0 translate-y-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Shop Info</h3>
                            <div className="space-y-2 text-gray-300">
                                <p>182-0011大阪府大阪市....</p>
                                <p>月火水定休 10:00 - 17:00</p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-medium mb-4">Phone & Mail</h3>
                            <div className="space-y-2 text-gray-300">
                                <a href="tel:0420000000" className="block hover:text-white transition-colors">042-000-0000</a>
                                <a href="mailto:shop@nexus_store.jp" className="block hover:text-white transition-colors">shop@nexus_store.jp</a>
                            </div>
                        </div>

                        <nav>
                            <div className="flex flex-col space-y-4">
                                <a href="#about" className="hover:text-teal-400 transition-colors">About</a>
                                <a href="#drink" className="hover:text-teal-400 transition-colors">Drink</a>
                                <a href="#contact" className="hover:text-teal-400 transition-colors">Contact</a>
                            </div>
                        </nav>
                    </div>

                    <div className="text-center border-t border-gray-700 pt-8">
                        <div className="mb-6">
                            <div className="text-2xl font-cursive text-teal-400 mb-1">NEXUS STORE</div>
                            <div className="text-sm font-serif">ネクサス・ストア</div>
                        </div>

                        <div className="flex justify-center space-x-4 mb-6">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                                <span className="text-white text-sm">f</span>
                            </div>
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                                <span className="text-white text-sm">t</span>
                            </div>
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                                <span className="text-white text-sm">i</span>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm">© 2025 NEXUS STORE. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .font-cursive {
                    font-family: 'Dancing Script', cursive;
                }
                .writing-mode-vertical {
                    writing-mode: vertical-rl;
                }
                @media (min-width: 768px) {
                    .writing-mode-horizontal {
                        writing-mode: horizontal-tb;
                    }
                }
                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out forwards;
                    opacity: 0;
                }
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                    opacity: 0;
                }
                .animate-fade-up {
                    animation: fade-up 2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Top;