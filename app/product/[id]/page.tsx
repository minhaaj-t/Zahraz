"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProductById, fetchRelatedProducts } from "@/lib/api";
import { ProductDetails } from "@/components/product-details";
import { type Product } from "@/lib/products";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: PageProps) {
  const router = useRouter();
  const productId = parseInt(params.id);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const [productData, relatedData] = await Promise.all([
          fetchProductById(productId),
          fetchRelatedProducts(productId),
        ]);
        setProduct(productData);
        setRelatedProducts(relatedData || []);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center pb-20 md:pb-0">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center pb-20 md:pb-0">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found</p>
          <button
            onClick={() => router.push("/")}
            className="text-blue-500 hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}
