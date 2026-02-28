// 商品関連の型定義
export interface Product {
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

// API レスポンスの型定義
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
}

export interface ProductListResponse extends ApiResponse<Product[]> {
    products: Product[];
}

export interface ProductDetailResponse extends ApiResponse<Product> {
    product: Product;
}

// ドリンクメニューの型定義
export interface DrinkItem {
    image: string;
    name: string;
    price: string;
}

// フォームやUI状態の型定義
export interface ProductFilters {
    category?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    sortBy?: 'created_at' | 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
}

// カート関連（将来的に必要になる可能性）
export interface CartItem {
    product: Product;
    quantity: number;
    selectedSize?: string;
}

export interface Cart {
    items: CartItem[];
    total: number;
}