
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, User, Globe, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export function BookingHeader() {
  const { profile, user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [highContrast, setHighContrast] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement theme toggle
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    // TODO: Implement high contrast
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="academy-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-academy-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MFA</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-academy-blue">MFA Booking Hub</h1>
                <p className="text-xs text-gray-600">M-Pesa Foundation Academy</p>
              </div>
            </Link>
          </div>

          {/* Greeting */}
          <div className="hidden md:block">
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-semibold text-academy-blue">{profile?.fullName || profile?.username || 'User'}</span>
            </p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role} Dashboard</p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('sw')}>
                  🇰🇪 Kiswahili
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accessibility Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleContrast}>
                  High Contrast
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Increase Font Size
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
                3
              </Badge>
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile?.username || user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Quick Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
