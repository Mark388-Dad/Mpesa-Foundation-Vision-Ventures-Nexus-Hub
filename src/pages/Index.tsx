
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { Category, Product, Enterprise } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Index = () => {
  // Fetch real categories from the database
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['homepage-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
        
      if (error) throw error;
      
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.image_url
      })) as Category[];
    },
    meta: {
      onError: (error: any) => {
        console.error("Error loading categories:", error);
      }
    }
  });
  
  // Fetch featured products from the database
  const { data: featuredProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['homepage-featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, enterprises:enterprise_id(*)')
        .limit(4); // Limit to 4 products for the featured section
        
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
        }
      })) as (Product & { enterprise: Enterprise })[];
    },
    meta: {
      onError: (error: any) => {
        console.error("Error loading featured products:", error);
      }
    }
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-academy-blue to-academy-green text-white py-16">
        <div className="academy-container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mpesa Foundation Academy Enterprise Hub
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Connecting students with student-run enterprises for a seamless booking experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-academy-blue hover:bg-gray-100">
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-academy-blue">
                <Link to="/auth">Login / Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="academy-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-academy-blue/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl text-academy-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-gray-600">
                Explore a variety of products offered by student-run enterprises
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-academy-blue/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl text-academy-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Items</h3>
              <p className="text-gray-600">
                Select quantities and book products with your admission number
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full bg-academy-blue/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-2xl text-academy-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pick Up</h3>
              <p className="text-gray-600">
                Receive confirmation and pick up your booked items
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="academy-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="outline">
              <Link to="/products">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingProducts ? (
              Array(4).fill(0).map((_, index) => (
                <Card key={index} className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Card>
              ))
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <p className="text-muted-foreground">No products available yet</p>
                <Button asChild className="mt-4">
                  <Link to="/auth">Login to add products</Link>
                </Button>
              </div>
            ) : (
              featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  enterpriseName={product.enterprise.name}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="academy-container">
          <h2 className="text-3xl font-bold text-center mb-12">Product Categories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingCategories ? (
              Array(4).fill(0).map((_, index) => (
                <Card key={index} className="h-48 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </Card>
              ))
            ) : categories.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <p className="text-muted-foreground">No categories available yet</p>
              </div>
            ) : (
              categories.map(category => (
                <Link key={category.id} to={`/products?category=${category.id}`}>
                  <Card className="h-full card-hover">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-academy-blue/10 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-academy-blue">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16">
        <div className="academy-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">About MFA Enterprise Hub</h2>
              <p className="text-gray-600 mb-4">
                The Mpesa Foundation Academy Enterprise Hub is a digital platform that connects students
                with student-run enterprises within the academy. Our goal is to provide students with real-world
                business experience while making it easy for the school community to access products and services.
              </p>
              <p className="text-gray-600 mb-6">
                Each enterprise is operated by students who gain valuable entrepreneurial skills
                including inventory management, customer service, and financial literacy, preparing
                them for future success in the business world.
              </p>
              <Button asChild className="btn-primary">
                <Link to="/auth">Join Now</Link>
              </Button>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Our Enterprises</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-academy-blue flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h4 className="font-medium">Snack Shop</h4>
                    <p className="text-sm text-gray-500">Offering a variety of snacks and treats</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-academy-blue flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h4 className="font-medium">Soda Corner</h4>
                    <p className="text-sm text-gray-500">Refreshing drinks for all occasions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-academy-blue flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h4 className="font-medium">Clothing Store</h4>
                    <p className="text-sm text-gray-500">School-approved apparel and accessories</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1 w-6 h-6 rounded-full bg-academy-blue flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <h4 className="font-medium">Crochet Crafts</h4>
                    <p className="text-sm text-gray-500">Handmade items created with skill and care</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
