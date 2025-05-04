
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { User, Enterprise, Product, Booking } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const AdminPanel = () => {
  const { profile, loading } = useAuth();
  
  // Redirect if not staff
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  if (!profile || profile.role !== 'staff') {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" />;
  }
  
  const { data: enterprises = [], isLoading: isLoadingEnterprises } = useQuery({
    queryKey: ['enterprises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprises')
        .select('*');
        
      if (error) throw error;
      
      // Transform database result to match our frontend Enterprise type
      return (data || []).map(enterprise => ({
        id: enterprise.id,
        name: enterprise.name,
        description: enterprise.description,
        logoUrl: enterprise.logo_url,
        ownerId: enterprise.owner_id,
        createdAt: enterprise.created_at,
        updatedAt: enterprise.updated_at
      })) as Enterprise[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading enterprises: ${error.message}`);
      }
    }
  });
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, enterprises:enterprise_id(*)');
        
      if (error) throw error;
      
      // Transform to match our frontend types
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.image_url,
        enterpriseId: item.enterprise_id,
        categoryId: item.category_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        enterprise: {
          id: item.enterprises.id,
          name: item.enterprises.name,
          description: item.enterprises.description,
          logoUrl: item.enterprises.logo_url,
          ownerId: item.enterprises.owner_id,
          createdAt: item.enterprises.created_at,
          updatedAt: item.enterprises.updated_at
        }
      })) as (Product & { enterprise: Enterprise })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });
  
  const { data: enterpriseOwners = [], isLoading: isLoadingOwners } = useQuery({
    queryKey: ['enterpriseOwners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'enterprise')
        .not('enterprise_id', 'is', null);
        
      if (error) throw error;
      
      // Transform database result to match our frontend User type
      return (data || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        username: profile.username,
        fullName: profile.full_name,
        admissionNumber: profile.admission_number,
        phoneNumber: profile.phone_number,
        role: profile.role as User["role"],
        enterpriseId: profile.enterprise_id,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      })) as User[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading enterprise owners: ${error.message}`);
      }
    }
  });
  
  const { data: bookingsData = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products:product_id(*),
          students:student_id(*)
        `);
        
      if (error) throw error;
      
      // Transform to match our frontend types
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
        },
        student: {
          id: booking.students.id,
          email: booking.students.email,
          username: booking.students.username,
          admissionNumber: booking.students.admission_number,
          role: booking.students.role,
          createdAt: booking.students.created_at,
          updatedAt: booking.students.updated_at
        }
      })) as (Booking & { product: Product; student: User })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading bookings: ${error.message}`);
      }
    }
  });
  
  const isLoading = isLoadingEnterprises || isLoadingProducts || isLoadingBookings || isLoadingOwners;
  
  // Calculate statistics
  const totalEnterprises = enterprises.length;
  const totalProducts = products.length;
  const totalBookings = bookingsData.length;
  const totalRevenue = bookingsData.reduce((sum, booking) => {
    return sum + (booking.product.price * booking.quantity);
  }, 0);
  
  if (isLoading) {
    return (
      <div className="academy-container py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Staff Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all academy enterprises
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <div className="text-2xl font-bold">KES {totalRevenue}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="enterprises">
          <TabsList>
            <TabsTrigger value="enterprises">Enterprises</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enterprises">
            {enterprises.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium mb-2">No enterprises found</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    There are no enterprises registered in the system yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {enterprises.map(enterprise => {
                  const enterpriseOwner = enterpriseOwners.find(user => user.enterpriseId === enterprise.id);
                  const enterpriseProducts = products.filter(product => product.enterpriseId === enterprise.id);
                  const enterpriseBookings = bookingsData.filter(booking => 
                    enterpriseProducts.some(product => product.id === booking.productId)
                  );
                  const enterpriseRevenue = enterpriseBookings.reduce((sum, booking) => {
                    return sum + (booking.product.price * booking.quantity);
                  }, 0);
                  
                  return (
                    <Card key={enterprise.id}>
                      <CardHeader>
                        <CardTitle>{enterprise.name}</CardTitle>
                        <CardDescription>{enterprise.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">Manager</p>
                            <p className="text-muted-foreground">
                              {enterpriseOwner?.username || 'No manager assigned'} 
                              {enterpriseOwner?.admissionNumber ? `(${enterpriseOwner.admissionNumber})` : ''}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Products</p>
                              <p className="text-2xl font-bold">{enterpriseProducts.length}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Bookings</p>
                              <p className="text-2xl font-bold">{enterpriseBookings.length}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Revenue</p>
                              <p className="text-2xl font-bold text-academy-green">KES {enterpriseRevenue}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card className="mt-6">
              <CardContent className="p-6">
                <BookingsList
                  bookings={bookingsData}
                  isLoading={isLoadingBookings}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
