
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const EnterpriseFeedback = () => {
  const { profile, loading } = useAuth();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has enterprise role
  if (!profile || profile.role !== 'enterprise') {
    toast.error("You don't have permission to access enterprise feedback");
    return <Navigate to="/" />;
  }

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Customer Feedback</h1>
      <p className="text-muted-foreground">
        Track and manage customer feedback about your products.
      </p>
    </div>
  );
};

export default EnterpriseFeedback;
