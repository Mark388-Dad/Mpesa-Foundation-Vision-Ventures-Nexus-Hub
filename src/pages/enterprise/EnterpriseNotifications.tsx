
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const EnterpriseNotifications = () => {
  const { profile, loading } = useAuth();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has enterprise role
  if (!profile || profile.role !== 'enterprise') {
    toast.error("You don't have permission to access enterprise notifications");
    return <Navigate to="/" />;
  }

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <p className="text-muted-foreground mb-6">
        View and manage your notifications about bookings, product updates, and other alerts.
      </p>
      
      <div className="flex justify-center">
        <NotificationCenter />
      </div>
    </div>
  );
};

export default EnterpriseNotifications;
