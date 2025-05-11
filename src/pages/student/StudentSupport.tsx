
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const StudentSupport = () => {
  const { profile, loading } = useAuth();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has student role
  if (!profile) {
    toast.error("You need to be logged in to access support");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'student') {
    toast.error("You don't have permission to access student support");
    return <Navigate to="/" />;
  }

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Support</h1>
      <p className="text-muted-foreground">
        Get help with any questions or issues you may have.
      </p>
    </div>
  );
};

export default StudentSupport;
