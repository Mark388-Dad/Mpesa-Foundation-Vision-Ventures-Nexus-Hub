
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Calendar, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, Booking } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { toast } from "sonner";

const StudentDashboard = () => {
  const { profile, loading } = useAuth();
  
  // Redirect if not student
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  if (!profile || profile.role !== 'student') {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" />;
  }
  
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['student-bookings', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products:product_id(*)
        `)
        .eq('student_id', profile.id);
        
      if (error) throw error;
      
      return (data || []).map((booking: any) => ({
        id: booking.id,
        productId: booking.product_id,
        studentId: booking.student_id,
        quantity: booking.quantity,
        status: booking.status,
        pickupCode: booking.pickup_code,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at,
        product: {
          id: booking.products.id,
          name: booking.products.name,
          description: booking.products.description,
          price: booking.products.price,
          quantity: booking.products.quantity,
          imageUrl: booking.products.image_url,
          enterpriseId: booking.products.enterprise_id,
          categoryId: booking.products.category_id,
          createdAt: booking.products.created_at,
          updatedAt: booking.products.updated_at
        }
      })) as (Booking & { product: Product })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading bookings: ${error.message}`);
      }
    }
  });

  // Get recent products
  const { data: recentProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['recent-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (error) throw error;
      
      return (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        imageUrl: product.image_url,
        enterpriseId: product.enterprise_id,
        categoryId: product.category_id,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      })) as Product[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {profile.fullName || profile.username || profile.email}
            </p>
          </div>
          <Button asChild className="btn-primary">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings + confirmedBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Pending Pickup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>New Products</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="text-center py-4">Loading products...</div>
                ) : recentProducts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No products available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProducts.map(product => (
                      <div key={product.id} className="flex items-center p-3 border rounded-md">
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center mr-3">
                          {product.imageUrl ? (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover rounded" 
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/products/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="text-center py-4">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">You haven't made any bookings yet.</p>
                    <Button asChild className="mt-4">
                      <Link to="/products">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left">Product</th>
                          <th className="py-3 px-4 text-center">Quantity</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map(booking => (
                          <tr key={booking.id} className="border-b">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                                  {booking.product.imageUrl ? (
                                    <img 
                                      src={booking.product.imageUrl} 
                                      alt={booking.product.name} 
                                      className="w-full h-full object-cover rounded" 
                                    />
                                  ) : (
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">{booking.product.name}</h4>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">{booking.quantity}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                variant="outline"
                                className={
                                  booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                    : booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : booking.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {bookings.length > 5 && (
                      <div className="text-center mt-4">
                        <Button asChild variant="outline">
                          <Link to="/bookings">View All Bookings</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
