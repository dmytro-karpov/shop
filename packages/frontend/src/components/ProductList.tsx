import React from 'react';
import { useQuery } from 'react-query';
import { Cart, Product } from '../types';
import { API_PATHS } from '../constants';

interface ProductItemProps {
  cart: Cart;
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemove: (productId: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  cart,
  product,
  onAddToCart,
  onRemove,
}) => (
  <div className="md:w-1/3 lg:w-1/4 p-4">
    <div className="border p-4 rounded shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2 flex-grow">
        {product.description}
      </h2>
      {!!product.discount && (
        <div className="mb-2">
          <span className="text-sm text-gray-600">Discount:</span>{' '}
          {product.discount}%
        </div>
      )}
      <div className="mb-2">
        <span className="text-sm text-gray-600">Price:</span> $
        {(product.price / 100).toFixed(2)}
      </div>
      {!cart[product.id] ? (
        <button
          onClick={() => onAddToCart(product)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 self-end"
        >
          Add to Cart
        </button>
      ) : (
        <button
          onClick={() => onRemove(product.id)}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 self-end"
        >
          Remove
        </button>
      )}
    </div>
  </div>
);

interface ProductListProps {
  cart: Cart;
  onAddToCart: (product: Product) => void;
  onRemove: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  cart,
  onAddToCart,
  onRemove,
}) => {
  const { isLoading, error, data } = useQuery<{ items: Product[] }, Error>(
    'products',
    () => fetch(API_PATHS.product).then(res => res.json())
  );

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="flex flex-wrap -m-4">
      {data?.items.map(product => (
        <ProductItem
          key={product.id}
          cart={cart}
          product={product}
          onAddToCart={onAddToCart}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ProductList;
