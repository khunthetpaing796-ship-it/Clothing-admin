// let mockProducts = [
//   {
//     id: '1',
//     name: 'Classic White T-Shirt',
//     description: 'Premium cotton classic fit t-shirt',
//     category: 'T-Shirts',
//     brand: 'Nike',
//     gender: 'Unisex',
//     size: 'M',
//     color: 'White',
//     price: 29.99,
//     discountPrice: 24.99,
//     stock: 45,
//     images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
//     status: 'In Stock',
//     featured: true,
//   },
//   {
//     id: '2',
//     name: 'Slim Fit Jeans',
//     description: 'Stretch denim slim fit jeans',
//     category: 'Jeans',
//     brand: "Levi's",
//     gender: 'Men',
//     size: '32',
//     color: 'Blue',
//     price: 79.99,
//     discountPrice: 59.99,
//     stock: 12,
//     images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=200&fit=crop'],
//     status: 'In Stock',
//     featured: true,
//   },
//   {
//     id: '3',
//     name: 'Floral Summer Dress',
//     description: 'Lightweight floral print dress',
//     category: 'Dresses',
//     brand: 'Zara',
//     gender: 'Women',
//     size: 'S',
//     color: 'Multicolor',
//     price: 49.99,
//     discountPrice: 39.99,
//     stock: 8,
//     images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop'],
//     status: 'In Stock',
//     featured: false,
//   },
//   {
//     id: '4',
//     name: 'Leather Jacket',
//     description: 'Genuine leather biker jacket',
//     category: 'Jackets',
//     brand: 'H&M',
//     gender: 'Men',
//     size: 'L',
//     color: 'Black',
//     price: 199.99,
//     discountPrice: 149.99,
//     stock: 0,
//     images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop'],
//     status: 'Out of Stock',
//     featured: false,
//   },
//   {
//     id: '5',
//     name: 'Yoga Leggings',
//     description: 'High-waist compression leggings',
//     category: 'Activewear',
//     brand: 'Adidas',
//     gender: 'Women',
//     size: 'M',
//     color: 'Black',
//     price: 39.99,
//     discountPrice: 29.99,
//     stock: 23,
//     createdAt: '2024-05-01',
//     updatedAt: '2024-05-10',
//     images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&h=200&fit=crop'],
//     status: 'In Stock',
//     featured: true,
//   },
// ];


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://anthology-trombone-knelt.ngrok-free.dev/products';

// src/services/api.js

// ==================== Helper ====================
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Vite proxy သုံးမယ် (သို့) တိုက်ရိုက် URL သုံးမယ်
const API_BASE_URL = 'https://anthology-trombone-knelt.ngrok-free.dev';  // ngrok URL တိုက်ရိုက်

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`; // Vite proxy မှတဆင့်
  const headers = { 'Content-Type': 'application/json','ngrok-skip-browser-warning': 'true', ...options.headers };
  const config = { method: options.method || 'GET', headers, ...options };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  return handleResponse(response);
};

// ==================== Transform: Backend → Frontend ====================
const transformToFrontend = (backendProduct) => {
  const firstVariant = backendProduct.variants?.[0] || {};
  const primaryImage = backendProduct.images?.find(img => img.is_primary)?.image_url
                     || backendProduct.images?.[0]?.image_url
                     || '';
  const statusMap = { IN_STOCK: 'In Stock', OUT_OF_STOCK: 'Out of Stock' };
  const frontendStatus = statusMap[firstVariant.status] || 'Out of Stock';

  return {
    id: String(backendProduct.id),
    name: backendProduct.name,
    description: backendProduct.description || '',
    category: backendProduct.category,
    brand: backendProduct.brand || '',
    gender: backendProduct.gender || '',
    price: backendProduct.price,
    discountPrice: null,               // backend doesn't have discountPrice
    size: firstVariant.size || '',
    color: firstVariant.color || '',
    stock: firstVariant.stock || 0,
    status: frontendStatus,
    images: [primaryImage].filter(Boolean),
    featured: false,
    created_at: backendProduct.created_at,
    updated_at: backendProduct.updated_at,
  };
};

// ==================== Transform: Frontend → Backend ====================
const transformToBackend = (frontendProduct) => {
  const statusMap = { 'In Stock': 'IN_STOCK', 'Out of Stock': 'OUT_OF_STOCK' };
  const backendStatus = statusMap[frontendProduct.status] || 'OUT_OF_STOCK';

  const variants = [{
    size: frontendProduct.size || '',
    color: frontendProduct.color || '',
    stock: frontendProduct.stock || 0,
    status: backendStatus,
  }];

  const images = (frontendProduct.images || []).map((url, idx) => ({
    image_url: url,
    is_primary: idx === 0,
  }));

  return {
    name: frontendProduct.name,
    description: frontendProduct.description || '',
    category: frontendProduct.category,
    brand: frontendProduct.brand || '',
    gender: frontendProduct.gender || '',
    price: frontendProduct.price,
    variants,
    images,
    // discountPrice နဲ့ featured ကို မပို့ပါ
  };
};

// ==================== Product APIs ====================
export const getProducts = async () => {
  const data = await request('/products');
  return data.map(transformToFrontend);
};

export const getProduct = async (id) => {
  const data = await request(`/products/${id}`);
  return transformToFrontend(data);
};

export const createProduct = async (productData) => {
  const backendData = transformToBackend(productData);
  const created = await request('/products', { method: 'POST', body: backendData });
  return transformToFrontend(created);
};

export const updateProduct = async (id, productData) => {
  const backendData = transformToBackend(productData);
  const updated = await request(`/products/${id}`, { method: 'GET', body: backendData });
  return transformToFrontend(updated);
};

export const deleteProduct = async (id) => {
  return request(`/products/${id}`, { method: 'DELETE' });
};

// Add these functions to your existing api.js

// Add to your existing api.js
// ==================== User APIs (matching backend) ====================

// GET /admin/users/pending – fetch all pending registration requests
export const getPendingUsers = async () => {
  return request('/admin/users/pending');
};

// GET /admin/users/pending/:id – fetch details of a single pending user (optional, but you may use it)
export const getPendingUserById = async (id) => {
  return request(`/admin/users/pending/${id}`);
};

// PATCH /admin/users/:id/action – accept or reject a user (action: 'ACCEPT' or 'REJECT')
export const updateUserAction = async (userId, action) => {
  return request(`/admin/users/${userId}/action`, {
    method: 'PATCH',
    body: { action },
  });
};

// GET /admin/users?status=APPROVED (or PENDING, REJECTED)
// export const getUsersByStatus = async (status) => {
//   return request(`/admin/users?status=${status.toUpperCase()}`);
// };
