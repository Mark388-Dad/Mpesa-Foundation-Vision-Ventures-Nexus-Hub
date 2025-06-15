
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, MapPin } from "lucide-react";

const EnterpriseReservations = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }

  if (!profile || profile.role !== 'enterprise') {
    return <Navigate to="/auth" />;
  }

  // Fetch enterprise bookings
  const { data: reservations = [] } = useQuery({
    queryKey: ['enterprise-reservations', profile.enterpriseId],
    queryFn: async () => {
      if (!profile.enterpriseId) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products!inner(
            name,
            description,
            enterprise_id
          )
        `)
        .eq('products.enterprise_id', profile.enterpriseId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile.enterpriseId
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="academy-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Reservations</h1>
        <p className="text-muted-foreground">Manage your facility bookings and reservations</p>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reservations yet</h3>
            <p className="text-muted-foreground mb-4">
              Your facility bookings and reservations will appear here.
            </p>
            <Button asChild>
              <a href="/booking">Book Facilities</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reservation.products?.name}</CardTitle>
                    <p className="text-muted-foreground">{reservation.products?.description}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Booked: {new Date(reservation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Quantity: {reservation.quantity}</span>
                  </div>
                  {reservation.pickup_code && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Code: {reservation.pickup_code}</span>
                    </div>
                  )}
                </div>
                {reservation.pickup_time && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Pickup Time: {new Date(reservation.pickup_time).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnterpriseReservations;
