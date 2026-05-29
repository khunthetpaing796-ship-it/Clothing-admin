import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from '../components/ProductTable';
import { api } from '../services/api';

function ProductsPage({ showAlert }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = () => {
    api.getProducts()
      .then(setProducts)
      .catch(() => showAlert('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      api.deleteProduct(id)
        .then(() => {
          showAlert('Product deleted successfully');
          fetchProducts();
        })
        .catch(() => showAlert('Failed to delete product', 'error'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Products Management</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your clothing inventory</p>
        </div>
        <button onClick={() => navigate('/upload')} className="btn-primary">Add New Product</button>
      </div>
      <ProductTable products={products} onEdit={(p) => navigate(`/upload/${p.id}`)} onDelete={handleDelete} loading={loading} />
    </div>
  );
}

export default ProductsPage;