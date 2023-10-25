import { useState } from 'react';
import { CartItem, Product } from '../types';

const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (productToAdd: Product) => {
    const addIncrement = productToAdd.quantityUnit === 'kg' ? 1000 : 1;
    const existingCartItem = cart.find(
      item => item.product.id === productToAdd.id
    );

    if (existingCartItem) {
      const updatedCart = cart.map(item =>
        item.product.id === productToAdd.id
          ? { ...item, quantity: item.quantity + addIncrement }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { product: productToAdd, quantity: addIncrement }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
  };

  const adjustQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  return { cart, addToCart, removeFromCart, adjustQuantity };
};

export default useCart;
