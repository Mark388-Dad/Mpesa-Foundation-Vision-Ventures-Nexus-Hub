
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { Product, ProductFormData, Category } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Plus, Search, Filter, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const EnterpriseProducts = () => {
  const { profile, loading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast: uiToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  
  // Redirect if not enterprise user
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  if (!profile || profile.role !== 'enterprise' || !profile.enterpriseId) {
    toast.error("You don't have permission to access the enterprise products");
    return <Navigate to="/" />;
  }

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
      })) as Category[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading categories: ${error.message}`);
      }
    }
  });
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['enterprise-products', profile.enterpriseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories:category_id(*)')
        .eq('enterprise_id', profile.enterpriseId);
      
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
        updatedAt: product.updated_at,
        category: {
          id: product.categories.id,
          name: product.categories.name,
          description: product.categories.description
        }
      })) as (Product & { category: Category })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });
  
  // Product mutation
  const addProductMutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      // Check if we need to upload an image first
      let imageUrl = undefined;
      
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const filePath = `${profile!.enterpriseId}/${Date.now()}.${fileExt}`;
        
        // Upload image
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, formData.image);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      // Create product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          quantity: formData.quantity,
          image_url: imageUrl,
          enterprise_id: profile!.enterpriseId,
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
      uiToast({
        title: "Error",
        description: `Failed to add product: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      uiToast({
        title: "Product Deleted",
        description: "Your product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['enterprise-products'] });
    },
    onError: (error: any) => {
      uiToast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
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

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  // Filter products based on search query and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "" || product.categoryId === categoryFilter;
    
    const matchesStock = stockFilter === "" ||
      (stockFilter === "low" && product.quantity <= 10) ||
      (stockFilter === "out" && product.quantity === 0) ||
      (stockFilter === "available" && product.quantity > 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", className: "bg-red-100 text-red-800 border-red-200" };
    if (quantity <= 10) return { label: "Low Stock", className: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "In Stock", className: "bg-green-100 text-green-800 border-green-200" };
  };
  
  return (
    <div className="academy-container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All categories" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All stock</SelectItem>
              <SelectItem value="available">In stock</SelectItem>
              <SelectItem value="low">Low stock</SelectItem>
              <SelectItem value="out">Out of stock</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm
                categories={categories}
                onSubmit={handleAddProduct}
                isSubmitting={addProductMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Your Products</span>
            <Badge variant="outline">
              {filteredProducts.length} products
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingProducts ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h2 className="mt-4 text-lg font-medium">No products found</h2>
              <p className="mt-1 text-muted-foreground">
                {searchQuery || categoryFilter || stockFilter ? 
                  "Try adjusting your search or filters" : 
                  "Add your first product to start receiving bookings"}
              </p>
              {!searchQuery && !categoryFilter && !stockFilter && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4 btn-primary"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.quantity);
                    
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
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {product.description.substring(0, 60)}
                                {product.description.length > 60 ? '...' : ''}
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
                          <div className="flex flex-col items-end">
                            <Badge variant="outline" className={stockStatus.className}>
                              {stockStatus.label}
                            </Badge>
                            <span className="text-sm mt-1">{product.quantity} units</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex space-x-2 justify-end">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
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
    </div>
  );
};

export default EnterpriseProducts;
