
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
import { User, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserRole } from "@/types";

interface NavbarProps {
  userRole?: UserRole;
}

export function Navbar({ userRole }: NavbarProps) {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Mocked user state for UI demonstration
  const isAuthenticated = !!userRole;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="academy-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-academy-blue">MFA</span>
              <span className="text-xl font-bold text-academy-green ml-1">Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/products" className="nav-link">Products</Link>
              {isAuthenticated && userRole === 'student' && (
                <Link to="/bookings" className="nav-link">My Bookings</Link>
              )}
              {isAuthenticated && userRole === 'enterprise' && (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              {isAuthenticated && userRole === 'staff' && (
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
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {userRole === 'student' && (
                    <DropdownMenuItem asChild>
                      <Link to="/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === 'enterprise' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === 'staff' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
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
            {isAuthenticated && userRole === 'student' && (
              <Link to="/bookings" className="nav-link block">My Bookings</Link>
            )}
            {isAuthenticated && userRole === 'enterprise' && (
              <Link to="/dashboard" className="nav-link block">Dashboard</Link>
            )}
            {isAuthenticated && userRole === 'staff' && (
              <Link to="/admin" className="nav-link block">Admin</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
