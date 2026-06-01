import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus } from 'react-icons/fi';

const categories = ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Activewear', 'Shoes', 'Accessories'];
const genders = ['MALE', 'FEMALE', 'UNISEX', 'Kids'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'];

function UploadForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', brand: '', gender: '', size: '', color: '',
    price: '', discountPrice: '', stock: '', images: [], status: 'In Stock', featured: false,
    createdAt: '', updatedAt: ''
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        gender: initialData.gender || '',
        size: initialData.size || '',
        color: initialData.color || '',
        price: initialData.price || '',
        discountPrice: initialData.discountPrice || '',
        stock: initialData.stock || '',
        images: initialData.images || [],
        status: initialData.status || 'In Stock',
        featured: initialData.featured || false,
        createdAt: initialData.created_at ? initialData.created_at.slice(0, 16) : '',
        updatedAt: initialData.updated_at ? initialData.updated_at.slice(0, 16) : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Fix: ensure we use the latest imageUrlInput and trim, prevent duplicates
  const addImageUrl = () => {
    console.log('Add clicked, URL:', imageUrlInput);
    if (imageUrlInput.trim() && !formData.images.includes(imageUrlInput.trim())) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
      setImageUrlInput('');
      console.log('Added, new images:', [...formData.images, imageUrlInput.trim()]);
    } else {
      console.log('Invalid or duplicate URL');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const err = {};
    if (!formData.name) err.name = 'Required';
    if (!formData.price) err.price = 'Required';
    if (!formData.stock) err.stock = 'Required';
    if (!formData.category) err.category = 'Required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null
      });
    }
  };

  // Allow pressing Enter key to add URL
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImageUrl();
    }
  };

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} className="input-field" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option value="">Select</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                  <option value="">Select</option>
                  {genders.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <select name="size" value={formData.size} onChange={handleChange} className="input-field">
                  <option value="">Select</option>
                  {sizes.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <select name="color" value={formData.color} onChange={handleChange} className="input-field">
                <option value="">Select</option>
                {colors.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Price</label>
                <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Created At</label>
              <input type="datetime-local" name="createdAt" value={formData.createdAt} onChange={handleChange} className="input-field" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 ">Updated At</label>
              <input type="datetime-local" name="updatedAt" value={formData.updatedAt} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
              <label className="text-sm font-medium">Featured Product</label>
            </div>

            {/* Image URL input with working Add button */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Image URLs</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => {
                    console.log('Input value:', e.target.value);
                    setImageUrlInput(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = imageUrlInput.trim();
                    console.log('Add clicked, URL:', url);
                    if (url === '') {
                      alert('Please enter a URL first');
                      return;
                    }
                    if (formData.images.includes(url)) {
                      alert('This URL already exists');
                      return;
                    }
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, url]
                    }));
                    setImageUrlInput('');
                  }}
                  className="btn-secondary flex items-center gap-1"
                >
                  <FiPlus size={16} /> Add
                </button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Enter image URL and click Add. Supports JPG, PNG, GIF, etc.
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Invalid'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx)
                        }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.images.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 text-sm">
                  No images added. Please add at least one image URL.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>Cancel</button>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
            <FiSave /> {initialData ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadForm;
