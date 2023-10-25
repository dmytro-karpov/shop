import { useState } from 'react';
import { Cart, Product } from '../types';

const useCart = () => {
  const [cart, setCart] = useState<Cart>({});

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const currentQuantity = prevCart[product.id]?.quantity || 0;

      return {
        ...prevCart,
        [product.id]: {
          product,
          quantity: currentQuantity + 1,
        },
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const adjustQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      return {
        ...prevCart,
        [productId]: {
          ...prevCart[productId],
          quantity,
        },
      };
    });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    adjustQuantity,
  };
};

export default useCart;
