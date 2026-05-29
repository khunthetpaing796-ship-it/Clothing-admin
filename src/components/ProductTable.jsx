import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

function ProductTable({ products, onEdit, onDelete, loading }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const categories = ['Category', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || category === 'Category' || p.category === category)
  );

  const genders = ['Gender', ...new Set(products.map(p => p.gender))];
  const filteredByGender = filtered.filter(p =>
    (gender === '' || gender === 'Gender' || p.gender === gender)
  );


  const totalPages = Math.ceil(filteredByGender.length / itemsPerPage);
  const paginated = filteredByGender.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return 
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600">
      </div>
    </div>;
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full border rounded-lg dark:bg-gray-800 dark:border-gray-600" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={gender} onChange={e => setGender(e.target.value)} className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600">
          {genders.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[35%]">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginated.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.category}</td>
                <td className="px-6 py-4">${product.discountPrice || product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FiEdit2 size={18} /></button>
                    <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded-lg disabled:opacity-50">Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}

export default ProductTable;