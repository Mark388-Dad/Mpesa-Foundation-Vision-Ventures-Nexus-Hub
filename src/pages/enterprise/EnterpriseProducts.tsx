
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Table } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const EnterpriseProducts = () => {
  const { profile, user, loading } = useAuth();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has enterprise role
  if (!profile) {
    toast.error("You need to be logged in to access enterprise products");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'enterprise') {
    toast.error("You don't have permission to access enterprise products");
    return <Navigate to="/" />;
  }

  // Use the enterprise ID from the profile if available, otherwise use the user ID
  const enterpriseId = profile.enterpriseId || user?.id;

  // Fetch products for this enterprise
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['enterprise-products', enterpriseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('enterprise_id', enterpriseId);
        
      if (error) throw error;
      return data || [];
    },
    meta: {
      onError: (error: any) => {
        toast.error(`Error loading products: ${error.message}`);
      }
    }
  });

  return (
    <div className="academy-container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enterprise Products</h1>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" /> Add New Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h2 className="mt-4 text-lg font-medium">No products yet</h2>
              <p className="text-muted-foreground mt-2">
                Add your first product to start receiving bookings
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Stock</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="text-left">{product.name}</td>
                      <td className="text-right">KES {product.price}</td>
                      <td className="text-right">{product.quantity}</td>
                      <td className="text-right">
                        <Button variant="outline" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseProducts;
