
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BookingFormProps {
  product: Product;
}

export function BookingForm({ product }: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: {
      productId: string;
      studentId: string;
      quantity: number;
      status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    }) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Booking successful! You will receive an email confirmation shortly.");
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setQuantity(1);
    },
    onError: (error: any) => {
      toast.error(`Booking failed: ${error.message}`);
    }
  });

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
    
    if (!user || !profile) {
      toast.error("Please login to book this product");
      navigate("/auth");
      return;
    }
    
    if (product.quantity < quantity) {
      toast.error(`Only ${product.quantity} items available`);
      return;
    }
    
    // Check if user is a student
    if (profile.role !== 'student') {
      toast.error("Only students can book products");
      return;
    }
    
    bookingMutation.mutate({
      productId: product.id,
      studentId: user.id,
      quantity: quantity,
      status: 'pending'
    });
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
        disabled={bookingMutation.isPending || product.quantity === 0 || !user}
      >
        {bookingMutation.isPending ? "Processing..." : "Book Now"}
      </Button>
      
      {!user && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Please <a href="/auth" className="text-academy-blue hover:underline">login</a> to book this product
        </p>
      )}
    </form>
  );
}
