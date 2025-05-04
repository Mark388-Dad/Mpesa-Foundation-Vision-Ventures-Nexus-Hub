import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthFormData, UserRole } from "@/types";
import { isValidAcademyEmail } from "@/utils/helpers";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultFormData: AuthFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  admissionNumber: "",
  fullName: "",
  phoneNumber: "",
  role: "student"
};

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const { data: enterprises = [] } = useQuery({
    queryKey: ['enterprises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprises')
        .select('id, name');
        
      if (error) {
        toast.error(`Error fetching enterprises: ${error.message}`);
        throw error;
      }
      
      return data || [];
    },
    enabled: !isLogin && formData.role === 'enterprise'
  });

  const handleTabChange = (value: string) => {
    setIsLogin(value === "login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      role: value as UserRole 
    }));
  };

  const handleEnterpriseChange = (value: string) => {
    setFormData((prev) => ({ ...prev, enterpriseId: value }));
  };

  const validateForm = () => {
    // Client-side validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!isValidAcademyEmail(formData.email)) {
      toast.error("Please use your Mpesa Foundation Academy email");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return false;
    }

    // Role specific validation
    if (!isLogin) {
      if (formData.role === "student" && !formData.admissionNumber) {
        toast.error("Please enter your admission number");
        return false;
      }

      if (formData.role === "enterprise" && !formData.enterpriseId) {
        toast.error("Please select your enterprise");
        return false;
      }

      if (formData.role === "staff" && !formData.phoneNumber) {
        toast.error("Please enter your phone number");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        // Prepare user metadata for Supabase Auth
        const userData = {
          role: formData.role,
          username: formData.username,
          fullName: formData.fullName,
          admissionNumber: formData.admissionNumber,
          phoneNumber: formData.phoneNumber,
          enterpriseId: formData.enterpriseId
        };
        
        await signUp(formData.email, formData.password, userData);
        setFormData(defaultFormData);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Sign in to the Mpesa Foundation Academy Hub" 
              : "Join the Mpesa Foundation Academy Enterprise Hub"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="your.name@mpesafoundationacademy.ac.ke"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="role">I am a</Label>
                    <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="enterprise">Enterprise Member</SelectItem>
                          <SelectItem value="staff">Staff Head</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.role === "student" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="admissionNumber">Admission Number</Label>
                        <Input
                          id="admissionNumber"
                          name="admissionNumber"
                          placeholder="MFA123456"
                          value={formData.admissionNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {formData.role === "enterprise" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="admissionNumber">Admission Number</Label>
                        <Input
                          id="admissionNumber"
                          name="admissionNumber"
                          placeholder="MFA123456"
                          value={formData.admissionNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="enterprise">Enterprise</Label>
                        <Select onValueChange={handleEnterpriseChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your enterprise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {enterprises.map(enterprise => (
                                <SelectItem key={enterprise.id} value={enterprise.id}>
                                  {enterprise.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  {formData.role === "staff" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="+254700000000"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}
                </>
              )}
              
              <Button 
                type="submit"
                className="w-full btn-primary mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    Processing...
                  </span>
                ) : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground text-center">
            {isLogin ? (
              <span>Don't have an account? Register to get started</span>
            ) : (
              <span>Already have an account? Log in to continue</span>
            )}
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
