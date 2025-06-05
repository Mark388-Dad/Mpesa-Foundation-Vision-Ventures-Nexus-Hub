import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/ProductCard";
import { EnterpriseCategory, Product, Enterprise } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['enterprise-category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*')
        .eq('id', categoryId)
        .single();
        
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        imageUrl: data.image_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as EnterpriseCategory;
    }
  });

  const { data: enterprises = [], isLoading: isEnterprisesLoading } = useQuery({
    queryKey: ['enterprises-by-category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprises')
        .select('*')
        .eq('category_id', categoryId);
        
      if (error) throw error;
      return data.map((enterprise: any) => ({
        id: enterprise.id,
        name: enterprise.name,
        description: enterprise.description,
        logoUrl: enterprise.logo_url,
        ownerId: enterprise.owner_id,
        categoryId: enterprise.category_id,
        createdAt: enterprise.created_at,
        updatedAt: enterprise.updated_at
      })) as Enterprise[];
    }
  });

  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ['products-by-category', categoryId],
    queryFn: async () => {
      if (enterprises.length === 0) return [];
      
      const enterpriseIds = enterprises.map(e => e.id);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          enterprises:enterprise_id(*)
        `)
        .in('enterprise_id', enterpriseIds);
        
      if (error) throw error;
      
      return (data || []).map((product: any) => ({
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
        enterprise: {
          id: product.enterprises.id,
          name: product.enterprises.name,
          description: product.enterprises.description,
          logoUrl: product.enterprises.logo_url,
          ownerId: product.enterprises.owner_id,
          categoryId: product.enterprises.category_id,
          createdAt: product.enterprises.created_at,
          updatedAt: product.enterprises.updated_at
        }
      })) as (Product & { enterprise: Enterprise })[];
    },
    enabled: enterprises.length > 0
  });

  if (isCategoryLoading) {
    return (
      <div className="academy-container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="academy-container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="academy-container py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-academy-blue hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="text-5xl"
            style={{ color: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground text-lg">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            style={{ borderColor: category.color, color: category.color }}
          >
            {enterprises.length} {enterprises.length === 1 ? 'Enterprise' : 'Enterprises'}
          </Badge>
          <Badge 
            variant="outline"
            style={{ borderColor: category.color, color: category.color }}
          >
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </Badge>
        </div>
      </div>

      {/* Enterprises Section */}
      {enterprises.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Enterprises in this Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enterprises.map((enterprise) => (
              <Card key={enterprise.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{enterprise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {enterprise.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        
        {isProductsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4" style={{ color: category.color }}>
              {category.icon}
            </div>
            <h3 className="text-lg font-medium mb-2">No Products Available</h3>
            <p className="text-muted-foreground">
              No products have been added to this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                enterpriseName={product.enterprise.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
