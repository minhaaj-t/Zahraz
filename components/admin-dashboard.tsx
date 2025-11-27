"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Product } from "@/lib/products";
import { fetchProducts, fetchOrders, fetchStats, createProduct, updateProduct, deleteProduct } from "@/lib/api";
import { ImageUpload } from "@/components/image-upload";

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  interface Order {
    id?: number;
    customerName?: string;
    address?: string;
    items?: Array<{ name: string; quantity: number; price: number }>;
    total?: number;
    status?: string;
  }
  
  interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    inStockProducts: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

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
      const [productsData, ordersData, statsData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchStats(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setStats(statsData);
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

      if (editingProduct) {
        // Update existing product
        const result = await updateProduct(editingProduct.id, productData, token);
        if (result.success) {
          await loadData(); // Reload to sync with backend
        }
      } else {
        // Add new product
        const result = await createProduct(productData, token);
        if (result.success) {
          await loadData(); // Reload to sync with backend
        }
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
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
    <div className="min-h-screen bg-gray-900 text-white">
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
      <div className="md:ml-64 p-4 md:p-6 pt-20 md:pt-6">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">Total Products</CardTitle>
                  <Package className="h-8 w-8 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{displayStats.totalProducts}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">Total Orders</CardTitle>
                  <ShoppingCart className="h-8 w-8 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{displayStats.totalOrders}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
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

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-300">In Stock</CardTitle>
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{displayStats.inStockProducts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="bg-gray-800 border-gray-700">
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
                <Card key={product.id} className="bg-gray-800 border-gray-700">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-xl font-bold text-blue-400 mb-4">
                      AED {Number(product.price).toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
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

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Orders Management</h2>
            <Card className="bg-gray-800 border-gray-700">
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
                          {order.items?.map((item: { name: string; quantity: number; price: number }, idx: number) => (
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
              <Card className="bg-gray-800 border-gray-700">
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
                      <span className="font-bold">{displayStats.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Order Value</span>
                      <span className="font-bold">
                        AED{" "}
                        {displayStats.totalOrders > 0
                          ? ((displayStats.totalRevenue || 0) / displayStats.totalOrders).toFixed(2)
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
                      <span className="font-bold">{displayStats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">In Stock</span>
                      <span className="font-bold text-green-400">
                        {displayStats.inStockProducts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Out of Stock</span>
                      <span className="font-bold text-red-400">
                        {displayStats.totalProducts - displayStats.inStockProducts}
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
            <Card className="bg-gray-800 border-gray-700">
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
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Store Name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Store Email
                  </label>
                  <Input
                    type="email"
                    defaultValue="admin@zahraz.com"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Store Email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    WhatsApp Number
                  </label>
                  <Input
                    defaultValue="+971528485234"
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="WhatsApp Number"
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
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Product Name"
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
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
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
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Category"
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

