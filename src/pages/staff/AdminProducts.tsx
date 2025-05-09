
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Product, Enterprise } from "@/types";
import { Search, Filter, Package, MoreVertical, AlertCircle, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const AdminProducts = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [enterpriseFilter, setEnterpriseFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, enterprises:enterprise_id(*)');
        
      if (error) throw error;
      
      return (data || []).map((product: any) => ({
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
        enterprise: {
          id: product.enterprises.id,
          name: product.enterprises.name,
          description: product.enterprises.description,
          logoUrl: product.enterprises.logo_url,
          ownerId: product.enterprises.owner_id,
          createdAt: product.enterprises.created_at,
          updatedAt: product.enterprises.updated_at
        }
      })) as (Product & { enterprise: Enterprise })[];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });
  
  const { data: enterprises = [] } = useQuery({
    queryKey: ['enterprises-for-filter'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprises')
        .select('id, name');
        
      if (error) throw error;
      
      return data || [];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading enterprises: ${error.message}`);
      }
    }
  });
  
  // Filter products based on search query and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.enterprise.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEnterprise = enterpriseFilter === "" || product.enterpriseId === enterpriseFilter;
    
    const matchesStock = stockFilter === "" ||
      (stockFilter === "low" && product.quantity <= 10) ||
      (stockFilter === "out" && product.quantity === 0) ||
      (stockFilter === "available" && product.quantity > 0);
    
    return matchesSearch && matchesEnterprise && matchesStock;
  });
  
  const handleApproveProduct = (productId: string) => {
    toast.success("Product approved successfully");
    // In a real app, you would update the product status in the database
  };
  
  const handleRejectProduct = (productId: string) => {
    toast.success("Product rejected");
    // In a real app, you would update the product status in the database
  };
  
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
          
          <Select value={enterpriseFilter} onValueChange={setEnterpriseFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All enterprises" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All enterprises</SelectItem>
              {enterprises.map((enterprise: any) => (
                <SelectItem key={enterprise.id} value={enterprise.id}>
                  {enterprise.name}
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
          
          <Button variant="outline" className="flex items-center">
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Products</span>
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
                {searchQuery || enterpriseFilter || stockFilter ? 
                  "Try adjusting your search or filters" : 
                  "No products have been added yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Enterprise</th>
                    <th className="py-3 px-4 text-center">Price</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.quantity);
                    
                    return (
                      <tr key={product.id} className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
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
                        </td>
                        <td className="py-4 px-4">
                          <span>{product.enterprise.name}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span>KES {product.price}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <Badge variant="outline" className={stockStatus.className}>
                              {stockStatus.label}
                            </Badge>
                            <span className="text-sm mt-1">{product.quantity} units</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveProduct(product.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectProduct(product.id)}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Product</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete Product</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

export default AdminProducts;
