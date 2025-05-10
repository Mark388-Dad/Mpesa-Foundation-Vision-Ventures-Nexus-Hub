
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, Enterprise, Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingForm } from "@/components/products/BookingForm";
import { formatPrice } from "@/utils/helpers";
import { Loader2, Package, Calendar, Tag, Building2 } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id(*),
          enterprises:enterprise_id(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error("Product not found");
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        imageUrl: data.image_url,
        enterpriseId: data.enterprise_id,
        categoryId: data.category_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        enterprise: {
          id: data.enterprises.id,
          name: data.enterprises.name,
          description: data.enterprises.description,
          logoUrl: data.enterprises.logo_url,
          ownerId: data.enterprises.owner_id,
          createdAt: data.enterprises.created_at,
          updatedAt: data.enterprises.updated_at
        },
        category: {
          id: data.categories.id,
          name: data.categories.name,
          description: data.categories.description,
          imageUrl: data.categories.image_url
        }
      } as (Product & { enterprise: Enterprise, category: Category });
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading product: ${error.message}`);
      }
    }
  });

  if (isLoading) {
    return (
      <div className="academy-container py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-academy-blue mb-4" />
        <p className="text-muted-foreground">Loading product details...</p>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="academy-container py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Determine if the current user is allowed to view pricing details
  // (both students and enterprise members can see prices)
  const canSeeProductDetails = 
    profile?.role === 'enterprise' || 
    profile?.role === 'student' || 
    profile?.role === 'staff';

  return (
    <div className="academy-container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          {product.imageUrl ? (
            <div className="aspect-square rounded-lg overflow-hidden border">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center border">
              <Package className="h-16 w-16 text-muted-foreground opacity-40" />
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge className="bg-academy-blue">{product.enterprise.name}</Badge>
              {product.category && (
                <Badge variant="outline" className="border-academy-green text-academy-green">
                  {product.category.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {canSeeProductDetails && (
              <div className="mt-2 text-2xl font-bold text-academy-blue">
                {formatPrice(product.price)}
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Product Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
            
            {/* Additional Details */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Building2 className="h-4 w-4 mr-2 text-academy-blue" />
                <span className="text-muted-foreground">Enterprise:</span>
                <span className="ml-1 font-medium">{product.enterprise.name}</span>
              </div>
              
              {product.category && (
                <div className="flex items-center text-sm">
                  <Tag className="h-4 w-4 mr-2 text-academy-green" />
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-1 font-medium">{product.category.name}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-academy-amber" />
                <span className="text-muted-foreground">Added:</span>
                <span className="ml-1 font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Booking Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Book This Product</h2>
            <BookingForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
