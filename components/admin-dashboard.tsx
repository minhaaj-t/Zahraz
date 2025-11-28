"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  DollarSign,
  Images,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Product } from "@/lib/products";
import {
  type Banner,
  fetchProducts,
  fetchOrders,
  fetchStats,
  fetchBanners,
  createProduct,
  updateProduct,
  deleteProduct,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/api";
import { ImageUpload } from "@/components/image-upload";
import { MultiImageUpload } from "@/components/multi-image-upload";

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Array<{
    id?: number;
    customerName?: string;
    address?: string;
    items?: Array<{ name: string; price: number; quantity: number }>;
    total?: number;
    status?: string;
  }>>([]);
  const [stats, setStats] = useState<{
    totalProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
    inStockProducts?: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);

  useEffect(() => {
    // Check for existing token
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    } else {
      // If no token, redirect to login
      router.push("/web-admin");
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData, statsData, bannersData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchStats(),
        fetchBanners(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setStats(statsData);
      const orderedBanners = (bannersData || []).sort(
        (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
      );
      setBanners(orderedBanners);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminToken");
    setToken(null);
    router.push("/web-admin");
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        if (!token) {
          alert("Please login first");
          return;
        }
        await deleteProduct(id, token);
        setProducts(products.filter((p) => p.id !== id));
        await loadData(); // Reload to sync with backend
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      // Prepare product data - ensure image is properly handled
      const dataToSend = { ...productData };
      
      // If updating and image hasn't changed (it's a URL, not base64), keep it
      if (editingProduct && dataToSend.image && !dataToSend.image.startsWith('data:image')) {
        // Image is already a URL, keep it as is
      } else if (!dataToSend.image || dataToSend.image === '') {
        // If no image provided when updating, don't send image field (backend will keep existing)
        if (editingProduct) {
          delete dataToSend.image;
        }
      }

      if (editingProduct) {
        // Update existing product
        const result = await updateProduct(editingProduct.id, dataToSend, token);
        if (result.success) {
          await loadData(); // Reload to sync with backend
          setShowProductForm(false);
          setEditingProduct(null);
        } else {
          alert(result.error || "Failed to update product");
        }
      } else {
        // Add new product
        if (!dataToSend.image || dataToSend.image === '') {
          alert("Please upload a product image");
          return;
        }
        const result = await createProduct(dataToSend, token);
        if (result.success) {
          await loadData(); // Reload to sync with backend
          setShowProductForm(false);
          setEditingProduct(null);
        } else {
          alert(result.error || "Failed to create product");
        }
      }
    } catch (error: unknown) {
      console.error("Error saving product:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to save product: " + errorMessage);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setShowBannerForm(true);
  };

  const handleSaveBanner = async (bannerData: Partial<Banner>) => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      if (editingBanner) {
        const result = await updateBanner(editingBanner.id, bannerData, token);
        if (!result.success) {
          alert(result.error || "Failed to update banner");
          return;
        }
      } else {
        if (!bannerData.title || !bannerData.image) {
          alert("Banner title and image are required");
          return;
        }
        const result = await createBanner(bannerData, token);
        if (!result.success) {
          alert(result.error || "Failed to create banner");
          return;
        }
      }

      await loadData();
      setShowBannerForm(false);
      setEditingBanner(null);
    } catch (error: unknown) {
      console.error("Error saving banner:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to save banner: " + errorMessage);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!token) {
      alert("Please login first");
      return;
    }
    if (!confirm("Delete this banner?")) return;
    try {
      await deleteBanner(id, token);
      await loadData();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use stats from API or calculate from local data
  const displayStats = stats || {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    inStockProducts: products.filter((p) => p.inStock).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 p-4 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ZAHRA&apos;Z Admin
        </h1>
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          className="border-gray-600"
        >
          Menu
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-40 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ZAHRA&apos;Z Admin
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "products", label: "Products", icon: Package },
            { id: "banners", label: "Banners", icon: Images },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-6 md:p-10 pt-24 md:pt-10 transition-all">
        <div className="max-w-7xl mx-auto space-y-10">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">Total Products</CardTitle>
                  <Package className="h-8 w-8 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{displayStats.totalProducts || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">Total Orders</CardTitle>
                  <ShoppingCart className="h-8 w-8 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{displayStats.totalOrders || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">Total Revenue</CardTitle>
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    AED {displayStats.totalRevenue?.toFixed(2) || "0.00"}
                  </div>
                </CardContent>
              </Card>

            <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">In Stock</CardTitle>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{displayStats.inStockProducts || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-400">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{order.customerName || "Guest"}</p>
                          <p className="text-sm text-gray-400">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">AED {order.total?.toFixed(2) || "0.00"}</p>
                          <p className="text-sm text-gray-400">Pending</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">Products Management</h2>
              <div className="flex gap-2">
                <Button
                  onClick={loadData}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!token}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-gray-900/60 border border-gray-800 shadow-lg">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xl font-bold text-blue-400">
                      AED {Number(product.price).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-blue-400 font-semibold">
                  Hero Slider
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold">Banner Management</h2>
                <p className="text-gray-400">Control the homepage hero carousel order, copy, and CTAs.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={loadData}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => {
                    setEditingBanner(null);
                    setShowBannerForm(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Banner
                </Button>
              </div>
            </div>

            <Card className="bg-gray-900/60 border-gray-800">
              <CardContent className="p-4 sm:p-6">
                {banners.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    No banners configured yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className="bg-gray-800/70 border border-gray-700 rounded-xl overflow-hidden flex flex-col shadow-lg"
                      >
                        <div className="relative h-48">
                          <Image
                            src={banner.image || "/placeholder.png"}
                            alt={banner.title}
                            fill
                            sizes="(min-width: 1024px) 45vw, 90vw"
                            className="object-cover"
                            unoptimized
                          />
                          <span className="absolute top-3 left-3 bg-black/60 text-xs px-3 py-1 rounded-full">
                            Order #{banner.orderIndex ?? 0}
                          </span>
                          <span
                            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
                              banner.isActive === false
                                ? "bg-red-500/20 text-red-300"
                                : "bg-green-500/20 text-green-300"
                            }`}
                          >
                            {banner.isActive === false ? "Hidden" : "Live"}
                          </span>
                        </div>
                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                          <div>
                            <h3 className="text-lg font-semibold">{banner.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {banner.subtitle || "—"}
                            </p>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            {banner.buttonText && (
                              <p className="flex items-center gap-2">
                                <span className="text-gray-500 uppercase tracking-wide text-xs">CTA</span>
                                {banner.buttonText}
                              </p>
                            )}
                            {banner.buttonLink && (
                              <p className="flex items-center gap-2 break-all">
                                <Link2 className="h-4 w-4 text-gray-500" />
                                {banner.buttonLink}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 pt-2 mt-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBanner(banner)}
                              className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Orders Management</h2>
            <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-400">No orders found</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-700/50 rounded-lg space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">
                              {order.customerName || "Guest"}
                            </p>
                            <p className="text-sm text-gray-400">{order.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-blue-400">
                              AED {order.total?.toFixed(2) || "0.00"}
                            </p>
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                              Pending
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-600 pt-3">
                          <p className="text-sm font-semibold mb-2">Items:</p>
                          {order.items?.map((item: { name: string; price: number; quantity: number }, idx: number) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm text-gray-300"
                            >
                              <span>
                                {item.name} x {item.quantity || 1}
                              </span>
                              <span>AED {(item.price * (item.quantity || 1)).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Sales</span>
                      <span className="font-bold">AED {displayStats.totalRevenue?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Orders</span>
                      <span className="font-bold">{displayStats.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Order Value</span>
                      <span className="font-bold">
                        AED{" "}
                        {(displayStats.totalOrders || 0) > 0
                          ? ((displayStats.totalRevenue || 0) / (displayStats.totalOrders || 1)).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Product Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Products</span>
                      <span className="font-bold">{displayStats.totalProducts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">In Stock</span>
                      <span className="font-bold text-green-400">
                        {displayStats.inStockProducts || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Out of Stock</span>
                      <span className="font-bold text-red-400">
                        {(displayStats.totalProducts || 0) - (displayStats.inStockProducts || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Settings</h2>
            <Card className="bg-gray-900/60 border border-gray-800 shadow-lg backdrop-blur">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Store Name
                  </label>
                  <Input
                    defaultValue="ZAHRA'Z Collections"
                    placeholder="Store Name"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Store Email
                  </label>
                  <Input
                    type="email"
                    defaultValue="admin@zahraz.com"
                    placeholder="Store Email"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    WhatsApp Number
                  </label>
                  <Input
                    defaultValue="+971528485234"
                    placeholder="WhatsApp Number"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
      {showBannerForm && (
        <BannerFormModal
          banner={editingBanner}
          onSave={handleSaveBanner}
          onClose={() => {
            setShowBannerForm(false);
            setEditingBanner(null);
          }}
        />
      )}
    </div>
  );
}

// Product Form Component
function ProductFormModal({
  product,
  onSave,
  onClose,
}: {
  product: Product | null;
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || "",
    price: product?.price || 0,
    image: product?.image || "",
    images: product?.images || [],
    description: product?.description || "",
    category: product?.category || "",
    rating: product?.rating || 4.5,
    reviews: product?.reviews || 0,
    inStock: product?.inStock ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-2xl font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Product Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product Name"
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Price (AED)
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) })
                }
                placeholder="0.00"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Category
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Category"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
          <ImageUpload
            onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
            currentImage={formData.image}
            label="Product Image"
          />
          {formData.image && !formData.image.startsWith('data:') && (
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Or enter Image URL
              </label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="https://..."
              />
            </div>
          )}
          <MultiImageUpload
            images={Array.isArray(formData.images) ? formData.images : []}
            onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            label="Gallery Images (optional)"
            limit={6}
          />
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white min-h-[100px]"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) =>
                setFormData({ ...formData, inStock: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="inStock" className="text-sm text-gray-300">
              In Stock
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {product ? "Update Product" : "Add Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function BannerFormModal({
  banner,
  onSave,
  onClose,
}: {
  banner: Banner | null;
  onSave: (data: Partial<Banner>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: banner?.title || "",
    subtitle: banner?.subtitle || "",
    image: banner?.image || "",
    buttonText: banner?.buttonText || "",
    buttonLink: banner?.buttonLink || "",
    orderIndex: banner?.orderIndex ?? 0,
    isActive: banner?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-400">Hero Banner</p>
            <h3 className="text-2xl font-bold">{banner ? "Edit Banner" : "Add Banner"}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Banner title"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Order Index
              </label>
              <Input
                type="number"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                className="bg-gray-800 border-gray-700 text-white"
                min={0}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Subtitle
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[80px]"
              placeholder="Supporting text"
            />
          </div>
          <ImageUpload
            onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
            currentImage={formData.image}
            label="Banner Image"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Button Text
              </label>
              <Input
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Optional e.g., Shop Now"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Button Link
              </label>
              <Input
                value={formData.buttonLink}
                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                placeholder="/products"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="banner-active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="banner-active" className="text-sm text-gray-300">
              Display this banner on the homepage
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {banner ? "Update Banner" : "Create Banner"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

