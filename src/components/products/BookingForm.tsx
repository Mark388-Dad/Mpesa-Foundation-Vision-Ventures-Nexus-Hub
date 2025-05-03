
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Product, User } from "@/types";
import { formatPrice } from "@/utils/helpers";

interface BookingFormProps {
  product: Product;
  user?: User;
}

export function BookingForm({ product, user }: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > product.quantity) {
      setQuantity(product.quantity);
    } else {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to book this product",
        variant: "destructive",
      });
      return;
    }
    
    if (product.quantity < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.quantity} items available`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Connect with Supabase here to create booking
      // For now, we'll just simulate a successful booking
      
      setTimeout(() => {
        toast({
          title: "Booking Successful",
          description: "You will receive an email confirmation shortly",
        });
        setQuantity(1);
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="quantity" className="text-base">Quantity</Label>
        <div className="flex items-center mt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            -
          </Button>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={product.quantity}
            className="h-10 w-20 mx-2 text-center"
            disabled={product.quantity === 0}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.quantity}
            className="h-10 w-10"
          >
            +
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total Price:
        </span>
        <span className="text-xl font-bold text-academy-blue">
          {formatPrice(product.price * quantity)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Available Stock:
        </span>
        <span className={`font-medium ${product.quantity > 10 ? 'text-academy-green' : product.quantity > 0 ? 'text-academy-amber' : 'text-destructive'}`}>
          {product.quantity > 0 ? `${product.quantity} items` : "Out of Stock"}
        </span>
      </div>
      
      <Button 
        type="submit"
        className="w-full btn-primary"
        disabled={isSubmitting || product.quantity === 0 || !user}
      >
        {isSubmitting ? "Processing..." : "Book Now"}
      </Button>
      
      {!user && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Please <a href="/auth" className="text-academy-blue hover:underline">login</a> to book this product
        </p>
      )}
    </form>
  );
}
