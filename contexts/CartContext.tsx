"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  name: string;
  description: string;
  price: string;
  unit: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItem: CartItem | null;
  setCartItem: (item: CartItem | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  const clearCart = () => setCartItem(null);

  return (
    <CartContext.Provider value={{ cartItem, setCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
