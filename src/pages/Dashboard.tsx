import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EnhancedProductForm } from "@/components/dashboard/EnhancedProductForm";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Plus,
  Calendar,
} from "lucide-react";

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const [showProductForm, setShowProductForm] = useState(false);
  const queryClient = useQueryClient();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!profile) {
    return <Navigate to="/auth" />;
  }

  // Get enterprise data for enterprise users
  const { data: enterprise } = useQuery({
    queryKey: ['enterprise', profile.enterpriseId],
    queryFn: async () => {
      if (!profile.enterpriseId) return null;
      
      console.log("Fetching enterprise data for:", profile.enterpriseId);
      const { data, error } = await supabase
        .from('enterprises')
        .select(`
          *,
          enterprise_categories(*)
        `)
        .eq('id', profile.enterpriseId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching enterprise:", error);
        return null;
      }
      console.log("Enterprise data:", data);
      return data;
    },
    enabled: !!profile.enterpriseId && profile.role === 'enterprise'
  });

  // Get enterprise categories
  const { data: categories } = useQuery({
    queryKey: ['enterprise-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Get products for enterprise users
  const { data: products } = useQuery({
    queryKey: ['enterprise-products', profile.enterpriseId],
    queryFn: async () => {
      if (!profile.enterpriseId) return [];
      
      console.log("Fetching products for enterprise:", profile.enterpriseId);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          enterprise_categories!category_id(name)
        `)
        .eq('enterprise_id', profile.enterpriseId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      console.log("Products for dashboard:", data);
      return data || [];
    },
    enabled: !!profile.enterpriseId && profile.role === 'enterprise'
  });

  // Get bookings for enterprise users
  const { data: bookings } = useQuery({
    queryKey: ['enterprise-bookings', profile.enterpriseId],
    queryFn: async () => {
      if (!profile.enterpriseId) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products!inner(
            name,
            price,
            enterprise_id
          )
        `)
        .eq('products.enterprise_id', profile.enterpriseId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile.enterpriseId && profile.role === 'enterprise'
  });

  // Get student bookings
  const { data: studentBookings } = useQuery({
    queryKey: ['student-bookings', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products(
            name,
            price,
            image_url,
            enterprises(name)
          )
        `)
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: profile.role === 'student'
  });

  // Add product mutation with loading state
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      console.log("Creating product with data:", productData);
      console.log("Enterprise ID:", profile.enterpriseId);
      
      if (!profile.enterpriseId) {
        throw new Error("No enterprise ID found");
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          category_id: productData.categoryId,
          enterprise_id: profile.enterpriseId,
          image_url: productData.imageUrl,
          video_url: productData.videoUrl,
          file_url: productData.fileUrl,
          sticker_url: productData.stickerUrl
        });

      if (error) {
        console.error("Product creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      setShowProductForm(false);
      queryClient.invalidateQueries({ queryKey: ['enterprise-products', profile.enterpriseId] });
    },
    onError: (error: any) => {
      console.error("Product creation failed:", error);
      toast.error(`Failed to create product: ${error.message}`);
    }
  });

  const handleProductSubmit = async (productData: any) => {
    createProductMutation.mutate(productData);
  };

  // Render different dashboards based on role
  if (profile.role === 'enterprise') {
    const totalProducts = products?.length || 0;
    const totalBookings = bookings?.length || 0;
    const totalRevenue = bookings?.reduce((sum, booking) => {
      return sum + (booking.products?.price || 0) * booking.quantity;
    }, 0) || 0;

    return (
      <div className="academy-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Enterprise Dashboard</h1>
            {enterprise && (
              <p className="text-muted-foreground">
                {enterprise.name} - {enterprise.enterprise_categories?.name}
              </p>
            )}
          </div>
          <Button onClick={() => setShowProductForm(true)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Category</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-lg mr-2">{enterprise?.enterprise_categories?.icon}</span>
                <span className="font-medium">{enterprise?.enterprise_categories?.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products and Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products?.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        KES {product.price} • Qty: {product.quantity}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {product.enterprise_categories?.name || 'No category'}
                    </Badge>
                  </div>
                ))}
                {(!products || products.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No products yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings?.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.products?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {booking.quantity} • {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                ))}
                {(!bookings || bookings.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No bookings yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add New Product</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowProductForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <EnhancedProductForm 
                  onSubmit={handleProductSubmit}
                  categories={categories || []}
                  isSubmitting={createProductMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (profile.role === 'student') {
    const totalBookings = studentBookings?.length || 0;
    const pendingBookings = studentBookings?.filter(b => b.status === 'pending').length || 0;
    const completedBookings = studentBookings?.filter(b => b.status === 'completed').length || 0;

    return (
      <div className="academy-container py-8">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pendingBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentBookings?.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {booking.products?.image_url && (
                      <img 
                        src={booking.products.image_url} 
                        alt={booking.products.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{booking.products?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.products?.enterprises?.name} • Qty: {booking.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      booking.status === 'confirmed' ? 'default' : 
                      booking.status === 'completed' ? 'secondary' :
                      booking.status === 'cancelled' ? 'destructive' : 'outline'
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Staff Dashboard
  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enterprises</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-16">
        <h3 className="text-lg font-medium mb-2">Welcome to the Staff Dashboard</h3>
        <p className="text-muted-foreground mb-4">
          Use the navigation menu to access analytics, manage products, communications, and more.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
