"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/api";

export default function OffersPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Simulate offers - products with discounts
  const offers = allProducts.map((product) => ({
    ...product,
    originalPrice: product.price * 1.3, // 30% discount
    discount: 30,
  }));

  const toggleFavorite = (productId: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id: number) => id !== productId)
      : [...favorites, productId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: Product) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Special Offers
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Up to 30% Off!</h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90">
            Don&apos;t miss out on these amazing deals. Limited time only!
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading offers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {offers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="overflow-hidden border-2 hover:border-red-500 transition-all duration-300 hover:shadow-2xl group h-full flex flex-col relative">
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                  -{product.discount}%
                </div>

                <div
                  className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </motion.button>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                        AED {Number(product.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 line-through">
                        AED {product.originalPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-xs text-red-500 font-semibold">
                      Save AED {(product.originalPrice - product.price).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold h-11 shadow-lg mt-4"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

