import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import ProductTable from '../components/ProductTable';

function ProductsPage({ showAlert }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const sortedData = data.sort((a, b) => {
        if (sortBy === 'created') {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB - dateA;
        } else if (sortBy === 'updated') {
          const dateA = new Date(a.updated_at || a.updatedAt || 0);
          const dateB = new Date(b.updated_at || b.updatedAt || 0);
          return dateB - dateA;
        } else {
          return (a.name || '').localeCompare(b.name || '');
        }
      });
      setProducts([...sortedData]);
    } catch (err) {
      showAlert(err.message || t('failed_to_load_products'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete_product'))) {
      try {
        await deleteProduct(id);
        showAlert(t('product_deleted_success'), 'success');
        loadProducts();
      } catch (err) {
        showAlert(err.message || t('failed_to_delete_product'), 'error');
      }
    }
  };

  const handleEdit = (product) => {
    navigate(`/upload/${product.id || product._id}`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 relative">
      {/* Header with sort dropdown and add button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('products_management')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t('manage_inventory')}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          >
            <option value="name">{t('sort_by_name')}</option>
            <option value="created">{t('sort_by_newest')}</option>
            <option value="updated">{t('sort_by_updated')}</option>
          </select>
          <button onClick={() => navigate('/upload')} className="btn-primary">
            {t('add_new_product')}
          </button>
        </div>
      </div>

      {/* Product Table */}
      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        selectedProduct={selectedProduct}
        onCloseModal={closeModal}
      />
    </div>
  );
}

export default ProductsPage;