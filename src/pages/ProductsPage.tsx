
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { Product, Category, Enterprise } from "@/types";
import { Search } from "lucide-react";

// Mock data for demonstration
const mockProducts: (Product & { enterprise: Enterprise })[] = [
  {
    id: "1",
    name: "Chocolate Bar",
    description: "Delicious milk chocolate bar made with premium ingredients.",
    price: 50,
    quantity: 20,
    imageUrl: undefined,
    enterpriseId: "1",
    categoryId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "1",
      name: "Snack Shop",
      description: "All your favorite snacks in one place",
      ownerId: "123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "2",
    name: "Coca-Cola Can",
    description: "Refreshing soda drink, perfectly chilled.",
    price: 60,
    quantity: 35,
    imageUrl: undefined,
    enterpriseId: "2",
    categoryId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "2",
      name: "Soda Corner",
      description: "Refreshing drinks for everyone",
      ownerId: "124",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "3",
    name: "School T-Shirt",
    description: "Comfortable cotton t-shirt with school logo.",
    price: 350,
    quantity: 10,
    imageUrl: undefined,
    enterpriseId: "3",
    categoryId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "3",
      name: "Clothing Store",
      description: "Quality clothing for students",
      ownerId: "125",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "4",
    name: "Crochet Pencil Holder",
    description: "Handmade crochet pencil holder, perfect for your desk.",
    price: 120,
    quantity: 5,
    imageUrl: undefined,
    enterpriseId: "4",
    categoryId: "4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "4",
      name: "Crochet Crafts",
      description: "Handmade crochet items made with love",
      ownerId: "126",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "5",
    name: "Potato Chips",
    description: "Crunchy potato chips in various flavors.",
    price: 30,
    quantity: 40,
    imageUrl: undefined,
    enterpriseId: "1",
    categoryId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "1",
      name: "Snack Shop",
      description: "All your favorite snacks in one place",
      ownerId: "123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "6",
    name: "Sprite Can",
    description: "Refreshing lemon-lime soda.",
    price: 60,
    quantity: 25,
    imageUrl: undefined,
    enterpriseId: "2",
    categoryId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "2",
      name: "Soda Corner",
      description: "Refreshing drinks for everyone",
      ownerId: "124",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "7",
    name: "School Hoodie",
    description: "Warm hoodie with school emblem.",
    price: 700,
    quantity: 8,
    imageUrl: undefined,
    enterpriseId: "3",
    categoryId: "3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "3",
      name: "Clothing Store",
      description: "Quality clothing for students",
      ownerId: "125",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
  {
    id: "8",
    name: "Crochet Scarf",
    description: "Handmade soft scarf for cold days.",
    price: 250,
    quantity: 3,
    imageUrl: undefined,
    enterpriseId: "4",
    categoryId: "4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enterprise: {
      id: "4",
      name: "Crochet Crafts",
      description: "Handmade crochet items made with love",
      ownerId: "126",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
];

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Snacks",
    description: "Delicious treats to satisfy your cravings"
  },
  {
    id: "2",
    name: "Drinks",
    description: "Refreshing beverages for every occasion"
  },
  {
    id: "3",
    name: "Clothing",
    description: "Comfortable and stylish apparel"
  },
  {
    id: "4",
    name: "Crafts",
    description: "Handmade items created with skill and passion"
  },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<(Product & { enterprise: Enterprise })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Initialize state from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
    
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
    
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, [searchParams]);
  
  const handleSearch = () => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...currentParams,
      search: searchQuery
    });
  };
  
  const handleCategoryChange = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
    const currentParams = Object.fromEntries(searchParams.entries());
    
    if (categoryIds.length === 0) {
      const { category, ...rest } = currentParams;
      setSearchParams(rest);
    } else {
      setSearchParams({
        ...currentParams,
        category: categoryIds.join(",")
      });
    }
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.enterprise.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(product.categoryId);
      
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="py-8">
      <div className="academy-container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Browse and book products from student-run enterprises
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
              categories={mockCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          {/* Product Grid */}
          <div className="md:col-span-3">
            {loading ? (
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
                    setSearchParams({});
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
                      enterpriseName={product.enterprise.name}
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

export default ProductsPage;
