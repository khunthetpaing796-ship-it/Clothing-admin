import React, { useState, useEffect } from 'react';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';

const categories = ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Activewear', 'Shoes', 'Accessories'];
const genders = ['Men', 'Women', 'Unisex', 'Kids'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'];

function UploadForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', brand: '', gender: '', size: '', color: '', price: '', discountPrice: '', stock: '', images: [], status: 'In Stock', featured: false
  });
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviews(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        newImages.push(reader.result);
        if (newPreviews.length === files.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setPreviews(previews.filter((_, i) => i !== idx));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
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
      onSubmit({ ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock), discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null });
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
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input-field" />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
              <label className="text-sm font-medium">Featured Product</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Product Images</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" id="imgUpload" />
                <label htmlFor="imgUpload" className="flex flex-col items-center cursor-pointer">
                  <FiUpload size={32} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload</span>
                </label>
              </div>
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {previews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
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