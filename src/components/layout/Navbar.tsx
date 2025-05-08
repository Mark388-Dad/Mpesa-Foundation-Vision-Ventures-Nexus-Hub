
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, Menu, LogOut, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  userRole?: UserRole;
}

export function Navbar({ userRole }: NavbarProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();
  
  // Use provided role or the one from auth context
  const activeRole = userRole || profile?.role;
  const isAuthenticated = !!profile;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    if (signOut) {
      try {
        await signOut();
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="academy-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/fb06c830-b892-411b-a998-cdc07a581c12.png" 
                alt="MFA Hub Logo" 
                className="h-12 mr-2"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-academy-blue">MFA</span>
                <span className="text-xl font-bold text-academy-green -mt-1">Hub</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/products" className="nav-link">Products</Link>
              {isAuthenticated && activeRole === 'student' && (
                <Link to="/bookings" className="nav-link">My Bookings</Link>
              )}
              {isAuthenticated && activeRole === 'enterprise' && (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              {isAuthenticated && activeRole === 'staff' && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
            </nav>
          )}

          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {profile?.username || profile?.email}
                    <div className="text-xs text-muted-foreground font-normal mt-1">
                      {activeRole?.charAt(0).toUpperCase() + activeRole?.slice(1)}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {activeRole === 'student' && (
                    <DropdownMenuItem asChild>
                      <Link to="/bookings" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {activeRole === 'enterprise' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {activeRole === 'staff' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="btn-primary">
                <Link to="/auth">Login / Register</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden ml-2"
                onClick={toggleMenu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden py-2 space-y-1 animate-fade-in">
            <Link to="/" className="nav-link block">Home</Link>
            <Link to="/products" className="nav-link block">Products</Link>
            {isAuthenticated && activeRole === 'student' && (
              <Link to="/bookings" className="nav-link block">My Bookings</Link>
            )}
            {isAuthenticated && activeRole === 'enterprise' && (
              <Link to="/dashboard" className="nav-link block">Dashboard</Link>
            )}
            {isAuthenticated && activeRole === 'staff' && (
              <Link to="/admin" className="nav-link block">Admin</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
