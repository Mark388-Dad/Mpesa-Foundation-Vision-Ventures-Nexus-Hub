
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
  Users
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const EnterpriseSidebar = () => {
  const { pathname } = useLocation();
  const { profile, signOut } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const mainRoutes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      label: "Book School Facilities",
      icon: Calendar,
      href: "/booking",
    },
    {
      label: "Browse Products",
      icon: FileText,
      href: "/browse",
    },
    {
      label: "My Products",
      icon: BookOpen,
      href: "/products",
    },
  ];

  const reservationRoutes = [
    {
      label: "View Reservations",
      icon: BookOpen,
      href: "/enterprise/reservations",
    },
    {
      label: "Message Coordinator",
      icon: Mail,
      href: "/enterprise/messages",
    },
  ];

  const supportRoutes = [
    {
      label: "Upload Documents",
      icon: Upload,
      href: "/enterprise/documents",
    },
    {
      label: "Download Approvals",
      icon: Download,
      href: "/enterprise/approvals",
    },
    {
      label: "Help & Instructions",
      icon: HelpCircle,
      href: "/enterprise/help",
    },
    {
      label: "Contact Admin",
      icon: Users,
      href: "/enterprise/contact",
    },
  ];

  const settingsRoutes = [
    {
      label: "Edit Profile",
      icon: User,
      href: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/enterprise/settings",
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
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <div>
              <h2 className="font-semibold text-lg">Enterprise</h2>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.fullName || profile?.username || profile?.email}
              </p>
            </div>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={isActive(route.href)}>
                    <Link to={route.href}>
                      <route.icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>My Reservations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reservationRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={isActive(route.href)}>
                    <Link to={route.href}>
                      <route.icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Support & Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={isActive(route.href)}>
                    <Link to={route.href}>
                      <route.icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsRoutes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={isActive(route.href)}>
                    <Link to={route.href}>
                      <route.icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
