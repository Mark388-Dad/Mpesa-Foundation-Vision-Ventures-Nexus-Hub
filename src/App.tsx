import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import EnterpriseProducts from "./pages/enterprise/EnterpriseProducts";
import EnterpriseFeedback from "./pages/enterprise/EnterpriseFeedback";
import EnterpriseNotifications from "./pages/enterprise/EnterpriseNotifications";
import EnterpriseSettings from "./pages/enterprise/EnterpriseSettings";
import AdminPanel from "./pages/AdminPanel";
import StudentBookings from "./pages/StudentBookings";
import StudentDashboard from "./pages/StudentDashboard";
import StudentReviews from "./pages/student/StudentReviews";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSupport from "./pages/student/StudentSupport";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  userRole: string;
  children: React.ReactNode;
}

const ProtectedRoute = ({ userRole, children }: ProtectedRouteProps) => {
  const { profile, loading } = useAuth();
  
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if the user is authenticated and has the correct role
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }
  
  // If a specific role is required, check if the user has that role
  if (userRole && profile.role !== userRole) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Routes component that uses auth context
const AppRoutes = () => {
  const { profile } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Index />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/auth" element={
          profile ? <Navigate to="/" replace /> : <Auth />
        } />
      </Route>
      
      {/* Student Routes */}
      <Route path="/" element={<AppLayout userRole="student" />}>
        <Route 
          path="/student" 
          element={
            <ProtectedRoute userRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute userRole="student">
              <StudentBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reviews" 
          element={
            <ProtectedRoute userRole="student">
              <StudentReviews />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute userRole="student">
              <StudentNotifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/support" 
          element={
            <ProtectedRoute userRole="student">
              <StudentSupport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute userRole="student">
              <div className="academy-container py-8">
                <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
                <p className="text-muted-foreground">Profile management coming soon.</p>
              </div>
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Enterprise Routes */}
      <Route path="/" element={<AppLayout userRole="enterprise" />}>
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute userRole="enterprise">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enterprise/products" 
          element={
            <ProtectedRoute userRole="enterprise">
              <EnterpriseProducts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enterprise/feedback" 
          element={
            <ProtectedRoute userRole="enterprise">
              <EnterpriseFeedback />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enterprise/notifications" 
          element={
            <ProtectedRoute userRole="enterprise">
              <EnterpriseNotifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/enterprise/settings" 
          element={
            <ProtectedRoute userRole="enterprise">
              <EnterpriseSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute userRole="enterprise">
              <div className="academy-container py-8">
                <h1 className="text-2xl font-bold mb-6">Enterprise Profile</h1>
                <p className="text-muted-foreground">Profile management coming soon.</p>
              </div>
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Staff Routes */}
      <Route path="/" element={<AppLayout userRole="staff" />}>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute userRole="staff">
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute userRole="staff">
              <div className="academy-container py-8">
                <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
                <p className="text-muted-foreground">Profile management coming soon.</p>
              </div>
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
