
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking, Product, Enterprise } from "@/types";
import { formatPrice, formatDate } from "@/utils/helpers";

// Mock data for demonstration
const mockBookings: (Booking & { 
  product: Product & { enterprise: Enterprise } 
})[] = [
  {
    id: "booking1",
    productId: "1",
    studentId: "student1",
    quantity: 2,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: {
      id: "1",
      name: "Chocolate Bar",
      description: "Delicious milk chocolate",
      price: 50,
      quantity: 20,
      imageUrl: undefined,
      enterpriseId: "1",
      categoryId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enterprise: {
        id: "1",
        name: "Snack Shop",
        description: "All your favorite snacks in one place",
        ownerId: "123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  },
  {
    id: "booking2",
    productId: "2",
    studentId: "student1",
    quantity: 1,
    status: "confirmed",
    pickupCode: "ABC12345",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: {
      id: "2",
      name: "Soda",
      description: "Refreshing drink",
      price: 60,
      quantity: 15,
      imageUrl: undefined,
      enterpriseId: "2",
      categoryId: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enterprise: {
        id: "2",
        name: "Soda Corner",
        description: "Refreshing drinks for everyone",
        ownerId: "124",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  },
  {
    id: "booking3",
    productId: "3",
    studentId: "student1",
    quantity: 1,
    status: "completed",
    pickupCode: "DEF67890",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "3",
      name: "School T-Shirt",
      description: "Comfortable cotton t-shirt with school logo.",
      price: 350,
      quantity: 10,
      imageUrl: undefined,
      enterpriseId: "3",
      categoryId: "3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enterprise: {
        id: "3",
        name: "Clothing Store",
        description: "Quality clothing for students",
        ownerId: "125",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }
  },
];

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
  const [activeBookings, setActiveBookings] = useState(
    mockBookings.filter(booking => 
      booking.status === "pending" || booking.status === "confirmed"
    )
  );
  const [pastBookings, setPastBookings] = useState(
    mockBookings.filter(booking => 
      booking.status === "completed" || booking.status === "cancelled"
    )
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCancelBooking = (bookingId: string) => {
    // Find booking to cancel
    const bookingToCancel = activeBookings.find(b => b.id === bookingId);
    if (!bookingToCancel) return;
    
    // Update active bookings
    setActiveBookings(activeBookings.filter(b => b.id !== bookingId));
    
    // Add to past bookings with cancelled status
    setPastBookings([
      ...pastBookings,
      { ...bookingToCancel, status: "cancelled" }
    ]);
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
              <div className="text-2xl font-bold">{mockBookings.length}</div>
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
                              >
                                Cancel Booking
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
