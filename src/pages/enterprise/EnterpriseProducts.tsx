
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2, Video, FileText, Sticker } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { EnhancedProductForm } from "@/components/dashboard/EnhancedProductForm";
import { ProductFormData } from "@/types";

const EnterpriseProducts = () => {
  const { profile, user, loading } = useAuth();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
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

  console.log("Enterprise ID:", enterpriseId);
  console.log("Profile:", profile);

  // Fetch enterprise categories for the form
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['enterprise-categories'],
    queryFn: async () => {
      console.log("Fetching enterprise categories...");
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*')
        .order('name');
        
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Categories fetched:", data);
      return data || [];
    }
  });

  // Fetch products for this enterprise with proper join
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['enterprise-products', enterpriseId],
    queryFn: async () => {
      if (!enterpriseId) {
        console.log("No enterprise ID, returning empty array");
        return [];
      }
      
      console.log("Fetching products for enterprise ID:", enterpriseId);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          enterprise_categories!inner(
            id,
            name,
            description,
            icon,
            color
          )
        `)
        .eq('enterprise_id', enterpriseId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      console.log("Products fetched successfully:", data);
      return data || [];
    },
    enabled: !!enterpriseId
  });

  // Add product mutation with enhanced error handling
  const addProductMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      console.log("Starting product creation with data:", productData);
      console.log("Enterprise ID being used:", enterpriseId);
      
      if (!enterpriseId) {
        throw new Error("No enterprise ID found. Please ensure you're logged in as an enterprise user.");
      }

      // Handle file uploads if any
      const uploadFile = async (file: File, bucket: string) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${enterpriseId}/${fileName}`;
        
        console.log(`Uploading ${bucket} file:`, fileName);
        
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
          
        console.log(`${bucket} uploaded successfully:`, publicUrl);
        return publicUrl;
      };

      // Upload files to appropriate buckets
      let imageUrl = null;
      let videoUrl = null;
      let fileUrl = null;
      let stickerUrl = null;

      try {
        if (productData.image) {
          imageUrl = await uploadFile(productData.image, 'product-images');
        }
        if (productData.video) {
          videoUrl = await uploadFile(productData.video, 'product-videos');
        }
        if (productData.file) {
          fileUrl = await uploadFile(productData.file, 'product-files');
        }
        if (productData.sticker) {
          stickerUrl = await uploadFile(productData.sticker, 'product-stickers');
        }
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        throw new Error("Failed to upload files. Please try again.");
      }
      
      // Prepare product data for insertion
      const productToInsert = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
        category_id: productData.categoryId,
        enterprise_id: enterpriseId,
        image_url: imageUrl,
        video_url: videoUrl,
        file_url: fileUrl,
        sticker_url: stickerUrl
      };
      
      console.log("Inserting product:", productToInsert);
      
      // Insert product data into the database
      const { data, error } = await supabase
        .from('products')
        .insert([productToInsert])
        .select();
        
      if (error) {
        console.error("Product insertion error:", error);
        throw new Error(`Failed to create product: ${error.message}`);
      }
      
      console.log("Product created successfully:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("Product creation successful:", data);
      toast.success("Product added successfully!");
      setIsAddProductOpen(false);
      queryClient.invalidateQueries({ queryKey: ['enterprise-products', enterpriseId] });
    },
    onError: (error: any) => {
      console.error("Error in product creation mutation:", error);
      toast.error(`Failed to save product: ${error.message}`);
    }
  });

  const handleSubmitProduct = async (data: ProductFormData) => {
    console.log("Product form submitted:", data);
    try {
      await addProductMutation.mutateAsync(data);
    } catch (error) {
      console.error("Product submission failed:", error);
    }
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="academy-container py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="academy-container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Enterprise Products</h1>
          <p className="text-muted-foreground">
            Enterprise ID: {enterpriseId || 'Not found'}
          </p>
        </div>
        <Drawer open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DrawerTrigger asChild>
            <Button className="btn-primary">
              <Plus className="h-4 w-4 mr-2" /> Add New Product
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[90vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle>Add New Product</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-2 max-w-4xl mx-auto w-full">
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No categories available. Please contact administrator.</p>
                </div>
              ) : (
                <EnhancedProductForm 
                  categories={categories} 
                  onSubmit={handleSubmitProduct}
                  isSubmitting={addProductMutation.isPending}
                />
              )}
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
          <CardTitle>My Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
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
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Media</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-left">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">KES {product.price}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm text-muted-foreground">
                          {product.enterprise_categories?.name || 'No category'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {product.video_url && <Video className="h-4 w-4 text-blue-500" />}
                          {product.file_url && <FileText className="h-4 w-4 text-green-500" />}
                          {product.sticker_url && <Sticker className="h-4 w-4 text-purple-500" />}
                          {!product.video_url && !product.file_url && !product.sticker_url && (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </div>
                      </TableCell>
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
