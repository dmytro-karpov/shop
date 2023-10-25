export interface Product {
  id: string;
  description: string;
  discount?: number; // percentage, e.g. 10 means 10%
  price: number;
  quantityUnit: QuantityUnit;
  vatRate: number; // percentage, e.g. 20 means 20% VAT
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type QuantityUnit = 'piece' | 'kg';
