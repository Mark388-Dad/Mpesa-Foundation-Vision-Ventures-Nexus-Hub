
import { Link } from "react-router-dom";
import { 
  Home,
  Calendar,
  FlaskRound,
  Users,
  FileText,
  Bell,
  User,
  Settings,
  LogOut,
  BookOpen,
  Edit,
  Search,
  HelpCircle,
  Mail
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function StudentSidebar() {
  const { profile, signOut } = useAuth();

  // Only render if authenticated as student
  if (!profile || profile.role !== 'student') {
    return null;
  }

  const mainMenuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Book a Room", path: "/book-room" },
    { icon: FlaskRound, label: "Book a Lab Session", path: "/book-lab" },
    { icon: Users, label: "Book Teacher Consultation", path: "/book-consultation" },
    { icon: FileText, label: "Request Equipment", path: "/request-equipment" },
  ];

  const bookingMenuItems = [
    { icon: BookOpen, label: "View Upcoming Bookings", path: "/bookings" },
    { icon: BookOpen, label: "View Past Bookings", path: "/bookings/past" },
    { icon: Edit, label: "Cancel/Edit Requests", path: "/bookings/manage" },
  ];

  const filterItems = [
    { icon: Calendar, label: "By Date/Time", path: "/bookings/filter?type=date" },
    { icon: BookOpen, label: "By Room Type", path: "/bookings/filter?type=room" },
    { icon: Search, label: "Available Slots", path: "/bookings/available" },
  ];

  const toolItems = [
    { icon: Bell, label: "Notifications", path: "/notifications", badge: "3" },
    { icon: Mail, label: "Submit Feedback", path: "/feedback" },
    { icon: User, label: "Profile & Settings", path: "/profile" },
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
          <span className="text-2xl">🧑‍🎓</span>
          <h2 className="font-semibold text-lg text-academy-blue">Student Portal</h2>
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

        {/* My Bookings Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            My Bookings
          </h3>
          <ul>
            {bookingMenuItems.map((item) => (
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

        {/* Filters/Search Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Filters/Search
          </h3>
          <ul>
            {filterItems.map((item) => (
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

        {/* Tools Section */}
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Tools
          </h3>
          <ul>
            {toolItems.map((item) => (
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
