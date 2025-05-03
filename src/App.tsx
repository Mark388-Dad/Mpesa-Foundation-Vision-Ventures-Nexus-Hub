
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import StudentBookings from "./pages/StudentBookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
          
          {/* Student Routes */}
          <Route path="/" element={<AppLayout userRole="student" />}>
            <Route path="/bookings" element={<StudentBookings />} />
          </Route>
          
          {/* Enterprise Routes */}
          <Route path="/" element={<AppLayout userRole="enterprise" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* Staff Routes */}
          <Route path="/" element={<AppLayout userRole="staff" />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
