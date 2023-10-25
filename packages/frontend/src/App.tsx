import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import useCart from './hooks/useCart';

import Home from './components/Home';

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
              {!!Object.keys(cart).length && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-6 dark:border-gray-900">
                  {Object.keys(cart).length}
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
              <ProductList
                cart={cart}
                onAddToCart={addToCart}
                onRemove={removeFromCart}
              />
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
