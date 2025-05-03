
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { Product, ProductFormData, Category, Booking, User } from "@/types";

// Mock data for demonstration
const mockCategories: Category[] = [
  { id: "1", name: "Snacks", description: "Delicious treats" },
  { id: "2", name: "Drinks", description: "Refreshing beverages" },
  { id: "3", name: "Clothing", description: "Stylish apparel" },
  { id: "4", name: "Crafts", description: "Handmade items" },
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
    enterpriseId: "1",
    categoryId: "2",
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

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [bookings, setBookings] = useState<(Booking & { product: Product; student: User })[]>(mockBookings);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  
  const { toast } = useToast();
  
  // Product management functions
  const handleAddProduct = async (formData: ProductFormData) => {
    setIsSubmittingProduct(true);
    
    try {
      // Simulate API call to add product
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        quantity: formData.quantity,
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
        enterpriseId: "1", // Current user's enterprise
        categoryId: formData.categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to state
      setProducts([...products, newProduct]);
      
      toast({
        title: "Product Added",
        description: `${formData.name} has been added to your inventory.`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingProduct(false);
    }
  };
  
  // Booking management functions
  const handleBookingStatusChange = async (bookingId: string, status: Booking["status"]) => {
    try {
      // Simulate API call to update booking status
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      );
      
      setBookings(updatedBookings);
      
      toast({
        title: "Booking Updated",
        description: `Booking status changed to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Stats calculation
  const totalProducts = products.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const totalInventory = products.reduce((sum, product) => sum + product.quantity, 0);
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Enterprise Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your products and bookings
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                Total Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInventory} items</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedBookings}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="products">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">Add New Product</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                  categories={mockCategories}
                  onSubmit={handleAddProduct}
                  isSubmitting={isSubmittingProduct}
                />
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="products">
            <Card>
              <CardContent className="p-6">
                {isLoadingProducts ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No products yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first product to start receiving bookings
                    </p>
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="btn-primary"
                    >
                      Add Product
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left">Product</th>
                          <th className="py-3 px-4 text-left">Category</th>
                          <th className="py-3 px-4 text-right">Price</th>
                          <th className="py-3 px-4 text-right">Quantity</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const category = mockCategories.find(c => c.id === product.categoryId);
                          
                          return (
                            <tr key={product.id} className="border-b">
                              <td className="py-4 px-4">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                                    {product.imageUrl ? (
                                      <img 
                                        src={product.imageUrl} 
                                        alt={product.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    ) : (
                                      <span className="text-xs text-muted-foreground">
                                        No img
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      ID: {product.id.slice(0, 8)}...
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                {category?.name || "Unknown"}
                              </td>
                              <td className="py-4 px-4 text-right">
                                KES {product.price}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <span className={`${product.quantity <= 5 ? "text-amber-500" : "text-academy-green"}`}>
                                  {product.quantity}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex space-x-2 justify-end">
                                  <Button size="sm" variant="outline">
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bookings">
            <Card>
              <CardContent className="p-6">
                <BookingsList
                  bookings={bookings}
                  showActions={true}
                  onStatusChange={handleBookingStatusChange}
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

export default Dashboard;
