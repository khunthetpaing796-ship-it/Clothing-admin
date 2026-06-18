import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import { getProducts } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function DashboardPage({ showAlert }) {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const products = await getProducts(); // raw nested data
        setRecent(products.slice(0, 5));
      } catch (error) {
        showAlert(error.message || t('failed_to_load_products'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [showAlert, t]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          {t('welcome')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('store_today')}
        </p>
      </div>

      <DashboardCards />

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {t('recent_products')}
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('no_products')}
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((product) => {
              const primaryImage = product.images?.find(img => img.is_primary)?.image_url
                                   || product.images?.[0]?.image_url
                                   || 'https://via.placeholder.com/48';

              const firstVariant = product.variants?.[0] || {};
              const stock = firstVariant.stock ?? 0;

              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition"
                >
                  <img
                    src={primaryImage}
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
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('stock')}: {stock}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;