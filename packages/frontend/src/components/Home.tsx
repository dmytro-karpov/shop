const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-214px)] min-h-fit bg-gradient-to-br from-blue-400 to-purple-600 text-white">
      <div className="bg-opacity-70 bg-black p-10 rounded-lg shadow-xl">
        <h1 className="text-5xl font-bold mb-4 text-center">
          Welcome to Super Shop!
        </h1>
        <p className="text-xl">
          The best shopping experience awaits. Dive in, explore our products,
          and fill up your cart.
        </p>
        <div className="mt-6 text-center">
          <a
            href="/products"
            className="bg-white text-black px-6 py-3 font-semibold rounded-full hover:bg-opacity-80 transition"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
