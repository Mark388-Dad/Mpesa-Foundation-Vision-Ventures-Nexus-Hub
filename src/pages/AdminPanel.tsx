
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { User, Enterprise, Product, Booking } from "@/types";

// Mock data for demonstration
const mockEnterprises: Enterprise[] = [
  {
    id: "1",
    name: "Snack Shop",
    description: "All your favorite snacks in one place",
    ownerId: "123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Soda Corner",
    description: "Refreshing drinks for everyone",
    ownerId: "124",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Clothing Store",
    description: "Quality clothing for students",
    ownerId: "125",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Crochet Crafts",
    description: "Handmade crochet items made with love",
    ownerId: "126",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockProducts: Product[] = [
  {
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
  },
  {
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
  },
];

const mockUsers: User[] = [
  {
    id: "123",
    email: "student1@mpesafoundationacademy.ac.ke",
    username: "student1",
    admissionNumber: "MFA12345",
    role: "enterprise",
    enterpriseId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "124",
    email: "student2@mpesafoundationacademy.ac.ke",
    username: "student2",
    admissionNumber: "MFA23456",
    role: "enterprise",
    enterpriseId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockBookings: (Booking & { product: Product; student: User })[] = [
  {
    id: "booking1",
    productId: "1",
    studentId: "student1",
    quantity: 2,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: mockProducts[0],
    student: {
      id: "student1",
      email: "student@mpesafoundationacademy.ac.ke",
      admissionNumber: "MFA12345",
      username: "student123",
      role: "student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "booking2",
    productId: "2",
    studentId: "student2",
    quantity: 1,
    status: "confirmed",
    pickupCode: "ABC12345",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: mockProducts[1],
    student: {
      id: "student2",
      email: "student2@mpesafoundationacademy.ac.ke",
      admissionNumber: "MFA54321",
      username: "student456",
      role: "student",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
];

const AdminPanel = () => {
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  // Calculate statistics
  const totalEnterprises = mockEnterprises.length;
  const totalProducts = mockProducts.length;
  const totalBookings = mockBookings.length;
  const totalRevenue = mockBookings.reduce((sum, booking) => {
    return sum + (booking.product.price * booking.quantity);
  }, 0);
  
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {mockEnterprises.map(enterprise => {
                const enterpriseOwner = mockUsers.find(user => user.id === enterprise.ownerId);
                const enterpriseProducts = mockProducts.filter(product => product.enterpriseId === enterprise.id);
                const enterpriseBookings = mockBookings.filter(booking => 
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
                            {enterpriseOwner?.username || 'Unknown'} ({enterpriseOwner?.admissionNumber || 'N/A'})
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
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card className="mt-6">
              <CardContent className="p-6">
                <BookingsList
                  bookings={mockBookings}
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
