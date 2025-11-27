"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, Heart, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: "main",
    label: "Main",
    icon: Home,
    path: "/",
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingBag,
    path: "/products",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: Heart,
    path: "/wishlist",
  },
  {
    id: "offers",
    label: "Offers",
    icon: Tag,
    path: "/offers",
  },
];

export function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    if (path === "/products") {
      // Also highlight products when on product detail pages
      return pathname.startsWith(path) || pathname.startsWith("/product/");
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full relative",
                "transition-colors duration-200",
                active ? "text-gray-900" : "text-gray-500"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-all duration-200",
                    active && "scale-110"
                  )}
                />
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  active ? "font-semibold" : "font-normal"
                )}
              >
                {item.label}
              </span>
              {active && (
                <motion.div
                  className="absolute inset-0 bg-gray-50 rounded-t-2xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

