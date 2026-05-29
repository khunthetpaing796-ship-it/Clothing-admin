let mockProducts = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'Premium cotton classic fit t-shirt',
    category: 'T-Shirts',
    brand: 'Nike',
    gender: 'Unisex',
    size: 'M',
    color: 'White',
    price: 29.99,
    discountPrice: 24.99,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
    status: 'In Stock',
    featured: true,
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    description: 'Stretch denim slim fit jeans',
    category: 'Jeans',
    brand: "Levi's",
    gender: 'Men',
    size: '32',
    color: 'Blue',
    price: 79.99,
    discountPrice: 59.99,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=200&fit=crop'],
    status: 'In Stock',
    featured: true,
  },
  {
    id: '3',
    name: 'Floral Summer Dress',
    description: 'Lightweight floral print dress',
    category: 'Dresses',
    brand: 'Zara',
    gender: 'Women',
    size: 'S',
    color: 'Multicolor',
    price: 49.99,
    discountPrice: 39.99,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&h=200&fit=crop'],
    status: 'In Stock',
    featured: false,
  },
  {
    id: '4',
    name: 'Leather Jacket',
    description: 'Genuine leather biker jacket',
    category: 'Jackets',
    brand: 'H&M',
    gender: 'Men',
    size: 'L',
    color: 'Black',
    price: 199.99,
    discountPrice: 149.99,
    stock: 0,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop'],
    status: 'Out of Stock',
    featured: false,
  },
  {
    id: '5',
    name: 'Yoga Leggings',
    description: 'High-waist compression leggings',
    category: 'Activewear',
    brand: 'Adidas',
    gender: 'Women',
    size: 'M',
    color: 'Black',
    price: 39.99,
    discountPrice: 29.99,
    stock: 23,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&h=200&fit=crop'],
    status: 'In Stock',
    featured: true,
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getProducts: async () => {
    await delay(500);
    return [...mockProducts];
  },
  getProduct: async (id) => {
    await delay(300);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { ...product };
  },
  createProduct: async (data) => {
    await delay(600);
    const newProduct = { id: Date.now().toString(), ...data };
    mockProducts.unshift(newProduct);
    return { ...newProduct };
  },
  updateProduct: async (id, data) => {
    await delay(600);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated = { ...mockProducts[index], ...data, id };
    mockProducts[index] = updated;
    return { ...updated };
  },
  deleteProduct: async (id) => {
    await delay(400);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts.splice(index, 1);
    return { success: true };
  },
};