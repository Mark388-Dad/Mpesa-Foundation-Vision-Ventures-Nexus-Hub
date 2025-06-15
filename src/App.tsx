
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
import NotFound from "./pages/NotFound";

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
