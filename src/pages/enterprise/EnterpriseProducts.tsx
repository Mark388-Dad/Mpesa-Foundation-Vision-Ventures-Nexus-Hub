
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { ProductFormData } from "@/types";

const EnterpriseProducts = () => {
  const { profile, user, loading } = useAuth();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has enterprise role
  if (!profile) {
    toast.error("You need to be logged in to access enterprise products");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'enterprise') {
    toast.error("You don't have permission to access enterprise products");
    return <Navigate to="/" />;
  }

  // Use the enterprise ID from the profile if available, otherwise use the user ID
  const enterpriseId = profile.enterpriseId || user?.id;

  // Fetch categories for the form
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
        
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch products for this enterprise
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['enterprise-products', enterpriseId],
    queryFn: async () => {
      console.log("Fetching products for enterprise ID:", enterpriseId);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('enterprise_id', enterpriseId);
        
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      console.log("Products fetched successfully:", data);
      return data || [];
    }
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      setIsSubmitting(true);
      console.log("Submitting product with enterprise_id:", enterpriseId);
      
      // Handle image upload if there's an image
      let imageUrl = null;
      if (productData.image) {
        const fileExt = productData.image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${enterpriseId}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, productData.image);
          
        if (uploadError) {
          console.error("Image upload error:", uploadError);
          throw uploadError;
        }
        
        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Insert product data into the database
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          category_id: productData.categoryId,
          enterprise_id: enterpriseId,
          image_url: imageUrl
        }])
        .select();
        
      if (error) {
        console.error("Product submission error:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast.success("Product added successfully!");
      setIsAddProductOpen(false);
      queryClient.invalidateQueries({ queryKey: ['enterprise-products', enterpriseId] });
    },
    onError: (error: any) => {
      console.error("Error in mutation:", error);
      toast.error(`Failed to save product: ${error.message}`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmitProduct = async (data: ProductFormData) => {
    try {
      await addProductMutation.mutateAsync(data);
    } catch (error) {
      console.error("Product submission failed:", error);
      // Error is handled by the mutation's onError
    }
  };

  return (
    <div className="academy-container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enterprise Products</h1>
        <Drawer open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DrawerTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" /> Add New Product
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add New Product</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2">
              <ProductForm 
                categories={categories} 
                onSubmit={handleSubmitProduct}
                isSubmitting={isSubmitting}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h2 className="mt-4 text-lg font-medium">No products yet</h2>
              <p className="text-muted-foreground mt-2">
                Add your first product to start receiving bookings
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-left">{product.name}</TableCell>
                      <TableCell className="text-right">KES {product.price}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseProducts;
