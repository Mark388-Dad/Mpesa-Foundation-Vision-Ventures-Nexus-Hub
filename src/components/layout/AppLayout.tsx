
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { StudentSidebar } from "./sidebars/StudentSidebar";
import { EnterpriseSidebar } from "./sidebars/EnterpriseSidebar";
import { StaffSidebar } from "./sidebars/StaffSidebar";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  userRole?: UserRole;
}

export function AppLayout({ userRole }: AppLayoutProps) {
  const { profile, user, loading } = useAuth();
  const activeRole = userRole || profile?.role;
  
  console.log('AppLayout rendered with role:', activeRole, 'loading:', loading);
  console.log('Profile:', profile);
  console.log('User authenticated:', !!user);
  
  const renderSidebar = () => {
    if (!user || !activeRole) return null;
    
    switch (activeRole) {
      case 'student':
        return <StudentSidebar />;
      case 'enterprise':
        return <EnterpriseSidebar />;
      case 'staff':
        return <StaffSidebar />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      {user && activeRole ? (
        <SidebarProvider defaultOpen={true}>
          <div className="flex flex-1 w-full">
            {renderSidebar()}
            <SidebarInset>
              <Navbar userRole={activeRole} />
              <main className="flex-1 min-h-full overflow-auto p-4">
                <Outlet />
              </main>
              <Footer />
            </SidebarInset>
          </div>
        </SidebarProvider>
      ) : (
        <>
          <Navbar userRole={activeRole} />
          <main className="flex-1 min-h-full overflow-auto">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
