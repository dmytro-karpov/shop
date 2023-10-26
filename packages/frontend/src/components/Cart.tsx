import React from 'react';
import { useMutation } from 'react-query';
import useWebSocket from 'react-use-websocket';
import { Cart, CartItem } from '../types';
import QuamtityInput from './QuantityInput';
import { API_PATHS } from '../constants';

interface CartProps {
  cart: Cart;
  onRemove: (productId: string) => void;
  onAdjustQuantity: (productId: string, quantity: number) => void;
}

const CartPage: React.FC<CartProps> = ({
  cart,
  onRemove,
  onAdjustQuantity,
}) => {
  const { sendMessage } = useWebSocket(API_PATHS.ws);
  const mutation = useMutation(
    (cartItems: { productId: string; quantity: number }[]) => {
      return fetch(API_PATHS.checkout, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
      });
    },
    {
      onSuccess: async data => {
        const { orderId } = await data.json();
        sendMessage(JSON.stringify({ orderId }));
      },
    }
  );

  const handleSubmit = () => {
    const items = Object.values(cart).map(
      (item: CartItem): { productId: string; quantity: number } => ({
        productId: item.product.id,
        quantity:
          item.product.quantityUnit === 'kg'
            ? item.quantity / 1000
            : item.quantity,
      })
    );
    mutation.mutate(items);
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {Object.values(cart).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {Object.values(cart).map(item => (
            <li
              key={item.product.id}
              className="border p-2 mb-2 rounded shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {item.product.description}
                  </h3>
                  <p>Price: ${(item.product.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-center space-x-2">
                  <p>Quantity {item.product.quantityUnit}:</p>
                  <div>
                    <button
                      onClick={() =>
                        onAdjustQuantity(
                          item.product.id,
                          item.quantity -
                            (item.product.quantityUnit === 'kg' ? 1000 : 1)
                        )
                      }
                      className="bg-yellow-500 text-white px-2 py-1 w-8 rounded"
                      disabled={
                        item.quantity <=
                        (item.product.quantityUnit === 'kg' ? 1000 : 1)
                      }
                    >
                      -
                    </button>
                    <QuamtityInput
                      item={item}
                      onAdjustQuantity={onAdjustQuantity}
                    />
                    <button
                      onClick={() =>
                        onAdjustQuantity(
                          item.product.id,
                          item.quantity +
                            (item.product.quantityUnit === 'kg' ? 1000 : 1)
                        )
                      }
                      className="bg-green-500 text-white px-2 py-1 w-8 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="text-center">
        {Object.keys(cart).length > 0 && (
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={mutation.isLoading}
          >
            Submit Cart
          </button>
        )}
        {mutation.isError ? (
          <p>Error submitting cart. Try again later.</p>
        ) : null}
        {mutation.isSuccess ? <p>Cart submitted successfully!</p> : null}
      </div>
    </div>
  );
};

export default CartPage;
