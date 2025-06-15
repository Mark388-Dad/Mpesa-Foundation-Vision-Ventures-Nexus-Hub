
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductsPage from "./pages/ProductsPage";
import BrowseProducts from "./pages/BrowseProducts";
import BookingDashboard from "./pages/BookingDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Enterprise pages
import EnterpriseReservations from "./pages/enterprise/EnterpriseReservations";
import EnterpriseMessages from "./pages/enterprise/EnterpriseMessages";
import EnterpriseDocuments from "./pages/enterprise/EnterpriseDocuments";
import EnterpriseApprovals from "./pages/enterprise/EnterpriseApprovals";
import EnterpriseHelp from "./pages/enterprise/EnterpriseHelp";
import EnterpriseContact from "./pages/enterprise/EnterpriseContact";
import EnterpriseSettings from "./pages/enterprise/EnterpriseSettings";

const queryClient = new QueryClient();

function App() {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen w-full">
            <Routes>
              {/* Auth route - standalone without AppLayout */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Booking Dashboard - standalone without AppLayout */}
              <Route path="/booking" element={<BookingDashboard />} />
              
              {/* Main app routes with AppLayout */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="browse" element={<BrowseProducts />} />
                <Route path="profile" element={<Profile />} />
                
                {/* Enterprise routes */}
                <Route path="enterprise/reservations" element={<EnterpriseReservations />} />
                <Route path="enterprise/messages" element={<EnterpriseMessages />} />
                <Route path="enterprise/documents" element={<EnterpriseDocuments />} />
                <Route path="enterprise/approvals" element={<EnterpriseApprovals />} />
                <Route path="enterprise/help" element={<EnterpriseHelp />} />
                <Route path="enterprise/contact" element={<EnterpriseContact />} />
                <Route path="enterprise/settings" element={<EnterpriseSettings />} />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
