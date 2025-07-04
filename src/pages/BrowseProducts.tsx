
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Product, Enterprise, Category } from "@/types";
import { Search, Package, TrendingUp, Star } from "lucide-react";

const BrowseProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch products with enterprise and category data
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['browse-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          enterprises!inner(*),
          enterprise_categories!inner(*)
        `)
        .gt('quantity', 0)
        .order('created_at', { ascending: false });
        
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
        enterprise: {
          id: product.enterprises.id,
          name: product.enterprises.name,
          description: product.enterprises.description,
          logoUrl: product.enterprises.logo_url,
          ownerId: product.enterprises.owner_id,
          createdAt: product.enterprises.created_at,
          updatedAt: product.enterprises.updated_at
        },
        category: {
          id: product.enterprise_categories.id,
          name: product.enterprise_categories.name,
          description: product.enterprise_categories.description,
          imageUrl: product.enterprise_categories.image_url
        }
      })) as (Product & { enterprise: Enterprise, category: Category })[];
    }
  });

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.enterprise.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get featured products (newest)
  const featuredProducts = products.slice(0, 8);
  
  // Get popular products (simulate popularity)
  const popularProducts = products.filter(p => p.quantity < 50).slice(0, 8);

  return (
    <div className="academy-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
        <p className="text-muted-foreground">
          Explore all products available from our academy enterprises
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products, enterprises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Products Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            All Products
            <Badge variant="secondary">{filteredProducts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Featured
            <Badge variant="secondary">{featuredProducts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular
            <Badge variant="secondary">{popularProducts.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your search or filter criteria"
                  : "No products are currently available"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Star className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mb-2">No featured products yet</h3>
              <p className="text-muted-foreground">Check back soon for featured products</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          {popularProducts.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mb-2">No popular products yet</h3>
              <p className="text-muted-foreground">Popular products will appear here based on demand</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrowseProducts;
