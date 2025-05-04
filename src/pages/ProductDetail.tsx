
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/components/products/BookingForm";
import { Product, Enterprise } from "@/types";
import { formatPrice, formatDate } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: productWithEnterprise, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      
      // First get the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (productError) throw productError;
      if (!product) throw new Error("Product not found");
      
      // Then get the enterprise
      const { data: enterprise, error: enterpriseError } = await supabase
        .from('enterprises')
        .select('*')
        .eq('id', product.enterprise_id)
        .single();
        
      if (enterpriseError) throw enterpriseError;
      
      return {
        ...product,
        enterprise
      } as Product & { enterprise: Enterprise };
    },
    onError: (error: any) => {
      toast.error(`Error loading product: ${error.message}`);
    }
  });
  
  if (isLoading) {
    return (
      <div className="academy-container py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !productWithEnterprise) {
    return (
      <div className="academy-container py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const product = productWithEnterprise;
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">•</li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </li>
              <li className="text-muted-foreground">•</li>
              <li>{product.name}</li>
            </ol>
          </nav>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg flex items-center justify-center aspect-square overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">No image available</span>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <Badge className="bg-academy-blue">
                  {product.enterprise.name}
                </Badge>
                {product.quantity > 0 ? (
                  <Badge variant="outline" className="ml-2 text-academy-green border-academy-green">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 text-destructive border-destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold text-academy-blue">
                {formatPrice(product.price)}
              </p>
            </div>
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="booking">Booking</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Enterprise</h3>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                      {product.enterprise.logoUrl ? (
                        <img 
                          src={product.enterprise.logoUrl} 
                          alt={product.enterprise.name} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="font-bold">
                          {product.enterprise.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.enterprise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.enterprise.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Additional Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Available Quantity</span>
                      <span>{product.quantity}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{formatDate(product.updatedAt)}</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="booking">
                <BookingForm product={product} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <p className="text-muted-foreground text-center py-12">
            Related products will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
