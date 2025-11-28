const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zahraz-server.vercel.app/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

async function parseJsonResponse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error(`Server returned ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return data;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  orderIndex?: number;
  isActive?: boolean;
}

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
}>, token: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return parseJsonResponse<ApiResponse>(response);
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
}>, token: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return parseJsonResponse<ApiResponse>(response);
}

export async function deleteProduct(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return parseJsonResponse<ApiResponse>(response);
}

export async function fetchBanners(): Promise<Banner[]> {
  const response = await fetch(`${API_BASE_URL}/banners`);
  const data = await response.json();
  return data.success ? data.data : [];
}

export async function createBanner(bannerData: Partial<Banner>, token: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/banners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bannerData),
  });
  return parseJsonResponse<ApiResponse>(response);
}

export async function updateBanner(id: number, bannerData: Partial<Banner>, token: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bannerData),
  });
  return parseJsonResponse<ApiResponse>(response);
}

export async function deleteBanner(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return parseJsonResponse<ApiResponse>(response);
}

