import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import { api } from '../services/api';
// import SalesFlowChart from '../components/SalesFlowChart';
// import MermaidChart from '../components/MermaidChart';

function DashboardPage({ showAlert }) {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then(products => setRecent(products.slice(0, 5)))
      .catch(() => showAlert('Failed to load recent products', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, Admin!</h2>
        <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your store today.</p>
      </div>
      <DashboardCards />
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Products</h3>
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
        ) : (
          <div className="space-y-3">
            {recent.map(product => (
              <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-white">${product.price}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Processing Flow</h3>
        <SalesFlowChart />
      </div>
      <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Sales Funnel</h3>
        <MermaidChart chart={`
          graph TD
            A[Website Visit] --> B{Product View}
            B -->|Add to Cart| C[Cart]
            B -->|Leave| D[Exit]
            C --> E[Checkout]
            E --> F[Purchase]
        `} />
      </div> */}
    </div>
  );
}

export default DashboardPage;