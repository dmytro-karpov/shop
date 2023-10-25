import React from 'react';
import { Product } from '../types';

interface ProductProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductItem: React.FC<ProductProps> = ({ product, onAddToCart }) => (
  <div className="md:w-1/3 lg:w-1/4 p-4">
    <div className="border p-4 rounded shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2 flex-grow">
        {product.description}
      </h2>
      {product.discount && (
        <div className="mb-2">
          <span className="text-sm text-gray-600">Discount:</span>{' '}
          {product.discount}%
        </div>
      )}
      <div className="mb-2">
        <span className="text-sm text-gray-600">Price:</span> $
        {product.price.toFixed(2)}
      </div>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 self-end"
      >
        Add to Cart
      </button>
    </div>
  </div>
);

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => (
  <div className="flex flex-wrap -m-4">
    {products.map(product => (
      <ProductItem
        key={product.id}
        product={product}
        onAddToCart={onAddToCart}
      />
    ))}
  </div>
);

export default ProductList;
