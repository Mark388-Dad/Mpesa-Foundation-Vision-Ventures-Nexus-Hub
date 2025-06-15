
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Globe, Accessibility } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function BookingHeader() {
  const { user, profile, signOut } = useAuth();
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Fetch unread notifications count
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['notifications-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) {
        console.error('Error fetching notification count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user?.id
  });

  const toggleAccessibility = () => {
    setIsHighContrast(!isHighContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-academy-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏫</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MFA Booking Hub</h1>
              <p className="text-sm text-gray-600">Mpesa Foundation Academy</p>
            </div>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center space-x-4">
          {/* Role Badge */}
          {profile?.role && (
            <Badge className={getRoleColor(profile.role)}>
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </Badge>
          )}

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>🇬🇧 English</DropdownMenuItem>
              <DropdownMenuItem>🇰🇪 Kiswahili</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Accessibility Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAccessibility}
            className={isHighContrast ? 'bg-yellow-100' : ''}
          >
            <Accessibility className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden md:block">
                  Welcome, {profile?.fullName || profile?.username || user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {profile?.fullName || profile?.username || user?.email}
              </div>
              <div className="px-2 py-1.5 text-xs text-gray-500">
                {user?.email}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notification Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
