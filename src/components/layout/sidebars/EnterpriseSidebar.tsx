
import { Link } from "react-router-dom";
import { 
  Package,
  Bell,
  User,
  MessageSquare,
  Home,
  Settings,
  BarChart,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function EnterpriseSidebar() {
  const { profile } = useAuth();
  
  // Only render if authenticated as enterprise member
  if (!profile || profile.role !== 'enterprise') {
    return null;
  }
  
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Products", path: "/dashboard" },
    { icon: ShoppingCart, label: "Bookings", path: "/dashboard?tab=bookings" },
    { icon: BarChart, label: "Analytics", path: "/dashboard/analytics" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
    { icon: MessageSquare, label: "Feedback", path: "/dashboard/feedback" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-4">
        <h2 className="font-semibold text-lg text-academy-green">Enterprise Dashboard</h2>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="h-5 w-5 mr-3 text-academy-green" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
