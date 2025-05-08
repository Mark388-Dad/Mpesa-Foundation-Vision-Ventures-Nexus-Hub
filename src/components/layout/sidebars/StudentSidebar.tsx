
import { Link } from "react-router-dom";
import { 
  ShoppingCart,
  BookOpen,
  User,
  Star,
  Bell,
  MessageSquare,
  Home
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function StudentSidebar() {
  const { profile } = useAuth();

  // Only render if authenticated as student
  if (!profile || profile.role !== 'student') {
    return null;
  }

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: ShoppingCart, label: "Products", path: "/products" },
    { icon: BookOpen, label: "My Bookings", path: "/bookings" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Star, label: "Reviews", path: "/reviews" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: MessageSquare, label: "Support", path: "/support" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-4">
        <h2 className="font-semibold text-lg text-academy-blue">Student Dashboard</h2>
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
