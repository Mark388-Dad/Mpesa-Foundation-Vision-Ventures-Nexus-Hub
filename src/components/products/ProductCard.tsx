
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";
import { BookingForm } from "@/components/products/BookingForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  enterpriseName?: string;
}

export function ProductCard({ product, enterpriseName }: ProductCardProps) {
  const { profile } = useAuth();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  
  // Check if user is an enterprise member that owns this product
  const isProductOwner = profile?.role === 'enterprise' && 
                         profile?.enterpriseId === product.enterpriseId;
  
  // Only enterprise members should see product details like price
  const canSeeProductDetails = profile?.role === 'enterprise';

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {enterpriseName && (
          <Badge className="absolute top-2 left-2 bg-academy-blue">
            {enterpriseName}
          </Badge>
        )}
        
        {/* Only show stock status to product owners with exact number */}
        {isProductOwner ? (
          <Badge 
            variant="outline"
            className={`absolute top-2 right-2 ${
              product.quantity > 0 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-red-100 text-red-800 border-red-200"
            }`}
          >
            {product.quantity} in stock
          </Badge>
        ) : product.quantity > 0 ? (
          <Badge 
            variant="outline"
            className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-200"
          >
            In stock
          </Badge>
        ) : (
          <Badge 
            variant="outline"
            className="absolute top-2 right-2 bg-red-100 text-red-800 border-red-200"
          >
            Out of stock
          </Badge>
        )}
      </div>

      {/* Quick Booking Button - Under the image */}
      <div className="p-2">
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full btn-primary" 
              size="sm"
              disabled={product.quantity === 0 || isProductOwner}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isProductOwner ? "Your Product" : product.quantity === 0 ? "Out of Stock" : "Book Now"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book {product.name}</DialogTitle>
            </DialogHeader>
            <BookingForm product={product} />
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="p-4 pt-2">
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {product.description}
        </p>
        
        {/* Only show price to enterprise members */}
        {canSeeProductDetails && (
          <div className="mt-2 font-bold text-academy-blue">
            {formatPrice(product.price)}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
