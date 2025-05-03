
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product, Enterprise } from "@/types";
import { formatPrice, truncateText } from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
  enterprise?: Enterprise;
}

export function ProductCard({ product, enterprise }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`}>
      <Card className="h-full overflow-hidden card-hover">
        <div className="aspect-square w-full relative overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-all"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {product.quantity <= 5 && product.quantity > 0 && (
            <Badge className="absolute top-2 right-2 bg-academy-amber">
              Low Stock
            </Badge>
          )}
          
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">
                Sold Out
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {truncateText(product.description, 60)}
          </p>
          
          {enterprise && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {enterprise.name}
              </Badge>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="font-bold text-academy-blue">
            {formatPrice(product.price)}
          </span>
          
          {product.quantity > 0 ? (
            <Badge className="bg-academy-green">Available</Badge>
          ) : (
            <Badge variant="outline" className="text-destructive border-destructive">
              Out of Stock
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
