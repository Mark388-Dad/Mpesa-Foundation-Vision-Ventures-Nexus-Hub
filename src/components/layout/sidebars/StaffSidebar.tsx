
import { Link } from "react-router-dom";
import { 
  Home,
  Calendar,
  FlaskRound,
  FileText,
  BookOpen,
  Search,
  Bell,
  Mail,
  Download,
  Users,
  Settings,
  LogOut,
  User,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function StaffSidebar() {
  const { profile, signOut } = useAuth();
  
  // Only render if authenticated as staff
  if (!profile || profile.role !== 'staff') {
    return null;
  }
  
  const mainMenuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Schedule Lessons", path: "/staff/schedule" },
    { icon: FlaskRound, label: "Manage Lab Bookings", path: "/staff/labs" },
    { icon: FileText, label: "Approve Facility Requests", path: "/staff/facilities" },
    { icon: BookOpen, label: "Manage Events/Rooms", path: "/staff/events" },
  ];

  const bookingMenuItems = [
    { icon: BookOpen, label: "All Bookings", path: "/staff/bookings" },
    { icon: Search, label: "Search & Filters", path: "/staff/bookings/search" },
    { icon: Bell, label: "Pending Approvals", path: "/staff/approvals", badge: "5" },
    { icon: FileText, label: "Rejected/Cancelled", path: "/staff/bookings/rejected" },
  ];

  const communicationItems = [
    { icon: Bell, label: "Notifications Panel", path: "/staff/notifications", badge: "12" },
    { icon: Mail, label: "Chat with Users", path: "/staff/chat" },
    { icon: Download, label: "Download Reports", path: "/staff/reports" },
    { icon: HelpCircle, label: "Usage Analytics", path: "/staff/analytics" },
  ];

  const adminItems = [
    { icon: Users, label: "Manage Users", path: "/admin/users" },
    { icon: Settings, label: "Manage Resources", path: "/admin/resources" },
    { icon: HelpCircle, label: "Generate Reports", path: "/admin/reports" },
  ];

  const settingsItems = [
    { icon: User, label: "Profile & Availability", path: "/staff/profile" },
    { icon: Settings, label: "Accessibility Tools", path: "/staff/accessibility" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block h-full overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">👨‍🏫</span>
          <h2 className="font-semibold text-lg text-academy-blue">Staff Portal</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {profile.fullName || profile.username || profile.email}
        </p>
      </div>
      
      <nav className="px-2 pb-4">
        {/* Main Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main
          </h3>
          <ul>
            {mainMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md mx-1"
                >
                  <item.icon className="h-4 w-4 mr-3 text-academy-blue" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        {/* Booking Management Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Booking Management
          </h3>
          <ul>
            {bookingMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md mx-1"
                >
                  <item.icon className="h-4 w-4 mr-3 text-academy-blue" />
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        {/* Communication & Tools Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Communication & Tools
          </h3>
          <ul>
            {communicationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md mx-1"
                >
                  <item.icon className="h-4 w-4 mr-3 text-academy-blue" />
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        {/* Admin-Only Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Admin-Only
          </h3>
          <ul>
            {adminItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md mx-1"
                >
                  <item.icon className="h-4 w-4 mr-3 text-academy-blue" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        {/* Settings Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Settings
          </h3>
          <ul>
            {settingsItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md mx-1"
                >
                  <item.icon className="h-4 w-4 mr-3 text-academy-blue" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-4" />

        {/* Logout */}
        <div className="px-1">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
          >
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
