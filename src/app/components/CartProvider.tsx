"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// カートアイテムの型定義
export interface CartItem {
    id: number;
    name: string;
    price: string;
    image_path: string;
    size: string;
    quantity: number;
}

// カート状態の型定義
interface CartState {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}

// アクションの型定義
type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
    | { type: 'REMOVE_ITEM'; payload: { id: number; size: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; size: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] };

// カートのコンテキスト型定義
interface CartContextType extends CartState {
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: number, size: string) => void;
    updateQuantity: (id: number, size: string, quantity: number) => void;
    clearCart: () => void;
    getCartItemsCount: () => number;
    getTotalAmount: () => number;
}

// カートリデューサー
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const newItem = { ...action.payload, quantity: action.payload.quantity || 1 };
            const existingItemIndex = state.items.findIndex(
                item => item.id === newItem.id && item.size === newItem.size
            );

            let updatedItems: CartItem[];
            if (existingItemIndex > -1) {
                // 既存アイテムの数量を増加
                updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            } else {
                // 新しいアイテムを追加
                updatedItems = [...state.items, newItem];
            }

            const newState = {
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: calculateTotalAmount(updatedItems)
            };

            // localStorageに保存
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(updatedItems));
            }

            return newState;
        }

        case 'REMOVE_ITEM': {
            const updatedItems = state.items.filter(
                item => !(item.id === action.payload.id && item.size === action.payload.size)
            );

            const newState = {
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: calculateTotalAmount(updatedItems)
            };

            // localStorageを更新
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(updatedItems));
            }

            return newState;
        }

        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                // 数量が0以下の場合は削除
                return cartReducer(state, {
                    type: 'REMOVE_ITEM',
                    payload: { id: action.payload.id, size: action.payload.size }
                });
            }

            const updatedItems = state.items.map(item =>
                item.id === action.payload.id && item.size === action.payload.size
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );

            const newState = {
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: calculateTotalAmount(updatedItems)
            };

            // localStorageを更新
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(updatedItems));
            }

            return newState;
        }

        case 'CLEAR_CART': {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }
            return {
                items: [],
                totalItems: 0,
                totalAmount: 0
            };
        }

        case 'LOAD_CART': {
            return {
                items: action.payload,
                totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: calculateTotalAmount(action.payload)
            };
        }

        default:
            return state;
    }
};

// 合計金額を計算するヘルパー関数
const calculateTotalAmount = (items: CartItem[]): number => {
    return items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^\d]/g, '')) || 0;
        return sum + (price * item.quantity);
    }, 0);
};

// カートコンテキストを作成
const CartContext = createContext<CartContextType | undefined>(undefined);

// カートプロバイダーコンポーネント
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        totalItems: 0,
        totalAmount: 0
    });

    // localStorageからカート情報を読み込み
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const cartItems: CartItem[] = JSON.parse(savedCart);
                    dispatch({ type: 'LOAD_CART', payload: cartItems });
                }
            } catch (error) {
                console.error('カート情報の読み込みエラー:', error);
                localStorage.removeItem('cart');
            }
        }
    }, []);

    // カートアクション関数
    const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (id: number, size: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
    };

    const updateQuantity = (id: number, size: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartItemsCount = (): number => {
        return state.totalItems;
    };

    const getTotalAmount = (): number => {
        return state.totalAmount;
    };

    const value: CartContextType = {
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartItemsCount,
        getTotalAmount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// カートコンテキストを使用するカスタムフック
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};