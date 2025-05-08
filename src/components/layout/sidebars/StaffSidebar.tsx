
import { Link } from "react-router-dom";
import { 
  Users,
  Package,
  BarChart,
  Settings,
  Shield,
  MessageSquare,
  Home,
  Bell
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function StaffSidebar() {
  const { profile } = useAuth();
  
  // Only render if authenticated as staff
  if (!profile || profile.role !== 'staff') {
    return null;
  }
  
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Shield, label: "Admin Panel", path: "/admin" },
    { icon: Users, label: "Enterprises", path: "/admin?tab=enterprises" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: BarChart, label: "Analytics", path: "/admin/analytics" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { icon: MessageSquare, label: "Communications", path: "/admin/communications" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-4">
        <h2 className="font-semibold text-lg text-academy-blue">Staff Dashboard</h2>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="h-5 w-5 mr-3 text-academy-blue" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
