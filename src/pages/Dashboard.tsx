
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EnhancedProductForm } from "@/components/dashboard/EnhancedProductForm";
import { BookingsList } from "@/components/dashboard/BookingsList";
import { Product, ProductFormData, EnterpriseCategory, Booking, User } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast: uiToast } = useToast();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has enterprise role
  if (!profile) {
    toast.error("You need to be logged in to access the enterprise dashboard");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'enterprise') {
    toast.error("You don't have permission to access the enterprise dashboard");
    return <Navigate to="/" />;
  }

  // Use the enterprise ID from the profile if available, otherwise use the user ID
  const enterpriseId = profile.enterpriseId || user?.id;

  if (!enterpriseId) {
    toast.error("Enterprise ID not found. Please contact support.");
    return <Navigate to="/" />;
  }

  const { data: categories = [] } = useQuery({
    queryKey: ['enterprise-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*');
      
      if (error) throw error;
      
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        imageUrl: category.image_url,
        createdAt: category.created_at,
        updatedAt: category.updated_at
      })) as EnterpriseCategory[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading categories: ${error.message}`);
      }
    }
  });
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['enterprise-products', enterpriseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, enterprise_categories:category_id(*)')
        .eq('enterprise_id', enterpriseId);
      
      if (error) throw error;
      
      return (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        imageUrl: product.image_url,
        videoUrl: product.video_url,
        fileUrl: product.file_url,
        stickerUrl: product.sticker_url,
        enterpriseId: product.enterprise_id,
        categoryId: product.category_id,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        category: product.enterprise_categories ? {
          id: product.enterprise_categories.id,
          name: product.enterprise_categories.name,
          description: product.enterprise_categories.description,
          icon: product.enterprise_categories.icon,
          color: product.enterprise_categories.color,
          imageUrl: product.enterprise_categories.image_url,
          createdAt: product.enterprise_categories.created_at,
          updatedAt: product.enterprise_categories.updated_at
        } : undefined
      })) as (Product & { category?: EnterpriseCategory })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });
  
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['enterprise-bookings', enterpriseId],
    queryFn: async () => {
      // First get the enterprise's product IDs
      const { data: enterpriseProducts } = await supabase
        .from('products')
        .select('id')
        .eq('enterprise_id', enterpriseId);
      
      if (!enterpriseProducts || enterpriseProducts.length === 0) {
        return [];
      }
      
      const productIds = enterpriseProducts.map(p => p.id);
      
      // Then get all bookings for those products with proper joins
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products:product_id(*),
          profiles:student_id(*)
        `)
        .in('product_id', productIds);
      
      if (error) throw error;
      
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
          videoUrl: booking.products.video_url,
          fileUrl: booking.products.file_url,
          stickerUrl: booking.products.sticker_url,
          enterpriseId: booking.products.enterprise_id,
          categoryId: booking.products.category_id,
          createdAt: booking.products.created_at,
          updatedAt: booking.products.updated_at
        },
        student: {
          id: booking.profiles.id,
          email: booking.profiles.email,
          username: booking.profiles.username,
          fullName: booking.profiles.full_name,
          admissionNumber: booking.profiles.admission_number,
          phoneNumber: booking.profiles.phone_number,
          role: booking.profiles.role,
          enterpriseId: booking.profiles.enterprise_id,
          createdAt: booking.profiles.created_at,
          updatedAt: booking.profiles.updated_at
        }
      })) as (Booking & { product: Product; student: User })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading bookings: ${error.message}`);
      }
    }
  });
  
  // Product mutation
  const addProductMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      console.log("Adding product for enterprise:", enterpriseId);
      
      // Check if we need to upload files first
      let imageUrl = undefined;
      let videoUrl = undefined;
      let fileUrl = undefined;
      let stickerUrl = undefined;
      
      const uploadFile = async (file: File, bucket: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${enterpriseId}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);
          
        if (uploadError) {
          console.error(`${bucket} upload error:`, uploadError);
          throw uploadError;
        }
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
          
        return publicUrl;
      };

      if (formData.image) {
        imageUrl = await uploadFile(formData.image, 'product-images');
      }
      
      if (formData.video) {
        videoUrl = await uploadFile(formData.video, 'product-videos');
      }
      
      if (formData.file) {
        fileUrl = await uploadFile(formData.file, 'product-files');
      }
      
      if (formData.sticker) {
        stickerUrl = await uploadFile(formData.sticker, 'product-stickers');
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          quantity: formData.quantity,
          image_url: imageUrl,
          video_url: videoUrl,
          file_url: fileUrl,
          sticker_url: stickerUrl,
          enterprise_id: enterpriseId,
          category_id: formData.categoryId
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      uiToast({
        title: "Product Added",
        description: "Your product has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['enterprise-products'] });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Product mutation error:", error);
      uiToast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Booking status change mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: Booking["status"] }) => {
      // Generate a pickup code if confirming booking
      const pickupCode = status === 'confirmed' 
        ? Math.random().toString(36).substring(2, 8).toUpperCase() 
        : undefined;
        
      const updates = {
        status,
        ...(pickupCode && { pickup_code: pickupCode }),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      uiToast({
        title: "Booking Updated",
        description: "The booking status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['enterprise-bookings'] });
    },
    onError: (error: any) => {
      uiToast({
        title: "Error",
        description: `Failed to update booking: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const handleAddProduct = async (formData: ProductFormData): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      addProductMutation.mutate(formData, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          reject(error);
        }
      });
    });
  };
  
  const handleBookingStatusChange = (bookingId: string, status: Booking["status"]) => {
    updateBookingStatusMutation.mutate({ bookingId, status });
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
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <EnhancedProductForm
                  categories={categories}
                  onSubmit={handleAddProduct}
                  isSubmitting={addProductMutation.isPending}
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
                        {products.map(product => (
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
                              {product.category?.name || "Unknown"}
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
                        ))}
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
