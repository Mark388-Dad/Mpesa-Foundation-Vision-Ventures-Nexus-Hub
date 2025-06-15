
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StudentSidebar } from "./sidebars/StudentSidebar";
import { EnterpriseSidebar } from "./sidebars/EnterpriseSidebar";
import { StaffSidebar } from "./sidebars/StaffSidebar";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  userRole?: UserRole;
}

export function AppLayout({ userRole }: AppLayoutProps) {
  const { profile } = useAuth();
  const activeRole = userRole || profile?.role;
  
  console.log('AppLayout rendered with role:', activeRole);
  console.log('Profile:', profile);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={activeRole} />
      
      <div className="flex flex-1 w-full">
        {/* Role-specific sidebar */}
        {activeRole === 'student' && <StudentSidebar />}
        {activeRole === 'enterprise' && <EnterpriseSidebar />}
        {activeRole === 'staff' && <StaffSidebar />}
        
        {/* Main content area */}
        <main className={cn(
          "flex-1 bg-gray-50 min-h-full overflow-auto",
          activeRole ? "md:ml-0" : "w-full"
        )}>
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
