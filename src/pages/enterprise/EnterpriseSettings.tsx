
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  User, 
  Building2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const EnterpriseSettings = () => {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings state
  const [enterpriseName, setEnterpriseName] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  
  // Business settings
  const [businessHours, setBusinessHours] = useState({
    open: "08:00",
    close: "18:00",
    timezone: "Africa/Nairobi"
  });
  const [autoConfirm, setAutoConfirm] = useState(false);
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showContactInfo, setShowContactInfo] = useState(true);
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has enterprise role
  if (!profile) {
    toast.error("You need to be logged in to access enterprise settings");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'enterprise') {
    toast.error("You don't have permission to access enterprise settings");
    return <Navigate to="/" />;
  }

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleSaveBusiness = () => {
    toast.success("Business settings saved successfully");
  };

  const handleSavePrivacy = () => {
    toast.success("Privacy settings saved successfully");
  };

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Enterprise Settings</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="business">
            <Settings className="h-4 w-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="enterpriseName">Enterprise Name</Label>
                  <Input
                    id="enterpriseName"
                    value={enterpriseName}
                    onChange={(e) => setEnterpriseName(e.target.value)}
                    placeholder="Your enterprise name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@enterprise.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your enterprise"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+254 700 123 456"
                />
              </div>
              
              <Button onClick={handleSaveGeneral} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Booking Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when students book your products
                    </p>
                  </div>
                  <Switch
                    checked={bookingNotifications}
                    onCheckedChange={setBookingNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Review Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when students leave reviews
                    </p>
                  </div>
                  <Switch
                    checked={reviewNotifications}
                    onCheckedChange={setReviewNotifications}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Business Hours</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="openTime">Opening Time</Label>
                    <Input
                      id="openTime"
                      type="time"
                      value={businessHours.open}
                      onChange={(e) => setBusinessHours({...businessHours, open: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="closeTime">Closing Time</Label>
                    <Input
                      id="closeTime"
                      type="time"
                      value={businessHours.close}
                      onChange={(e) => setBusinessHours({...businessHours, close: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Timezone</Label>
                <Select value={businessHours.timezone} onValueChange={(value) => setBusinessHours({...businessHours, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-confirm Bookings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm bookings without manual review
                  </p>
                </div>
                <Switch
                  checked={autoConfirm}
                  onCheckedChange={setAutoConfirm}
                />
              </div>
              
              <Button onClick={handleSaveBusiness} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Profile Visibility</Label>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Public - Visible to all students
                      </div>
                    </SelectItem>
                    <SelectItem value="limited">
                      <div className="flex items-center">
                        <EyeOff className="h-4 w-4 mr-2" />
                        Limited - Visible to students who've booked
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Private - Only visible to staff
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Contact Information</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your contact info on your public profile
                  </p>
                </div>
                <Switch
                  checked={showContactInfo}
                  onCheckedChange={setShowContactInfo}
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Data Management</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Download My Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Export Analytics
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleSavePrivacy} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Enterprise Theme Color</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => toast.success(`Theme color updated to ${color}`)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Logo Upload</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <Building2 className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload your enterprise logo</p>
                    <Button variant="outline" size="sm">Choose File</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Display Name Style</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-lg p-4">
                    <Badge className="mb-2">Current</Badge>
                    <p className="font-medium">Enterprise Name</p>
                    <p className="text-sm text-muted-foreground">Standard display</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                    <p className="font-medium">ENTERPRISE NAME</p>
                    <p className="text-sm text-muted-foreground">Uppercase display</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => toast.success("Appearance settings saved")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseSettings;
