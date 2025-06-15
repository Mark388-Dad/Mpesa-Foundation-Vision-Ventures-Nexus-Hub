
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  FileText, 
  BookOpen, 
  Mail, 
  Upload, 
  Download, 
  HelpCircle, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft, 
  ChevronRight,
  Users
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";

export const EnterpriseSidebar = () => {
  const { pathname } = useLocation();
  const { profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const mainRoutes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: "Book School Facilities",
      icon: Calendar,
      href: "/booking",
      color: "text-violet-500",
    },
    {
      label: "Browse Products",
      icon: FileText,
      href: "/browse",
      color: "text-pink-700",
    },
    {
      label: "My Products",
      icon: BookOpen,
      href: "/products",
      color: "text-orange-500",
    },
  ];

  const reservationRoutes = [
    {
      label: "View Reservations",
      icon: BookOpen,
      href: "/enterprise/reservations",
      color: "text-blue-500",
    },
    {
      label: "Message Coordinator",
      icon: Mail,
      href: "/enterprise/messages",
      color: "text-green-500",
    },
  ];

  const supportRoutes = [
    {
      label: "Upload Documents",
      icon: Upload,
      href: "/enterprise/documents",
      color: "text-purple-500",
    },
    {
      label: "Download Approvals",
      icon: Download,
      href: "/enterprise/approvals",
      color: "text-indigo-500",
    },
    {
      label: "Help & Instructions",
      icon: HelpCircle,
      href: "/enterprise/help",
      color: "text-yellow-600",
    },
    {
      label: "Contact Admin",
      icon: Users,
      href: "/enterprise/contact",
      color: "text-red-500",
    },
  ];

  const settingsRoutes = [
    {
      label: "Edit Profile",
      icon: User,
      href: "/profile",
      color: "text-gray-600",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/enterprise/settings",
      color: "text-gray-500",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-white text-gray-800 transition-all duration-300 border-r",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="px-3 py-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          {!collapsed && (
            <>
              <span className="text-2xl mr-2">🏢</span>
              <div>
                <h2 className="font-semibold text-lg">Enterprise</h2>
                <p className="text-xs text-muted-foreground">
                  {profile?.fullName || profile?.username || profile?.email}
                </p>
              </div>
            </>
          )}
          {collapsed && <span className="text-2xl mx-auto">🏢</span>}
        </div>

        {/* Main Section */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Main
            </h3>
          )}
          {mainRoutes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={isActive(route.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start", 
                isActive(route.href) ? "bg-gray-100 hover:bg-gray-100" : "",
                collapsed ? "px-2" : ""
              )}
            >
              <Link to={route.href} className="flex items-center">
                <route.icon className={cn("h-4 w-4", route.color, collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span className="text-sm">{route.label}</span>}
              </Link>
            </Button>
          ))}
        </div>

        {!collapsed && <Separator className="my-4" />}

        {/* Reservations Section */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              My Reservations
            </h3>
          )}
          {reservationRoutes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={isActive(route.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start", 
                isActive(route.href) ? "bg-gray-100 hover:bg-gray-100" : "",
                collapsed ? "px-2" : ""
              )}
            >
              <Link to={route.href} className="flex items-center">
                <route.icon className={cn("h-4 w-4", route.color, collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span className="text-sm">{route.label}</span>}
              </Link>
            </Button>
          ))}
        </div>

        {!collapsed && <Separator className="my-4" />}

        {/* Support Section */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Support & Access
            </h3>
          )}
          {supportRoutes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={isActive(route.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start", 
                isActive(route.href) ? "bg-gray-100 hover:bg-gray-100" : "",
                collapsed ? "px-2" : ""
              )}
            >
              <Link to={route.href} className="flex items-center">
                <route.icon className={cn("h-4 w-4", route.color, collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span className="text-sm">{route.label}</span>}
              </Link>
            </Button>
          ))}
        </div>

        {!collapsed && <Separator className="my-4" />}

        {/* Settings Section */}
        <div className="space-y-1 mb-4">
          {!collapsed && (
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Settings
            </h3>
          )}
          {settingsRoutes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={isActive(route.href) ? "default" : "ghost"}
              className={cn(
                "w-full justify-start", 
                isActive(route.href) ? "bg-gray-100 hover:bg-gray-100" : "",
                collapsed ? "px-2" : ""
              )}
            >
              <Link to={route.href} className="flex items-center">
                <route.icon className={cn("h-4 w-4", route.color, collapsed ? "mx-auto" : "mr-3")} />
                {!collapsed && <span className="text-sm">{route.label}</span>}
              </Link>
            </Button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-auto">
          {!collapsed && <Separator className="my-4" />}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
              collapsed ? "px-2" : ""
            )}
          >
            <LogOut className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </div>
      
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-5 h-6 w-6 rounded-full bg-white border border-gray-200 shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
