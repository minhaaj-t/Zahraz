"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Send, Search, Star, Plus, Minus, Trash2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { type Product } from "@/lib/products";
import { fetchProducts, fetchFeaturedProducts, createOrder } from "@/lib/api";

// Banner Slider Data
interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: "New Collection 2024",
    subtitle: "Discover the latest trends and premium products",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    title: "Special Offer",
    subtitle: "Up to 50% off on selected items",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    buttonText: "Explore Deals",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Experience luxury with our curated selection",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    buttonText: "View Collection",
  },
];

export function ModernEcommerceWhatsapp() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [flyingAirplane, setFlyingAirplane] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  // Add product to cart with airplane animation
  const addToCart = (product: Product, buttonElement?: HTMLElement | null) => {
    // Get button position if provided
    if (buttonElement) {
      const buttonRect = buttonElement.getBoundingClientRect();
      const startX = buttonRect.left + buttonRect.width / 2;
      const startY = buttonRect.top + buttonRect.height / 2;

      // Get cart icon position
      const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;

        // Trigger airplane animation
        setFlyingAirplane({ startX, startY, endX, endY });

        // Remove animation after it completes
        setTimeout(() => {
          setFlyingAirplane(null);
        }, 2000);
      }
    }

    // Ensure price is a number
    const productWithNumberPrice = {
      ...product,
      price: Number(product.price)
    };
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...productWithNumberPrice, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId: number, delta: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === productId) {
          const newQuantity = (item.quantity || 1) + delta;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is Product => item !== null)
    );
  };

  // Toggle favorite
  const toggleFavorite = (productId: number) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const [allProducts, featured] = await Promise.all([
          fetchProducts(),
          fetchFeaturedProducts(),
        ]);
        // Ensure prices are numbers (MySQL returns DECIMAL as string)
        const normalizePrice = (product: Product) => ({
          ...product,
          price: Number(product.price) || 0
        });
        setProducts(allProducts.map(normalizePrice));
        setFeaturedProducts(featured.map(normalizePrice));
      } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to empty arrays on error
        setProducts([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter products based on search
  const allProductsList = [...featuredProducts, ...products.filter(p => !featuredProducts.find(fp => fp.id === p.id))];
  const filteredProducts = allProductsList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Track carousel slide changes
  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentBannerIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Set initial index

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Auto-play banner slider
  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Send cart details to WhatsApp
  const sendToWhatsApp = async () => {
    const phoneNumber = "971528485234";
    let message = `🛍️ *New Order from ZAHRA'Z*%0A%0A`;
    message += `👤 *Customer Name:* ${name}%0A`;
    message += `📍 *Address:* ${address}%0A%0A`;
    message += `🛒 *Order Details:*%0A`;
    cartItems.forEach((item, index) => {
      const quantity = item.quantity || 1;
      const itemTotal = Number(item.price) * quantity;
      message += `%0A${index + 1}. ${item.name}%0A`;
      message += `   Quantity: ${quantity}%0A`;
      message += `   Price: AED ${Number(item.price).toFixed(2)} x ${quantity} = AED ${itemTotal.toFixed(2)}%0A`;
    });
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * (item.quantity || 1),
      0
    );
    message += `%0A━━━━━━━━━━━━━━━━%0A`;
    message += `💰 *Total Price: AED ${totalPrice.toFixed(2)}*`;

    // Save order to backend API
    try {
      await createOrder({
        customerName: name,
        address: address,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
        })),
        total: totalPrice,
      });
    } catch (error) {
      console.error("Error saving order:", error);
      // Still proceed with WhatsApp even if API fails
    }

    // Clear cart after order
    setCartItems([]);
    setName("");
    setAddress("");

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20 md:pb-0">
      {/* Flying Airplane Animation */}
      <AnimatePresence>
        {flyingAirplane && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: flyingAirplane.startX,
              top: flyingAirplane.startY,
            }}
          >
            <motion.div
              initial={{
                x: 0,
                y: 0,
                rotate: -45,
                scale: 1,
              }}
              animate={{
                x: flyingAirplane.endX - flyingAirplane.startX,
                y: flyingAirplane.endY - flyingAirplane.startY,
                rotate: [
                  -45,
                  -30,
                  -20,
                  -10,
                  0,
                  10,
                  20,
                  30,
                  45,
                ],
                scale: [1, 1.3, 1.1, 0.9, 0.7],
              }}
              transition={{
                duration: 1.5,
                ease: [0.42, 0, 0.58, 1], // Custom cubic bezier for smooth curve
                rotate: {
                  duration: 1.5,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Plane className="h-10 w-10 text-blue-500 drop-shadow-2xl" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
            >
              <img
                src="https://i.postimg.cc/Gt6Xnd2P/Gold-and-Black-Minimalist-Monogram-Personal-Logo-20241107-185515-0000.png"
                alt="ZAHRAZ Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0"
              />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                ZAHRA&apos;Z
              </h1>
            </motion.div>
            <Sheet>
              <SheetTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    data-cart-icon
                    className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 hover:border-gray-900 transition-all"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-lg"
                      >
                        {totalItems > 99 ? "99+" : totalItems}
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[400px] md:w-[540px] overflow-y-auto max-w-full">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">Shopping Cart</SheetTitle>
                  <SheetDescription>
                    Review your items and proceed to checkout
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm mb-1 truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 mb-2">
                            AED {Number(item.price).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                            <span className="text-xs sm:text-sm font-semibold w-6 sm:w-8 text-center">
                              {item.quantity || 1}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 sm:h-7 sm:w-7"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {cartItems.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  )}
                  {cartItems.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 space-y-4">
                      <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-xl sm:text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          AED {totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                    <Input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 sm:h-12 text-sm sm:text-base"
                    />
                    <Textarea
                      placeholder="Your Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                    />
                    <Button
                      className="w-full h-11 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg text-sm sm:text-base"
                      onClick={sendToWhatsApp}
                      disabled={cartItems.length === 0 || !name || !address}
                    >
                      <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Checkout via WhatsApp
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Banner Slider */}
      <section className="relative w-full overflow-hidden">
        <Carousel 
          className="w-full" 
          opts={{ loop: true, align: "start" }}
          setApi={setApi}
        >
          <CarouselContent className="-ml-0">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="pl-0">
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                  </motion.div>
                  <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <motion.div
                      key={`content-${banner.id}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="max-w-2xl text-white w-full"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
                      >
                        {banner.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 text-gray-200"
                      >
                        {banner.subtitle}
                      </motion.p>
                      {banner.buttonText && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9, duration: 0.6 }}
                        >
                          <Button
                            size="lg"
                            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 text-sm sm:text-base md:text-lg shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
                            onClick={() => {
                              document
                                .getElementById("featured-products")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            {banner.buttonText}
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 md:left-8 text-white border-white/50 hover:border-white hover:bg-white/10 bg-black/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10" />
          <CarouselNext className="right-2 sm:right-4 md:right-8 text-white border-white/50 hover:border-white hover:bg-white/10 bg-black/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10" />
        </Carousel>
        {/* Enhanced Dots indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
          {banners.map((banner, index) => (
            <motion.button
              key={banner.id}
              onClick={() => {
                if (api) {
                  api.scrollTo(index);
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                currentBannerIndex === index
                  ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white shadow-lg"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/75"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg rounded-full border-2 focus:border-gray-900 shadow-sm"
          />
        </div>
      </div>

      {/* Featured Products Section */}
      <section id="featured-products" className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Handpicked selections just for you</p>
        </motion.div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProducts.map((product, index) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden border-2 hover:border-gray-900 transition-all duration-300 hover:shadow-2xl group h-full flex flex-col">
                    <div 
                      className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div 
                        className="cursor-pointer"
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                          AED {Number(product.price).toFixed(2)}
                        </p>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, e.currentTarget);
                          }}
                          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold h-12 shadow-lg"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 h-8 w-8 sm:h-10 sm:w-10" />
            <CarouselNext className="right-2 sm:right-4 h-8 w-8 sm:h-10 sm:w-10" />
          </Carousel>
        )}
      </section>

      {/* All Products Section */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-20 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            All Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {searchQuery
              ? `Found ${filteredProducts.length} product(s)`
              : "Browse our complete collection"}
          </p>
        </motion.div>
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? "No products found matching your search" : "No products available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden border-2 hover:border-gray-900 transition-all duration-300 hover:shadow-2xl group h-full flex flex-col">
                    <div 
                      className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div 
                        className="cursor-pointer"
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                        </div>
                        <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                          AED {Number(product.price).toFixed(2)}
                        </p>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, e.currentTarget);
                          }}
                          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold h-11 shadow-lg"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
