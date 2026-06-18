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
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const headers = { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true', ...options.headers };
  
  const config = { method, headers };
  
  // body ကို method ပေါ်မူတည်ပြီး ထည့်ပါ (GET/HEAD ဆိုရင် မထည့်ပါနဲ့)
  if (options.body && method !== 'GET' && method !== 'HEAD') {
    config.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(url, config);
  return handleResponse(response);
};

// ==================== Product APIs ====================
export const getProducts = async () => {
  return request('/products'); // returns nested array: variants, images
};

export const getProduct = async (id) => {
  return request(`/products/${id}`);
};

// ==================== Product APIs ====================
export const createProduct = async (productData) => {
  // productData already in the required nested format
  return request('/products', { method: 'POST', body: productData });
};

export const updateProduct = async (id, productData) => {
  // productData contains variantId, size, color, stock, status, etc.
  const body = {
    name: productData.name,
    description: productData.description,
    category: productData.category,
    brand: productData.brand,
    gender: productData.gender,
    price: productData.price,
    variants: [
      {
        // Include the variant ID if editing (so the backend knows which variant to update)
        ...(productData.variantId && { id: productData.variantId }),
        size: productData.size,
        color: productData.color,
        stock: productData.stock,
        status: productData.status,
      },
    ],
    images: productData.images, // already in the correct format
  };
  return request(`/products/${id}`, { method: 'PATCH', body });
};

export const deleteProduct = async (id) => {
  return request(`/products/${id}`, { method: 'DELETE' });
};

// ==================== User APIs ====================
export const getPendingUsers = async () => {
  const data = await request('/admin/users/pending');
  // status က "PENDING", "APPROVED", "REJECTED" ပြန်ပေးမယ်
  return data; // raw data ကို frontend မှာ ပြန်ပြောင်းမယ်
};

export const updateUserAction = async (userId, action) => {
  return request(`/admin/users/${userId}/action`, {
    method: 'PATCH',
    body: { action },
  });
};


//==================== Order APIs ====================

export const getOrders = async () => {
  const data = await request('/orders/admin');

  // Extract orders array (support both direct array and { orders: [...] } format)
  let ordersArray = Array.isArray(data) ? data : data?.orders || [];

  if (!Array.isArray(ordersArray)) return [];

  // Normalize each order
  return ordersArray.map(order => ({
    ...order,
    status: order.status?.toUpperCase(),       // "PENDING" (already uppercase)
    total_amount: Number(order.total_amount),
    user: order.user || {},
    order_lines: (order.order_lines || []).map(line => ({
      ...line,
      price: Number(line.price),
      variant: {
        ...line.variant,
        color: line.variant?.color || 'N/A',
        product: {
          ...line.variant?.product,
          name: line.variant?.product?.name || 'Unknown Product',
        },
      },
    })),
  }));
};

export const updateOrderStatus = async (orderId, newStatus, apologyNote = '') => {
  return request(`/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    body: { status: newStatus, apologyNote },
  });
};

export const deleteOrder = async (orderId) => {
  return request(`/orders/admin/${orderId}`, {
    method: 'DELETE',
  });
};

// ==================== Notification API ====================
export const createNotification = async (userId, orderId, title, message) => {
  return request('/notifications/user/{userId}', {
    method: 'POST',
    body: { userId, orderId, title, message },
  });
};