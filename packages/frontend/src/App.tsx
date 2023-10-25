import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import useCart from './hooks/useCart';
import { Product } from './types';

import Home from './components/Home';

const products: Product[] = [
  {
    id: '1',
    description: 'Product 1',
    discount: 10,
    price: 100,
    quantityUnit: 'kg',
    vatRate: 20,
    stock: 10000,
  },
  {
    id: '2',
    description: 'Product 2',
    discount: 15,
    price: 150,
    quantityUnit: 'piece',
    vatRate: 20,
    stock: 50,
  },
  {
    id: '3',
    description: 'Product 3',
    price: 200,
    quantityUnit: 'piece',
    vatRate: 20,
    stock: 50,
  },
  // ... add more products as needed
];

function App() {
  const { cart, addToCart, removeFromCart, adjustQuantity } = useCart();

  return (
    <Router>
      <div className="container mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold">Super Shop</h1>
        </header>

        {/* Navigation */}
        <nav className="mb-4">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:underline">
                Products
              </Link>
            </li>
            <li className="relative">
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
              {!!cart.length && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-6 dark:border-gray-900">
                  {cart.length}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <ProductList products={products} onAddToCart={addToCart} />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onRemove={removeFromCart}
                onAdjustQuantity={adjustQuantity}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
