
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface AppLayoutProps {
  userRole?: 'student' | 'enterprise' | 'staff';
}

export function AppLayout({ userRole }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userRole={userRole} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
