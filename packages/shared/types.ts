export interface Product {
  id: string;
  description: string;
  discount?: number; // percentage, e.g. 10 means 10%
  price: number; // cents
  quantityUnit: QuantityUnit;
  vatRate: number; // percentage, e.g. 20 means 20% VAT
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartOrderItem {
  productId: string;
  quantity: number;
}

export interface OrderProduct extends Product {
  quantity: number;
}
export interface Invoice {
  products: OrderProduct[];
  subTotal: number;
  vatValue: number;
  total: number;
}

export type QuantityUnit = 'piece' | 'kg';
