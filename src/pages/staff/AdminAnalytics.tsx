
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const AdminAnalytics = () => {
  const { profile, loading } = useAuth();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has staff role
  if (!profile || profile.role !== 'staff') {
    toast.error("You don't have permission to access admin analytics");
    return <Navigate to="/" />;
  }

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get enterprises data
      const { data: enterprises } = await supabase
        .from('enterprises')
        .select('*, enterprise_categories(name), profiles!enterprises_owner_id_fkey(*)');

      // Get products data
      const { data: products } = await supabase
        .from('products')
        .select('*, enterprise_categories(name)');

      // Get bookings data
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, products(price, enterprise_categories(name))');

      // Get notifications data
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*');

      return {
        enterprises: enterprises || [],
        products: products || [],
        bookings: bookings || [],
        notifications: notifications || []
      };
    }
  });

  if (isLoading) {
    return (
      <div className="academy-container py-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="academy-container py-8">
        <div className="text-center">No analytics data available</div>
      </div>
    );
  }

  // Calculate stats
  const totalEnterprises = analytics.enterprises.length;
  const totalProducts = analytics.products.length;
  const totalBookings = analytics.bookings.length;
  const totalRevenue = analytics.bookings.reduce((sum, booking) => {
    return sum + (booking.products?.price || 0) * booking.quantity;
  }, 0);

  // Category distribution
  const categoryData = analytics.products.reduce((acc: any, product) => {
    const categoryName = product.enterprise_categories?.name || 'Uncategorized';
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
    color: `hsl(${Math.random() * 360}, 50%, 50%)`
  }));

  // Booking status distribution
  const statusData = analytics.bookings.reduce((acc: any, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count
  }));

  // Revenue by category
  const revenueByCategory = analytics.bookings.reduce((acc: any, booking) => {
    const categoryName = booking.products?.enterprise_categories?.name || 'Uncategorized';
    const revenue = (booking.products?.price || 0) * booking.quantity;
    acc[categoryName] = (acc[categoryName] || 0) + revenue;
    return acc;
  }, {});

  const revenueData = Object.entries(revenueByCategory).map(([category, revenue]) => ({
    category,
    revenue
  }));

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enterprises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnterprises}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">KES {totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Products by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`KES ${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.notifications.slice(0, 10).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{notification.type}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
