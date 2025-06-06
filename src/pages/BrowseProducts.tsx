
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const BrowseProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch categories from enterprise_categories table
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['enterprise-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.image_url
      }));
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading categories: ${error.message}`);
      }
    }
  });
  
  // Fetch products with enterprise info
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['browse-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          enterprises:enterprise_id(
            id,
            name,
            description,
            logo_url
          ),
          enterprise_categories:category_id(
            id,
            name,
            description
          )
        `)
        .gt('quantity', 0); // Only show products in stock
        
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
        enterprise: product.enterprises ? {
          id: product.enterprises.id,
          name: product.enterprises.name,
          description: product.enterprises.description,
          logoUrl: product.enterprises.logo_url,
          ownerId: '',
          createdAt: '',
          updatedAt: ''
        } : null
      }));
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });
  
  const handleSearch = () => {
    // Search functionality is handled by filtering below
  };
  
  const handleCategoryChange = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.enterprise?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(product.categoryId);
      
    return matchesSearch && matchesCategory;
  });
  
  const isLoading = loadingProducts || loadingCategories;
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Products</h1>
          <p className="text-muted-foreground mt-2">
            Discover amazing products from student-run enterprises
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex mb-8">
          <div className="relative flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button className="ml-2 btn-primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar with Filters */}
          <div className="md:col-span-1">
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              isLoading={loadingCategories}
            />
          </div>
          
          {/* Product Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-muted-foreground">
                    Showing {filteredProducts.length} products
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      enterpriseName={product.enterprise?.name}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseProducts;
