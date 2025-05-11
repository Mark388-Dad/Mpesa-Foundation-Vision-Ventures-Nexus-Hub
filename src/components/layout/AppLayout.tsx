
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userRole={activeRole} />
      
      <div className="flex flex-1">
        {/* Role-specific sidebar */}
        {activeRole === 'student' && <StudentSidebar />}
        {activeRole === 'enterprise' && <EnterpriseSidebar />}
        {activeRole === 'staff' && <StaffSidebar />}
        
        <main className={cn("flex-1 bg-gray-50")}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
