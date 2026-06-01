import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import { getProducts } from '../services/api';

function DashboardPage({ showAlert }) {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const products = await getProducts();
        console.log('Products:', products); // debug: check transformed data
        // Take first 5 products for "Recent Products" section
        setRecent(products.slice(0, 5));
      } catch (error) {
        // console.error('Dashboard fetch error:', error);
        showAlert(error.message || 'Failed to load recent products', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [showAlert]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome back, Admin!
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Here's what's happening with your store today.
        </p>
      </div>

      <DashboardCards />

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Products
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No products found.
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition"
              >
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/48'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    ${product.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
