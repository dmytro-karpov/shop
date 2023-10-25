import { useEffect, useState } from 'react';
import { CartItem, QuantityUnit } from '../types';

interface QuamtityInputProps {
  item: CartItem;
  onAdjustQuantity: (productId: number, quantity: number) => void;
}

const transformQuantity = (quantity: number, quantityUnit: QuantityUnit) => {
  return quantityUnit === 'kg' ? `${quantity / 1000}` : `${quantity}`;
};

const QuamtityInput: React.FC<QuamtityInputProps> = ({
  item,
  onAdjustQuantity,
}) => {
  const [quantity, setQuantity] = useState(
    transformQuantity(item.quantity, item.product.quantityUnit)
  );

  useEffect(() => {
    setQuantity(transformQuantity(item.quantity, item.product.quantityUnit));
  }, [item.product.quantityUnit, item.quantity]);

  return item.product.quantityUnit === 'kg' ? (
    <input
      type="number"
      value={quantity}
      onChange={e => setQuantity(e.target.value)}
      onBlur={e =>
        onAdjustQuantity(item.product.id, parseFloat(e.target.value) * 1000)
      }
      className="border p-1 w-20 text-center"
      min="0"
      step="0.001"
    />
  ) : (
    <input
      type="number"
      value={item.quantity}
      onChange={e =>
        onAdjustQuantity(item.product.id, parseInt(e.target.value))
      }
      className="border p-1 w-20 text-center"
      min="1"
      step="1"
    />
  );
};

export default QuamtityInput;
