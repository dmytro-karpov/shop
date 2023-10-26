export interface Product {
  id: string;
  description: string;
  discount?: number; // percentage, e.g. 10 means 10%
  price: number;
  quantityUnit: QuantityUnit;
  vatRate: number; // percentage, e.g. 20 means 20% VAT
}

export type QuantityUnit = 'piece' | 'kg';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Cart = {
  [key: string]: CartItem;
};
