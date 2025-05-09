
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Building2, Upload, Loader2, Users, ShieldAlert, Mail } from "lucide-react";

const EnterpriseSettings = () => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [enterpriseData, setEnterpriseData] = useState({
    name: "Tech Hub",
    description: "The best technology products for students",
    contactEmail: "tech.hub@mfa.edu",
    bookingNotifications: true,
    productApprovalRequired: true,
    allowStudentReviews: true,
    autoConfirmBookings: false
  });
  
  // Sample team members
  const teamMembers = [
    { id: "1", name: "John Smith", role: "Manager", email: "john.smith@mfa.edu" },
    { id: "2", name: "Sarah Johnson", role: "Sales", email: "sarah.j@mfa.edu" },
    { id: "3", name: "Michael Brown", role: "Inventory", email: "m.brown@mfa.edu" }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnterpriseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggle = (key: keyof typeof enterpriseData) => {
    setEnterpriseData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveGeneral = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If a logo was uploaded, store it
      if (logoFile) {
        // In a real app, you would upload the logo to storage
        console.log("Logo would be uploaded:", logoFile.name);
      }
      
      toast.success("Enterprise settings saved successfully");
    } catch (error: any) {
      toast.error(`Error saving settings: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveMember = (memberId: string) => {
    toast.success("Team member removed");
    // In a real app, you would update the database
  };
  
  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Enterprise Settings</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Enterprise Profile</CardTitle>
                <CardDescription>
                  Manage your enterprise information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Enterprise Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={enterpriseData.name}
                    onChange={handleChange}
                    placeholder="Enter enterprise name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={enterpriseData.description}
                    onChange={handleChange}
                    placeholder="Describe your enterprise"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={enterpriseData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter contact email"
                  />
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveGeneral}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Logo</CardTitle>
                <CardDescription>
                  Upload your enterprise logo
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  {logoPreview ? (
                    <AvatarImage src={logoPreview} alt="Preview" />
                  ) : (
                    <AvatarFallback className="bg-academy-green text-white text-4xl">
                      <Building2 className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="w-full">
                  <Label htmlFor="logo" className="block mb-2">Upload Logo</Label>
                  <div className="flex items-center">
                    <Button variant="outline" className="mb-1 w-full" onClick={() => document.getElementById('logo')?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose File
                    </Button>
                    <Input 
                      id="logo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 400x400px, max 2MB
                  </p>
                </div>
                
                {logoPreview && (
                  <Button 
                    variant="outline" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                  >
                    Remove Logo
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Members</span>
                <Button size="sm" className="btn-primary">
                  Add Team Member
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your enterprise team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-academy-green text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-3 text-sm text-muted-foreground">
                          <span>{member.role}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how your enterprise receives notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="bookingNotifications" className="text-base">Booking Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new bookings
                    </p>
                  </div>
                  <Switch
                    id="bookingNotifications"
                    checked={enterpriseData.bookingNotifications}
                    onCheckedChange={() => handleToggle('bookingNotifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoConfirmBookings" className="text-base">Auto-Confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm bookings without manual approval
                    </p>
                  </div>
                  <Switch
                    id="autoConfirmBookings"
                    checked={enterpriseData.autoConfirmBookings}
                    onCheckedChange={() => handleToggle('autoConfirmBookings')}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">Notification Email</Label>
                  <Input
                    id="notificationEmail"
                    type="email"
                    value={enterpriseData.contactEmail}
                    onChange={(e) => setEnterpriseData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="Enter email address for notifications"
                  />
                </div>
                
                <Button onClick={() => toast.success("Notification settings saved")}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced enterprise settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="productApprovalRequired" className="text-base">Product Approval Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Require administrator approval before products go live
                    </p>
                  </div>
                  <Switch
                    id="productApprovalRequired"
                    checked={enterpriseData.productApprovalRequired}
                    onCheckedChange={() => handleToggle('productApprovalRequired')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowStudentReviews" className="text-base">Allow Student Reviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Let students leave reviews and ratings for your products
                    </p>
                  </div>
                  <Switch
                    id="allowStudentReviews"
                    checked={enterpriseData.allowStudentReviews}
                    onCheckedChange={() => handleToggle('allowStudentReviews')}
                  />
                </div>
                
                <Separator />
                
                <div className="pt-4">
                  <Button 
                    variant="outline"
                    className="text-destructive border-destructive hover:bg-destructive/10 flex items-center gap-2"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Reset Enterprise Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseSettings;
