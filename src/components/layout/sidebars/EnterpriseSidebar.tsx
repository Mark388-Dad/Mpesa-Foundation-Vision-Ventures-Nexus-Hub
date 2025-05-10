
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Package, BarChart3, MessageSquare, Bell, Settings } from "lucide-react";

export const EnterpriseSidebar = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Products",
      icon: Package,
      href: "/enterprise/products",
      color: "text-violet-500",
    },
    {
      label: "Feedback",
      icon: MessageSquare,
      href: "/enterprise/feedback",
      color: "text-pink-700",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/enterprise/notifications",
      color: "text-orange-700",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/enterprise/settings",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-800">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Enterprise</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={isActive(route.href) ? "default" : "ghost"}
              className={cn("w-full justify-start", 
                isActive(route.href) ? "bg-gray-100 hover:bg-gray-100" : ""
              )}
            >
              <Link to={route.href}>
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
