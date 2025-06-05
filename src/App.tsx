import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminPanel from "./pages/AdminPanel";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import StudentBookings from "./pages/StudentBookings";
import NotFound from "./pages/NotFound";
import CategoryProducts from "./pages/CategoryProducts";
import EnterpriseProducts from "./pages/enterprise/EnterpriseProducts";
import EnterpriseFeedback from "./pages/enterprise/EnterpriseFeedback";
import EnterpriseNotifications from "./pages/enterprise/EnterpriseNotifications";
import EnterpriseSettings from "./pages/enterprise/EnterpriseSettings";
import AdminProducts from "./pages/staff/AdminProducts";
import AdminCommunications from "./pages/staff/AdminCommunications";
import AdminNotifications from "./pages/staff/AdminNotifications";
import AdminSettings from "./pages/staff/AdminSettings";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentReviews from "./pages/student/StudentReviews";
import StudentSupport from "./pages/student/StudentSupport";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="categories/:categoryId" element={<CategoryProducts />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="student" element={<StudentDashboard />} />
                <Route path="admin" element={<AdminPanel />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="bookings" element={<StudentBookings />} />
                
                {/* Enterprise Routes */}
                <Route path="enterprise/products" element={<EnterpriseProducts />} />
                <Route path="enterprise/feedback" element={<EnterpriseFeedback />} />
                <Route path="enterprise/notifications" element={<EnterpriseNotifications />} />
                <Route path="enterprise/settings" element={<EnterpriseSettings />} />
                
                {/* Staff Routes */}
                <Route path="admin/products" element={<AdminProducts />} />
                <Route path="admin/communications" element={<AdminCommunications />} />
                <Route path="admin/notifications" element={<AdminNotifications />} />
                <Route path="admin/settings" element={<AdminSettings />} />
                
                {/* Student Routes */}
                <Route path="notifications" element={<StudentNotifications />} />
                <Route path="reviews" element={<StudentReviews />} />
                <Route path="support" element={<StudentSupport />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
