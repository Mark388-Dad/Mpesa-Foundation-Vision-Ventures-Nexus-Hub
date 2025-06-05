import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Package, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const StudentReviews = () => {
  const { profile, loading } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has student role
  if (!profile) {
    toast.error("You need to be logged in to access reviews");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'student') {
    toast.error("You don't have permission to access student reviews");
    return <Navigate to="/" />;
  }

  // Get completed bookings that can be reviewed
  const { data: reviewableBookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['reviewable-bookings', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products(*,
            enterprises(*)
          )
        `)
        .eq('student_id', profile.id)
        .eq('status', 'completed');
        
      if (error) throw error;
      return data || [];
    }
  });

  // Get existing reviews
  const { data: existingReviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ['student-reviews', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          products(*),
          enterprises(*)
        `)
        .eq('student_id', profile.id);
        
      if (error) throw error;
      return data || [];
    }
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ bookingId, productId, enterpriseId, rating, comment }: any) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          student_id: profile.id,
          product_id: productId,
          enterprise_id: enterpriseId,
          rating,
          comment
        });
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setSelectedBooking(null);
      setRating(5);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['student-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewable-bookings'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to submit review: ${error.message}`);
    }
  });

  const handleSubmitReview = () => {
    if (!selectedBooking) return;
    
    submitReviewMutation.mutate({
      bookingId: selectedBooking.id,
      productId: selectedBooking.products.id,
      enterpriseId: selectedBooking.products.enterprises.id,
      rating,
      comment
    });
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < currentRating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer' : ''}`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  // Filter out bookings that already have reviews
  const reviewedBookingIds = existingReviews.map(review => review.booking_id);
  const unreviewedBookings = reviewableBookings.filter(
    booking => !reviewedBookingIds.includes(booking.id)
  );

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      
      {/* Pending Reviews */}
      {unreviewedBookings.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unreviewedBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {booking.products.image_url ? (
                        <img 
                          src={booking.products.image_url} 
                          alt={booking.products.name}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{booking.products.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        From {booking.products.enterprises.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Completed on {new Date(booking.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => setSelectedBooking(booking)}
                        className="btn-primary"
                      >
                        Write Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review {booking.products.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Rating</label>
                          <div className="flex gap-1">
                            {renderStars(rating, true)}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Comment</label>
                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSubmitReview}
                            disabled={submitReviewMutation.isPending}
                            className="btn-primary"
                          >
                            {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading reviews...</p>
            </div>
          ) : existingReviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mt-4">No reviews yet</h3>
              <p className="text-muted-foreground">
                Complete some bookings to start leaving reviews
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {existingReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {review.products.image_url ? (
                        <img 
                          src={review.products.image_url} 
                          alt={review.products.name}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{review.products.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            From {review.enterprises.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-1 mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentReviews;
