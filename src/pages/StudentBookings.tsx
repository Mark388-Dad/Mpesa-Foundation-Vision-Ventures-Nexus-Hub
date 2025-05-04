
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking, Product, Enterprise } from "@/types";
import { formatPrice, formatDate } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const getStatusBadge = (status: Booking['status']) => {
  switch (status) {
    case "pending":
      return <Badge className="bg-academy-amber">Pending</Badge>;
    case "confirmed":
      return <Badge className="bg-academy-blue">Confirmed</Badge>;
    case "completed":
      return <Badge className="bg-academy-green">Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const StudentBookings = () => {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  
  // Redirect if not student
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  if (!profile || profile.role !== 'student') {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/" />;
  }
  
  const { data: bookingsData = [], isLoading } = useQuery({
    queryKey: ['student-bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products:product_id(*, enterprises:enterprise_id(*))
        `)
        .eq('student_id', user?.id);
        
      if (error) throw error;
      
      // Transform to match our frontend types
      return (data || []).map(booking => ({
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
          updatedAt: booking.products.updated_at,
          enterprise: {
            id: booking.products.enterprises.id,
            name: booking.products.enterprises.name,
            description: booking.products.enterprises.description,
            logoUrl: booking.products.enterprises.logo_url,
            ownerId: booking.products.enterprises.owner_id,
            createdAt: booking.products.enterprises.created_at,
            updatedAt: booking.products.enterprises.updated_at,
          }
        }
      })) as (Booking & { 
        product: Product & { enterprise: Enterprise } 
      })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading bookings: ${error.message}`);
      }
    },
    enabled: !!user?.id
  });
  
  const activeBookings = bookingsData.filter(booking => 
    booking.status === "pending" || booking.status === "confirmed"
  );
  
  const pastBookings = bookingsData.filter(booking => 
    booking.status === "completed" || booking.status === "cancelled"
  );
  
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
    },
    onError: (error: any) => {
      toast.error(`Error cancelling booking: ${error.message}`);
    }
  });
  
  const handleCancelBooking = (bookingId: string) => {
    cancelBookingMutation.mutate(bookingId);
  };
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your product bookings
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsData.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pastBookings.filter(b => b.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bookings Tabs */}
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : activeBookings.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium mb-2">No active bookings</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    You don't have any pending or confirmed bookings.
                    Browse products to make a booking.
                  </p>
                  <Button asChild className="btn-primary">
                    <a href="/products">Browse Products</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 mt-6">
                {activeBookings.map(booking => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.product.name}</CardTitle>
                          <CardDescription>From {booking.product.enterprise.name}</CardDescription>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm font-medium mb-1">Booking Details</p>
                          <ul className="space-y-1 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Quantity:</span>
                              <span>{booking.quantity}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Price per item:</span>
                              <span>{formatPrice(booking.product.price)}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total:</span>
                              <span className="font-medium">
                                {formatPrice(booking.product.price * booking.quantity)}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{formatDate(booking.createdAt)}</span>
                            </li>
                          </ul>
                        </div>
                        
                        {booking.status === "confirmed" && booking.pickupCode && (
                          <div className="md:col-span-1">
                            <p className="text-sm font-medium mb-1">Pickup Code</p>
                            <div className="bg-gray-100 p-3 rounded-md text-center">
                              <p className="font-mono text-lg font-bold">{booking.pickupCode}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Show this code when collecting your item
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className={booking.status === "confirmed" ? "md:col-span-1" : "md:col-span-2"}>
                          <p className="text-sm font-medium mb-1">Actions</p>
                          <div className="space-y-2">
                            {booking.status === "pending" && (
                              <Button
                                variant="outline"
                                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancelBookingMutation.isPending}
                              >
                                {cancelBookingMutation.isPending ? "Cancelling..." : "Cancel Booking"}
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              className="w-full"
                              asChild
                            >
                              <a href={`mailto:${booking.product.enterprise.id}@mpesafoundationacademy.ac.ke`}>
                                Contact Enterprise
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : pastBookings.length === 0 ? (
              <Card className="mt-6">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    You don't have any completed or cancelled bookings yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 mt-6">
                {pastBookings.map(booking => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{booking.product.name}</CardTitle>
                          <CardDescription>From {booking.product.enterprise.name}</CardDescription>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium mb-1">Booking Details</p>
                          <ul className="space-y-1 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Quantity:</span>
                              <span>{booking.quantity}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total:</span>
                              <span className="font-medium">
                                {formatPrice(booking.product.price * booking.quantity)}
                              </span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{formatDate(booking.createdAt)}</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Actions</p>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              asChild
                            >
                              <a href={`/products/${booking.product.id}`}>
                                Book Again
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentBookings;
