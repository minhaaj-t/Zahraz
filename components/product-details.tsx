"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Product, allProducts } from "@/lib/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDetailsProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetails({ product, relatedProducts = [] }: ProductDetailsProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Load favorite status from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(product.id));
  }, [product.id]);

  const images = product.images || [product.image];
  const rating = product.rating || 4.5;
  const reviews = product.reviews || 0;

  const handleAddToCart = () => {
    // In a real app, this would use a cart context or state management
    // For now, we'll store in localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: Product) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              ZAHRA&apos;Z
            </h1>
            <div className="w-16 sm:w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-12 md:mb-16">
          {/* Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 border-2 border-gray-200"
            >
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const newFavoriteState = !isFavorite;
                  setIsFavorite(newFavoriteState);
                  const favorites = JSON.parse(
                    localStorage.getItem("favorites") || "[]"
                  );
                  if (newFavoriteState) {
                    localStorage.setItem(
                      "favorites",
                      JSON.stringify([...favorites, product.id])
                    );
                  } else {
                    localStorage.setItem(
                      "favorites",
                      JSON.stringify(
                        favorites.filter((id: number) => id !== product.id)
                      )
                    );
                  }
                }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10"
              >
                <Heart
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </motion.button>
            </motion.div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1 sm:ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base sm:text-lg font-semibold text-gray-700">
                  {rating}
                </span>
                <span className="text-sm sm:text-base text-gray-500">({reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AED {Number(product.price).toFixed(2)}
                </p>
                {product.inStock ? (
                  <p className="text-green-600 font-semibold mt-2 flex items-center gap-2 text-sm sm:text-base">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    In Stock
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold mt-2 text-sm sm:text-base">Out of Stock</p>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose max-w-none">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">Description</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                  >
                    <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <span className="text-xl sm:text-2xl font-bold w-10 sm:w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                  >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold text-base sm:text-lg shadow-lg"
              >
                {addedToCart ? (
                  <>
                    <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Add to Cart
                  </>
                )}
              </Button>

              {/* Share Button */}
              <Button
                variant="outline"
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Share Product
              </Button>
            </div>

            {/* Product Features */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900">Key Features</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  Premium Quality Materials
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  Fast Shipping Available
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  30-Day Money Back Guarantee
                </li>
                <li className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  Secure Payment Options
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Related Products
            </h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {relatedProducts.map((relatedProduct) => (
                  <CarouselItem
                    key={relatedProduct.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="h-full cursor-pointer"
                      onClick={() => router.push(`/product/${relatedProduct.id}`)}
                    >
                      <Card className="overflow-hidden border-2 hover:border-gray-900 transition-all duration-300 hover:shadow-2xl group h-full flex flex-col">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                          <motion.img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">
                              {relatedProduct.name}
                            </h3>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < Math.floor(relatedProduct.rating || 4.5)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                              AED {Number(relatedProduct.price).toFixed(2)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10" />
              <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10" />
            </Carousel>
          </section>
        )}
      </div>
    </div>
  );
}

