export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  quantity?: number;
}

// Featured Products Array
export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    image: "/1zC9sqrG/2148205486.jpg",
    images: [
      "/1zC9sqrG/2148205486.jpg",
      "/1zC9sqrG/2148205486.jpg",
      "/1zC9sqrG/2148205486.jpg",
    ],
    description: "Experience premium sound quality with our top-of-the-line headphones. Featuring active noise cancellation, 30-hour battery life, and superior comfort for extended listening sessions.",
    category: "Audio",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299.99,
    image: "/Wz6pRfW3/2149436737.jpg",
    images: [
      "/Wz6pRfW3/2149436737.jpg",
      "/Wz6pRfW3/2149436737.jpg",
      "/Wz6pRfW3/2149436737.jpg",
    ],
    description: "Stay connected and track your fitness with the Smartwatch Pro. Features include heart rate monitoring, GPS tracking, water resistance, and a vibrant AMOLED display.",
    category: "Wearables",
    rating: 4.9,
    reviews: 89,
    inStock: true,
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149.99,
    image: "/YqRn0fTm/13446.jpg",
    images: [
      "/YqRn0fTm/13446.jpg",
      "/YqRn0fTm/13446.jpg",
      "/YqRn0fTm/13446.jpg",
    ],
    description: "Compact and powerful wireless earbuds with crystal-clear audio. Perfect for workouts and daily commutes with 8-hour battery life and quick charge capability.",
    category: "Audio",
    rating: 4.7,
    reviews: 203,
    inStock: true,
  },
];

// Full Product List Array
export const products: Product[] = [
  {
    id: 4,
    name: "IPHONE 16 Pro Max",
    price: 5099.0,
    image: "/FRtqQFJr/6208003-3207184.jpg",
    images: [
      "/FRtqQFJr/6208003-3207184.jpg",
      "/FRtqQFJr/6208003-3207184.jpg",
      "/FRtqQFJr/6208003-3207184.jpg",
    ],
    description: "The latest iPhone with cutting-edge technology. Features include a powerful A18 chip, advanced camera system, and all-day battery life. Available in multiple storage options.",
    category: "Mobile",
    rating: 4.9,
    reviews: 456,
    inStock: true,
  },
  {
    id: 5,
    name: "Portable Charger",
    price: 49.99,
    image: "/13r2Z1rw/32540410-m011t0410-b-wifi-extender-10aug22.jpg",
    images: [
      "/13r2Z1rw/32540410-m011t0410-b-wifi-extender-10aug22.jpg",
      "/13r2Z1rw/32540410-m011t0410-b-wifi-extender-10aug22.jpg",
    ],
    description: "Never run out of power with our high-capacity portable charger. Fast charging technology and compact design make it perfect for travel.",
    category: "Accessories",
    rating: 4.6,
    reviews: 312,
    inStock: true,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79.99,
    image: "/wvsxTBv7/32555155-m028t0128-a-speaker-12aug22.jpg",
    images: [
      "/wvsxTBv7/32555155-m028t0128-a-speaker-12aug22.jpg",
      "/wvsxTBv7/32555155-m028t0128-a-speaker-12aug22.jpg",
    ],
    description: "Powerful portable speaker with 360-degree sound. Waterproof design and 20-hour battery life make it perfect for outdoor adventures.",
    category: "Audio",
    rating: 4.5,
    reviews: 178,
    inStock: true,
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 89.99,
    image: "/9FDbX5Ps/7744142-3732605.jpg",
    images: [
      "/9FDbX5Ps/7744142-3732605.jpg",
      "/9FDbX5Ps/7744142-3732605.jpg",
    ],
    description: "Track your health and fitness goals with this advanced fitness tracker. Monitors steps, heart rate, sleep, and more with a sleek, comfortable design.",
    category: "Wearables",
    rating: 4.7,
    reviews: 267,
    inStock: true,
  },
  {
    id: 8,
    name: "Wireless Mouse",
    price: 29.99,
    image: "/KcHCxy3g/2147916467.jpg",
    images: [
      "/KcHCxy3g/2147916467.jpg",
      "/KcHCxy3g/2147916467.jpg",
    ],
    description: "Ergonomic wireless mouse with precision tracking. Long battery life and comfortable design for extended use.",
    category: "Accessories",
    rating: 4.4,
    reviews: 145,
    inStock: true,
  },
  {
    id: 9,
    name: "USB-C Hub",
    price: 59.99,
    image: "/7Yp6Ccd5/6123978-22838.jpg",
    images: [
      "/7Yp6Ccd5/6123978-22838.jpg",
      "/7Yp6Ccd5/6123978-22838.jpg",
    ],
    description: "Expand your connectivity with this versatile USB-C hub. Features multiple ports including HDMI, USB 3.0, and SD card reader.",
    category: "Accessories",
    rating: 4.6,
    reviews: 198,
    inStock: true,
  },
];

// Get all products (featured + regular)
export const allProducts: Product[] = [...featuredProducts, ...products];

// Get product by ID
export function getProductById(id: number): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

// Get related products (same category, excluding current product)
export function getRelatedProducts(productId: number, limit: number = 4): Product[] {
  const product = getProductById(productId);
  if (!product) return [];

  return allProducts
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

