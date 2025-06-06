
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetail from "./pages/ProductDetail";
import ProductsPage from "./pages/ProductsPage";
import BrowseProducts from "./pages/BrowseProducts";
import StudentDashboard from "./pages/StudentDashboard";
import StudentBookings from "./pages/StudentBookings";
import StudentReviews from "./pages/student/StudentReviews";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentSupport from "./pages/student/StudentSupport";
import EnterpriseProducts from "./pages/enterprise/EnterpriseProducts";
import EnterpriseFeedback from "./pages/enterprise/EnterpriseFeedback";
import EnterpriseNotifications from "./pages/enterprise/EnterpriseNotifications";
import EnterpriseSettings from "./pages/enterprise/EnterpriseSettings";
import AdminPanel from "./pages/AdminPanel";
import AdminProducts from "./pages/staff/AdminProducts";
import AdminAnalytics from "./pages/staff/AdminAnalytics";
import AdminCommunications from "./pages/staff/AdminCommunications";
import AdminNotifications from "./pages/staff/AdminNotifications";
import AdminSettings from "./pages/staff/AdminSettings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

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
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="category/:categoryId" element={<CategoryProducts />} />
                <Route path="product/:productId" element={<ProductDetail />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="browse" element={<BrowseProducts />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Student Routes */}
                <Route path="student/dashboard" element={<StudentDashboard />} />
                <Route path="student/bookings" element={<StudentBookings />} />
                <Route path="student/reviews" element={<StudentReviews />} />
                <Route path="student/notifications" element={<StudentNotifications />} />
                <Route path="student/support" element={<StudentSupport />} />
                
                {/* Enterprise Routes */}
                <Route path="enterprise/products" element={<EnterpriseProducts />} />
                <Route path="enterprise/feedback" element={<EnterpriseFeedback />} />
                <Route path="enterprise/notifications" element={<EnterpriseNotifications />} />
                <Route path="enterprise/settings" element={<EnterpriseSettings />} />
                
                {/* Staff/Admin Routes */}
                <Route path="admin" element={<AdminPanel />} />
                <Route path="admin/products" element={<AdminProducts />} />
                <Route path="admin/analytics" element={<AdminAnalytics />} />
                <Route path="admin/communications" element={<AdminCommunications />} />
                <Route path="admin/notifications" element={<AdminNotifications />} />
                <Route path="admin/settings" element={<AdminSettings />} />
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
