"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { Product, ProductListResponse } from '@/types';

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('created_at');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);

    // 商品データを取得
    useEffect(() => {
        fetchProducts();
    }, [searchTerm, selectedCategory, priceRange, sortBy, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                search: searchTerm,
                category: selectedCategory,
                sort: sortBy,
                page: currentPage.toString(),
            });

            if (priceRange.length > 0) {
                params.append('price_range', priceRange.join(','));
            }

            // const response = await fetch(`http://localhost:8001/api/products?${params}`);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ProductListResponse = await response.json();
            
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('商品取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) {
            return "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=300&fit=crop";
        }
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        return `${process.env.NEXT_PUBLIC_API_URL}/images/${imagePath}`;
    };

    const handlePriceFilter = (range: string) => {
        setPriceRange(prev => 
            prev.includes(range) 
                ? prev.filter(r => r !== range)
                : [...prev, range]
        );
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchProducts();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* 共通ヘッダー */}
            <Header />

            {/* Hero Search Section */}
            <section className="relative bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 py-16">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <p className="text-xl text-white/90 mb-8">
                        あなたにぴったりの商品を見つけましょう
                    </p>
                    
                    {/* Search Bar */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    placeholder="商品名で検索..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                            >
                                <option value="">全カテゴリ</option>
                                <option value="sneakers">スニーカー</option>
                                <option value="sports">スポーツ用品</option>
                                <option value="accessories">アクセサリー</option>
                            </select>
                            <button 
                                onClick={handleSearch}
                                className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                検索
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters & Results */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">フィルター</h3>
                            
                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">価格帯</h4>
                                <div className="space-y-2">
                                    {[
                                        { value: '0-1000', label: '〜¥1,000' },
                                        { value: '1000-5000', label: '¥1,000 - ¥5,000' },
                                        { value: '5000-10000', label: '¥5,000 - ¥10,000' },
                                        { value: '10000-', label: '¥10,000〜' }
                                    ].map((range) => (
                                        <label key={range.value} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={priceRange.includes(range.value)}
                                                onChange={() => handlePriceFilter(range.value)}
                                                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-600">{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">クイックフィルター</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'created_at', label: '新着順' },
                                    { value: 'popular', label: '人気順' },
                                    { value: 'price_asc', label: '価格安い順' },
                                    { value: 'price_desc', label: '価格高い順' }
                                ].map((sort) => (
                                    <button 
                                        key={sort.value}
                                        onClick={() => setSortBy(sort.value)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                            sortBy === sort.value 
                                                ? 'bg-teal-100 text-teal-700' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {sort.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-xl font-semibold text-gray-900">商品一覧</h2>
                                <span className="text-sm text-gray-500">{products.length}件の商品</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* View Toggle */}
                                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 ${viewMode === 'grid' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 ${viewMode === 'list' ? 'bg-teal-50 text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({length: 8}).map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                                        <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                                        <div className="p-4">
                                            <div className="bg-gray-300 h-4 w-3/4 mb-2"></div>
                                            <div className="bg-gray-300 h-3 w-full mb-1"></div>
                                            <div className="bg-gray-300 h-3 w-2/3 mb-4"></div>
                                            <div className="bg-gray-300 h-4 w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' 
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                            }>
                                {products.map((product) => (
                                    <Link 
                                        href={`/products/${product.id}`}
                                        key={product.id}
                                        className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer block"
                                    >
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img 
                                                src={getImageUrl(product.image_path)} 
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">新着</span>
                                            </div>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-semibold text-teal-600">
                                                    {product.price}
                                                </span>
                                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                    </svg>
                                                    <span>4.5 (23)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex items-center justify-center mt-12">
                            <nav className="flex items-center space-x-2">
                                <button 
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                                <button 
                                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-teal-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    1
                                </button>
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">2</button>
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">3</button>
                                <span className="px-2 py-2 text-gray-400">...</span>
                                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">10</button>
                                <button 
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="px-3 py-2 text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </main>
                </div>
            </section>

            <style jsx>{`
                .font-cursive {
                    font-family: 'Dancing Script', cursive;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default ProductsPage;