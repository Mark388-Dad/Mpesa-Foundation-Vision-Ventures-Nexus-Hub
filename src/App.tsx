
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProductsPage from "./pages/ProductsPage";
import BrowseProducts from "./pages/BrowseProducts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth route - standalone without AppLayout */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Main app routes with AppLayout */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="browse" element={<BrowseProducts />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
