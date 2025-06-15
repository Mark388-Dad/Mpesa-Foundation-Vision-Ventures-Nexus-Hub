
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { UserRole } from "@/types";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  username?: string;
  fullName?: string;
  admissionNumber?: string;
  phoneNumber?: string;
  enterpriseId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // Helper function to map database profile to UserProfile interface
  const mapDatabaseProfile = (data: any): UserProfile => ({
    id: data.id,
    email: data.email,
    role: data.role,
    username: data.username,
    fullName: data.full_name,
    admissionNumber: data.admission_number,
    phoneNumber: data.phone_number,
    enterpriseId: data.enterprise_id,
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  });
  
  // Function to fetch profile data
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        // Create basic profile from auth user if profile doesn't exist
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          const userData = currentUser.user_metadata || {};
          const basicProfile: UserProfile = {
            id: currentUser.id,
            email: currentUser.email || '',
            role: userData.role || 'student',
            username: userData.username || currentUser.email?.split('@')[0],
            fullName: userData.fullName || '',
            admissionNumber: userData.admissionNumber,
            phoneNumber: userData.phoneNumber,
            enterpriseId: userData.enterpriseId,
            avatarUrl: userData.avatarUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setProfile(basicProfile);
        }
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(mapDatabaseProfile(data));
      }
    } catch (err) {
      console.error("Error in profile fetch:", err);
    }
  };
  
  useEffect(() => {
    console.log('Setting up auth state subscription');
    
    // Get initial session first
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session:', initialSession?.user?.id);
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
      }
    };
    
    // Set up auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        // Only set loading to false after initial load
        if (event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      console.log('Sign in successful, user:', data.user?.id);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(`Error signing in: ${error.message}`);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      if (error) throw error;
      toast.success("Registration successful! Please check your email for verification.");
    } catch (error: any) {
      toast.error(`Error during registration: ${error.message}`);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast.success("Successfully signed out!");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
