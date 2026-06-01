// src/pages/UploadPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import { getProduct, createProduct, updateProduct } from '../services/api';

function UploadPage({ showAlert }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  useEffect(() => {
    if (id) {
      getProduct(id)
        .then(setInitial)
        .catch(() => showAlert('Product not found', 'error'))
        .finally(() => setFetching(false));
    }
  }, [id, showAlert]);

  const handleSubmit = (data) => {
    setLoading(true);
    const promise = id ? updateProduct(id, data) : createProduct(data);
    promise
      .then(() => {
        showAlert(id ? 'Product updated successfully' : 'Product created successfully');
        navigate('/products');
      })
      .catch((err) => {
        console.error('Save error:', err);
        showAlert(err.message || 'Failed to save product', 'error');
      })
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {id ? 'Edit Product' : 'Upload New Clothes'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {id ? 'Update product information' : 'Add a new product to your clothing store'}
        </p>
      </div>
      <UploadForm initialData={initial} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

export default UploadPage;
