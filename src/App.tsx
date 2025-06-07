
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";

// Import pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ProductsPage from "@/pages/ProductsPage";
import BrowseProducts from "@/pages/BrowseProducts";
import ProductDetail from "@/pages/ProductDetail";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

// Student pages
import StudentDashboard from "@/pages/StudentDashboard";
import StudentBookings from "@/pages/StudentBookings";
import StudentNotifications from "@/pages/student/StudentNotifications";
import StudentReviews from "@/pages/student/StudentReviews";
import StudentSupport from "@/pages/student/StudentSupport";

// Enterprise pages
import EnterpriseProducts from "@/pages/enterprise/EnterpriseProducts";
import EnterpriseFeedback from "@/pages/enterprise/EnterpriseFeedback";
import EnterpriseNotifications from "@/pages/enterprise/EnterpriseNotifications";
import EnterpriseSettings from "@/pages/enterprise/EnterpriseSettings";

// Staff pages
import AdminPanel from "@/pages/AdminPanel";
import AdminAnalytics from "@/pages/staff/AdminAnalytics";
import AdminProducts from "@/pages/staff/AdminProducts";
import AdminCommunications from "@/pages/staff/AdminCommunications";
import AdminNotifications from "@/pages/staff/AdminNotifications";
import AdminSettings from "@/pages/staff/AdminSettings";

// Category pages
import CategoryProducts from "@/pages/CategoryProducts";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="auth" element={<Auth />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="browse" element={<BrowseProducts />} />
              <Route path="products/:productId" element={<ProductDetail />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Student routes */}
              <Route path="student/dashboard" element={<StudentDashboard />} />
              <Route path="student/bookings" element={<StudentBookings />} />
              <Route path="student/notifications" element={<StudentNotifications />} />
              <Route path="student/reviews" element={<StudentReviews />} />
              <Route path="student/support" element={<StudentSupport />} />
              
              {/* Enterprise routes */}
              <Route path="enterprise/products" element={<EnterpriseProducts />} />
              <Route path="enterprise/feedback" element={<EnterpriseFeedback />} />
              <Route path="enterprise/notifications" element={<EnterpriseNotifications />} />
              <Route path="enterprise/settings" element={<EnterpriseSettings />} />
              
              {/* Staff/Admin routes */}
              <Route path="admin" element={<AdminPanel />} />
              <Route path="admin/analytics" element={<AdminAnalytics />} />
              <Route path="admin/products" element={<AdminProducts />} />
              <Route path="admin/communications" element={<AdminCommunications />} />
              <Route path="admin/notifications" element={<AdminNotifications />} />
              <Route path="admin/settings" element={<AdminSettings />} />
              
              {/* Category routes */}
              <Route path="categories/:categoryId" element={<CategoryProducts />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
