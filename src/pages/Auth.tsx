
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { profile, loading } = useAuth();
  
  // If user is already logged in, redirect to home
  if (profile && !loading) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="academy-container">
        <div className="max-w-md mx-auto">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;
