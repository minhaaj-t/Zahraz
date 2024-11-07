"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
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

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    image: "https://i.postimg.cc/1zC9sqrG/2148205486.jpg",
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299.99,
    image: "https://i.postimg.cc/Wz6pRfW3/2149436737.jpg",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149.99,
    image: "https://i.postimg.cc/YqRn0fTm/13446.jpg",
  },
];

const products: Product[] = [
  {
    id: 4,
    name: "IPHONE 16 Pro Max",
    price: 5099.0,
    image: "https://i.postimg.cc/FRtqQFJr/6208003-3207184.jpg",
  },
  {
    id: 5,
    name: "Portable Charger",
    price: 49.99,
    image:
      "https://i.postimg.cc/13r2Z1rw/32540410-m011t0410-b-wifi-extender-10aug22.jpg",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79.99,
    image:
      "https://i.postimg.cc/wvsxTBv7/32555155-m028t0128-a-speaker-12aug22.jpg",
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 89.99,
    image: "https://i.postimg.cc/9FDbX5Ps/7744142-3732605.jpg",
  },
  {
    id: 8,
    name: "Wireless Mouse",
    price: 29.99,
    image: "https://i.postimg.cc/KcHCxy3g/2147916467.jpg",
  },
  {
    id: 9,
    name: "USB-C Hub",
    price: 59.99,
    image: "https://i.postimg.cc/7Yp6Ccd5/6123978-22838.jpg",
  },
];

export function ModernEcommerceWhatsapp() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const sendToWhatsApp = () => {
    const phoneNumber = "971528485234";
    let message = `Your Name: ${name}%0A`;
    message += `Address: ${address}%0A%0A`;
    message += `Cart:%0A`;
    cartItems.forEach((item, index) => {
      message += `%0AProduct ${index + 1}%0A`;
      message += `Title: ${item.name}%0A`;
      message += `Price: $${item.price.toFixed(2)}%0A`;
    });
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    message += `%0ATotal Price: $${totalPrice.toFixed(2)}`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 shadow-lg p-4 bg-white sticky top-0 z-10">
        {/* Logo */}
        <img
          src="https://i.postimg.cc/Gt6Xnd2P/Gold-and-Black-Minimalist-Monogram-Personal-Logo-20241107-185515-0000.png"
          alt="ZAHRAZ Logo"
          className="h-12"
        />

        <h1 className="text-3xl font-bold text-gray-800">ZAHRA'Z</h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Your Cart</SheetTitle>
              <SheetDescription>
                Review your items and proceed to checkout
              </SheetDescription>
            </SheetHeader>
            <div className="mt-8 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {cartItems.length === 0 && (
                <p className="text-center text-gray-500">Your cart is empty</p>
              )}
              {cartItems.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="font-bold text-lg">
                    Total: AED
                    {cartItems
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-8 space-y-4">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                placeholder="Your Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={sendToWhatsApp}
                disabled={cartItems.length === 0 || !name || !address}
              >
                <Send className="mr-2 h-4 w-4" /> Checkout via WhatsApp
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <div className="relative w-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                          <h3 className="text-xl font-semibold">
                            {product.name}
                          </h3>
                          <p className="text-lg">
                            AED{product.price.toFixed(2)}
                          </p>
                          <Button
                            onClick={() => addToCart(product)}
                            className="mt-2"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      AED{product.price.toFixed(2)}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button onClick={() => addToCart(product)} size="sm">
                        Add to Cart
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
