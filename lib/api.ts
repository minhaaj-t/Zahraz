const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zahraz-server.vercel.app/api';

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  const data = await response.json();
  return data.success ? data.data : [];
}

export async function fetchFeaturedProducts() {
  const response = await fetch(`${API_BASE_URL}/products/featured`);
  const data = await response.json();
  return data.success ? data.data : [];
}

export async function fetchProductById(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  const data = await response.json();
  return data.success ? data.data : null;
}

export async function fetchRelatedProducts(id: number) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/related`);
  const data = await response.json();
  return data.success ? data.data : [];
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function createOrder(orderData: {
  customerName: string;
  customerEmail?: string;
  address: string;
  phone?: string;
  items: OrderItem[];
  total: number;
}) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  return data;
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`);
  const data = await response.json();
  return data.success ? data.data : [];
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/stats`);
  const data = await response.json();
  return data.success ? data.data : null;
}

export async function adminLogin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
}

export async function createProduct(productData: Partial<{
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}>, token: string) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  return data;
}

export async function updateProduct(id: number, productData: Partial<{
  name: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}>, token: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  return data;
}

export async function deleteProduct(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

