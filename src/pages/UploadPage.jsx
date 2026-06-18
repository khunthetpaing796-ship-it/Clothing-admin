// src/pages/UploadPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import { getProduct, createProduct, updateProduct } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

function UploadPage({ showAlert }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  useEffect(() => {
    if (id) {
      getProduct(id)
        .then(setInitial)
        .catch(() => showAlert(t('product_not_found'), 'error'))
        .finally(() => setFetching(false));
    }
  }, [id, showAlert, t]);

  const handleSubmit = (data) => {
    setLoading(true);
    const promise = id ? updateProduct(id, data) : createProduct(data);
    promise
      .then(() => {
        showAlert(id ? t('product_updated') : t('product_created'), 'success');
        navigate('/products');
      })
      .catch((err) => {
        console.error('Save error:', err);
        showAlert(err.message || t('failed_to_save_product'), 'error');
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
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          {id ? t('edit_product') : t('upload_clothes')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {id ? t('edit_product_description') : t('upload_clothes_description')}
        </p>
      </div>
      <UploadForm initialData={initial} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}

export default UploadPage;