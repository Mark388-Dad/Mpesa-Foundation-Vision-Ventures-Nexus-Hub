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
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface BookingFormProps {
  product: Product;
}

export function BookingForm({ product }: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Check if the user is trying to book their own product
  const isOwnProduct = profile?.role === 'enterprise' && profile?.enterpriseId === product.enterpriseId;
  
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: {
      product_id: string;
      student_id: string;
      quantity: number;
      status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    }) => {
      console.log('Creating booking with data:', bookingData);
      
      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
        
      if (bookingError) {
        console.error('Booking creation error:', bookingError);
        throw bookingError;
      }

      console.log('Booking created successfully:', booking);

      // Send email notification using Resend edge function
      try {
        console.log('Sending email notification via Resend for booking:', booking.id);
        
        if (profile?.email && profile?.fullName) {
          const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-booking-email', {
            body: {
              to: profile.email,
              subject: `Booking Created - ${product.name}`,
              studentName: profile.fullName,
              productName: product.name,
              quantity: bookingData.quantity,
              totalPrice: formatPrice(product.price * bookingData.quantity),
              status: bookingData.status,
              bookingId: booking.id,
            }
          });
          
          if (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the booking if email fails
          } else {
            console.log('Email notification sent successfully via Resend:', emailResult);
          }
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the booking if email fails
      }
        
      return booking;
    },
    onSuccess: () => {
      toast.success("Booking successful! You will receive an email confirmation shortly.");
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setQuantity(1);
    },
    onError: (error: any) => {
      console.error('Booking mutation error:', error);
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
    
    console.log('Starting booking submission');
    console.log('User:', user);
    console.log('Profile:', profile);
    
    if (!user || !profile) {
      toast.error("Please login to book this product");
      navigate("/auth");
      return;
    }
    
    if (product.quantity < quantity) {
      toast.error(`Only ${product.quantity} items available`);
      return;
    }
    
    // Prevent enterprise members from booking their own products
    if (isOwnProduct) {
      toast.error("You cannot book your own enterprise's products");
      return;
    }
    
    console.log('Submitting booking mutation');
    bookingMutation.mutate({
      product_id: product.id,
      student_id: user.id,
      quantity: quantity,
      status: 'pending'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isOwnProduct && (
        <Alert className="bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>This is your enterprise's product</AlertTitle>
          <AlertDescription>
            You cannot book products from your own enterprise.
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="quantity" className="text-base">Quantity</Label>
        <div className="flex items-center mt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isOwnProduct}
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
            disabled={product.quantity === 0 || isOwnProduct}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.quantity || isOwnProduct}
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
        disabled={bookingMutation.isPending || product.quantity === 0 || !user || isOwnProduct}
      >
        {bookingMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Processing...
          </>
        ) : (
          "Book Now"
        )}
      </Button>
      
      {!user && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          Please <a href="/auth" className="text-academy-blue hover:underline">login</a> to book this product
        </p>
      )}
    </form>
  );
}
