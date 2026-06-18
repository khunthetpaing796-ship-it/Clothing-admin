import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function SettingsPage() {
  const { showAlert, storeSettings, setStoreSettings } = useOutletContext();
  const { updateUser } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    storeName: '',
    adminName: '',
    adminEmail: '',
    currency: 'USD',
    lowStockAlert: 10,
    address: '',
    phone: '',
  });

  // Sync local form with global settings
  useEffect(() => {
    if (storeSettings) {
      setFormData({
        storeName: storeSettings.storeName || '',
        adminName: storeSettings.adminName || '',
        adminEmail: storeSettings.adminEmail || '',
        currency: storeSettings.currency || 'USD',
        lowStockAlert: storeSettings.lowStockAlert || 10,
        address: storeSettings.address || '',
        phone: storeSettings.phone || '',
      });
    }
  }, [storeSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lowStockAlert' ? (parseInt(value) || 0) : value,
    }));
  };

  const handleCancel = () => {
    if (storeSettings) {
      setFormData({
        storeName: storeSettings.storeName || '',
        adminName: storeSettings.adminName || '',
        adminEmail: storeSettings.adminEmail || '',
        currency: storeSettings.currency || 'USD',
        lowStockAlert: storeSettings.lowStockAlert || 10,
        address: storeSettings.address || '',
        phone: storeSettings.phone || '',
      });
    }
    showAlert?.(t('changes_discarded'), 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setStoreSettings(formData);

    updateUser({
      name: formData.adminName,
      email: formData.adminEmail,
    });

    showAlert?.(t('settings_saved'), 'success');
  };

  return (
    <div className="w-full bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900 rounded-2xl hover:shadow-2xl hover:dark:shadow-gray-500 p-6 transition-colors">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('settings_title')}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-400">
          {t('settings_subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
              {t('store_name')}
            </label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('enter_store_name')}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
              {t('store_phone')}
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('enter_store_phone')}
            />
          </div>
        </div>

        {/* Admin Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
              {t('admin_name')}
            </label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('enter_admin_name')}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
              {t('admin_email')}
            </label>
            <input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('enter_admin_email')}
            />
          </div>
        </div>

        {/* Currency & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
              {t('currency')}
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="MMK">MMK</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
              {t('low_stock_threshold')}
            </label>
            <input
              type="number"
              name="lowStockAlert"
              value={formData.lowStockAlert}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('enter_low_stock')}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-slate-900 dark:text-gray-200 block mb-1.5">
            {t('store_address')}
          </label>
          <textarea
            rows="2"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder={t('enter_store_address')}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-sm rounded-lg transition-all cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <FiSave size={16} />
            <span>{t('save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;