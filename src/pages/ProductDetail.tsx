
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/components/products/BookingForm";
import { Product, Enterprise, User } from "@/types";
import { formatPrice, formatDate } from "@/utils/helpers";

// Mocked data for demonstration
const mockProduct: Product & { enterprise: Enterprise } = {
  id: "1",
  name: "Chocolate Bar",
  description: "Delicious milk chocolate bar made with premium ingredients. Perfect for a quick snack or dessert. Made with high-quality cocoa and milk.",
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
    logoUrl: undefined,
    ownerId: "123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
};

// Mock user for booking form demonstration
const mockUser: User = {
  id: "user1",
  email: "student@mpesafoundationacademy.ac.ke",
  username: "student123",
  admissionNumber: "MFA12345",
  role: "student",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<(Product & { enterprise: Enterprise }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate authentication state
  const [isAuthenticated] = useState(true);
  const [user] = useState<User>(mockUser);
  
  // Fetch product details
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      if (id === mockProduct.id) {
        setProduct(mockProduct);
        setLoading(false);
      } else {
        setError("Product not found");
        setLoading(false);
      }
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="academy-container py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
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
                <BookingForm 
                  product={product} 
                  user={isAuthenticated ? user : undefined}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products Section (placeholder) */}
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
