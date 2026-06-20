import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const categories = ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Activewear', 'Shoes', 'Accessories'];
const genders = ['MALE', 'FEMALE', 'UNISEX'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'];

function UploadForm({ initialData, onSubmit, loading }) {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    gender: '',
    size: '',
    color: '',
    price: '',
    stock: '',
    images: [],
    status: 'In Stock',
    discountPrice: '',
    featured: false,
    createdAt: '',
    updatedAt: '',
  });

  const [variantId, setVariantId] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errors, setErrors] = useState({});

  // ==========================================================
  // 1. Populate form – သေချာစွာ variant id ရယူခြင်း
  // ==========================================================
  useEffect(() => {
    if (initialData) {
      // 🔥 variants သည် array ဖြစ်ရမည်
      const variant = Array.isArray(initialData.variants) && initialData.variants.length > 0
        ? initialData.variants[0]
        : {};

      const primaryImage =
        initialData.images?.find((img) => img.is_primary)?.image_url ||
        initialData.images?.[0]?.image_url ||
        '';

      // ✅ variant id ကို သိမ်းပါ (null ဖြစ်နိုင်သည်)
      setVariantId(variant.id || null);
      console.log('🔍 variantId from initialData:', variant.id);

      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        gender: initialData.gender || '',
        size: variant.size || '',
        color: variant.color || '',
        price: initialData.price?.toString() || '',
        stock: variant.stock?.toString() || '',
        images: primaryImage ? [primaryImage] : [],
        status: variant.status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock',
        discountPrice: '',
        featured: false,
        createdAt: initialData.created_at ? initialData.created_at.slice(0, 16) : '',
        updatedAt: initialData.updated_at ? initialData.updated_at.slice(0, 16) : '',
      });
    } else {
      // Create mode – reset variantId
      setVariantId(null);
    }
  }, [initialData]);

  // ==========================================================
  // 2. Handle form changes
  // ==========================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ==========================================================
  // 3. Image URL management
  // ==========================================================
  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) {
      alert(t('enter_url_first') || 'Please enter a URL first');
      return;
    }
    if (formData.images.includes(url)) {
      alert(t('url_exists') || 'This URL already exists');
      return;
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrlInput('');
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ==========================================================
  // 4. Validation
  // ==========================================================
  const validate = () => {
    const err = {};
    if (!formData.name) err.name = t('required');
    if (!formData.price) err.price = t('required');
    if (!formData.stock) err.stock = t('required');
    if (!formData.category) err.category = t('required');
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ==========================================================
  // 5. Submit – Create နှင့် Update ခွဲခြားခြင်း
  // ==========================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // ၁. gender ကို Uppercase ဖြစ်အောင် ပြုလုပ်ခြင်း
    const genderValue = formData.gender ? formData.gender.toUpperCase() : 'UNISEX';

    // ၂. variants array ကို ဆောက်ပါ
    const variants = [
      {
        color: formData.color || '',
        size: formData.size || '',
        stock: parseInt(formData.stock, 10) || 0,
        status: formData.status === 'In Stock' ? 'IN_STOCK' : 'OUT_OF_STOCK',
      },
    ];

    // 🔥 Update လုပ်ချိန်တွင် id ထည့်ပါ
    if (variantId) {
      variants[0].id = String(variantId);
      console.log('✅ Update mode: adding variant id:', variants[0].id);
    } else {
      console.log('✅ Create mode: no variant id');
    }

    // ၃. ပုံများကို ဆောက်ပါ
    const images = formData.images.map((url, idx) => ({
      image_url: url,
      is_primary: idx === 0,
    }));

    // ၄. backendData ကို ဆောက်ပါ
    const backendData = {
      name: formData.name,
      description: formData.description || '',
      category: formData.category,
      brand: formData.brand || '',
      gender: genderValue,
      price: parseFloat(formData.price),
      variants: variants,
      images: images,
    };

    console.log('📦 Sending productData:', JSON.stringify(backendData, null, 2));
    onSubmit(backendData);
  };

  // ==========================================================
  // 6. Render – JSX (ယခင်အတိုင်း)
  // ==========================================================
  return (
    <div className="card p-6 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white">{t('basic_information')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('product_name')} *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder={t('enter_product_name')}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder={t('enter_description')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('category')} *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">{t('select')}</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('brand')}</label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('enter_brand')}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('gender')}</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">{t('select')}</option>
                  {genders.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('size')}</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">{t('select')}</option>
                  {sizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('color')}</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">{t('select')}</option>
                {colors.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white">{t('pricing_inventory')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('price')} *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('enter_price')}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('discount_price')}</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('enter_discount')}
                />
                <p className="text-xs text-gray-400 mt-1">{t('frontend_only')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('stock_quantity')} *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={t('enter_stock')}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('status_label')}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>{t('in_stock')}</option>
                  <option>{t('out_of_stock')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('created_at')}</label>
              <input
                type="datetime-local"
                name="createdAt"
                value={formData.createdAt}
                readOnly
                className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('updated_at')}</label>
              <input
                type="datetime-local"
                name="updatedAt"
                value={formData.updatedAt}
                readOnly
                className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label className="text-sm font-medium">{t('featured_product')}</label>
            </div>

            {/* Image URLs */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('product_images')}</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addImageUrl()}
                  placeholder={t('enter_image_url')}
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="btn-secondary flex items-center gap-1"
                >
                  <FiPlus size={16} /> {t('add')}
                </button>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {t('image_instructions')}
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {formData.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80?text=Invalid';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
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
                  {t('no_images_message')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={loading}
          >
            <FiSave /> {initialData ? t('update') : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadForm;
