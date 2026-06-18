import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onViewDetails,
  selectedProduct,
  onCloseModal,
}) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const productList = Array.isArray(products) ? products : [];

  const categories = ['All', ...new Set(productList.map(p => p.category).filter(Boolean))];
  const genders = ['All', ...new Set(productList.map(p => p.gender?.toLowerCase()).filter(Boolean))];

  const filteredBySearch = productList.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredByCategory = filteredBySearch.filter(p =>
    category === '' || category === 'All' || p.category === category
  );
  const filteredByGender = filteredByCategory.filter(p =>
    gender === '' || gender === 'All' || p.gender?.toLowerCase() === gender
  );

  const totalPages = Math.ceil(filteredByGender.length / itemsPerPage);
  const paginated = filteredByGender.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  React.useEffect(() => {
    setPage(1);
  }, [search, category, gender]);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '$ 0.00';
    return `$ ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden dark:bg-gray-800">
      {/* Filter Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={t('search_products')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? t('all_categories') : c}
            </option>
          ))}
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
        >
          {genders.map((g) => (
            <option key={g} value={g}>
              {g === 'All' ? t('all_genders') : g}
            </option>
          ))}
        </select>
      </div>

      {/* Table – NO horizontal scroll, let columns auto‑size */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('product')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('price')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('stock')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {t('no_products')}
                </td>
              </tr>
            ) : (
              paginated.map((product) => {
                const variant = product.variants?.[0] || {};
                const primaryImage =
                  product.images?.find((img) => img.is_primary)?.image_url ||
                  product.images?.[0]?.image_url ||
                  'https://via.placeholder.com/48';
                const status = variant.status === 'IN_STOCK' ? t('in_stock') : t('out_of_stock');
                const statusClass =
                  variant.status === 'IN_STOCK'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {variant.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewDetails(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg"
                          title={t('view_details')}
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg"
                          title={t('edit')}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg"
                          title={t('delete')}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {t('previous')}
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('page_of', { page, totalPages })}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {t('next')}
          </button>
        </div>
      )}

      {/* Details Modal – now uses the same nested data as the table */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 w-8 h-8 flex items-center justify-center transition-colors"
            >
              &times;
            </button>

            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
              <img
                src={
                  selectedProduct.images?.find((img) => img.is_primary)?.image_url ||
                  selectedProduct.images?.[0]?.image_url ||
                  ''
                }
                alt={selectedProduct.name}
                className="w-full aspect-square object-cover rounded-xl shadow-md border dark:border-gray-700"
              />
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedProduct.variants?.[0]?.status === 'IN_STOCK'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {selectedProduct.variants?.[0]?.status === 'IN_STOCK'
                  ? t('in_stock')
                  : t('out_of_stock')}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {selectedProduct.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b py-3 dark:border-gray-700 text-sm">
                <div>
                  <span className="block text-gray-400 dark:text-gray-500 text-xs">
                    {t('base_price')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(selectedProduct.price)}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 dark:text-gray-500 text-xs">
                    {t('discount_price')}
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    {selectedProduct.discountPrice
                      ? formatCurrency(selectedProduct.discountPrice)
                      : t('no_discount')}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 dark:text-gray-500 text-xs">
                    {t('brand')}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {selectedProduct.brand || t('generic')}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 dark:text-gray-500 text-xs">
                    {t('gender')}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 uppercase">
                    {selectedProduct.gender || t('unisex')}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <span className="block text-gray-400 text-xs">{t('size')}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {selectedProduct.variants?.[0]?.size || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs">{t('color')}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {selectedProduct.variants?.[0]?.color || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 text-xs">{t('stock_remaining')}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {selectedProduct.variants?.[0]?.stock || 0} {t('pcs')}
                  </span>
                </div>
              </div>

              {selectedProduct.description && (
                <div>
                  <span className="block text-gray-400 text-xs mb-0.5">{t('description')}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg max-h-24 overflow-y-auto leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              <div className="text-[11px] text-gray-400 dark:text-gray-500 flex justify-between pt-2 border-t dark:border-gray-700">
                <span>
                  {t('created')}:{' '}
                  {formatDate(selectedProduct.created_at || selectedProduct.createdAt)}
                </span>
                <span>
                  {t('updated')}:{' '}
                  {formatDate(selectedProduct.updated_at || selectedProduct.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;