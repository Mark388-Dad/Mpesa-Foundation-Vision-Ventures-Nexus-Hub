
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
  Shield, 
  Database, 
  Users, 
  Mail,
  Bell,
  Server,
  Activity,
  Save,
  Download,
  Upload,
  Trash2
} from "lucide-react";

const AdminSettings = () => {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("system");
  
  // System settings
  const [systemName, setSystemName] = useState("MFA Enterprise Academy");
  const [systemDescription, setSystemDescription] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  
  // Security settings
  const [passwordPolicy, setPasswordPolicy] = useState("medium");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  
  // Email settings
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  
  // Notification settings
  const [adminNotifications, setAdminNotifications] = useState(true);
  const [userWelcomeEmail, setUserWelcomeEmail] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has staff role
  if (!profile || profile.role !== 'staff') {
    toast.error("You don't have permission to access admin settings");
    return <Navigate to="/" />;
  }

  const handleSaveSystem = () => {
    toast.success("System settings saved successfully");
  };

  const handleSaveSecurity = () => {
    toast.success("Security settings saved successfully");
  };

  const handleSaveEmail = () => {
    toast.success("Email settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  const handleBackupDatabase = () => {
    toast.success("Database backup initiated");
  };

  const handleRestoreDatabase = () => {
    toast.success("Database restore initiated");
  };

  const handleClearCache = () => {
    toast.success("System cache cleared");
  };

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="systemDescription">System Description</Label>
                <Textarea
                  id="systemDescription"
                  value={systemDescription}
                  onChange={(e) => setSystemDescription(e.target.value)}
                  placeholder="Brief description of your academy system"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable access for all users except staff
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={registrationOpen}
                  onCheckedChange={setRegistrationOpen}
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">System Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleClearCache}>
                    <Server className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    System Logs
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleSaveSystem} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Password Policy</Label>
                <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weak">Weak - Minimum 6 characters</SelectItem>
                    <SelectItem value="medium">Medium - 8 chars with numbers</SelectItem>
                    <SelectItem value="strong">Strong - 12 chars with symbols</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all staff members
                  </p>
                </div>
                <Switch
                  checked={twoFactorRequired}
                  onCheckedChange={setTwoFactorRequired}
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Security Monitoring</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium">Failed Login Attempts</h5>
                    <p className="text-2xl font-bold text-red-600">24</p>
                    <p className="text-sm text-muted-foreground">Last 24 hours</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium">Active Sessions</h5>
                    <p className="text-2xl font-bold text-green-600">156</p>
                    <p className="text-sm text-muted-foreground">Current users</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSecurity} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium">Total Users</h5>
                  <p className="text-2xl font-bold">1,234</p>
                  <Badge variant="outline">All roles</Badge>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium">Students</h5>
                  <p className="text-2xl font-bold text-blue-600">1,156</p>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h5 className="font-medium">Enterprises</h5>
                  <p className="text-2xl font-bold text-green-600">67</p>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">User Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export User List
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Bulk Email Users
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Recent Registrations</h4>
                <div className="space-y-2">
                  {['John Doe (Student)', 'Tech Hub (Enterprise)', 'Mary Smith (Student)'].map((user, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{user}</span>
                      <Badge variant="outline">Today</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="your-email@domain.com"
                />
              </div>
              
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Email Templates</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="mr-2">
                    Welcome Email
                  </Button>
                  <Button variant="outline" size="sm" className="mr-2">
                    Booking Confirmation
                  </Button>
                  <Button variant="outline" size="sm">
                    Password Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  Test Email
                </Button>
                <Button onClick={handleSaveEmail}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Admin Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive system alerts and updates
                    </p>
                  </div>
                  <Switch
                    checked={adminNotifications}
                    onCheckedChange={setAdminNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Welcome Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send welcome email to new users
                    </p>
                  </div>
                  <Switch
                    checked={userWelcomeEmail}
                    onCheckedChange={setUserWelcomeEmail}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Booking Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about new bookings and status changes
                    </p>
                  </div>
                  <Switch
                    checked={bookingNotifications}
                    onCheckedChange={setBookingNotifications}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Notification History</h4>
                <div className="space-y-2">
                  {[
                    'System backup completed - 2 hours ago',
                    'New enterprise registered - 4 hours ago',
                    'Booking confirmation sent - 6 hours ago'
                  ].map((notification, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded text-sm">
                      <span>{notification}</span>
                      <Badge variant="outline">Success</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Database Size</h5>
                  <p className="text-2xl font-bold">2.4 GB</p>
                  <p className="text-sm text-muted-foreground">Total storage used</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2">Last Backup</h5>
                  <p className="text-2xl font-bold">12h ago</p>
                  <p className="text-sm text-muted-foreground">Automatic backup</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Backup & Restore</h4>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleBackupDatabase}>
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline" onClick={handleRestoreDatabase}>
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Schedule Backups
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Database Maintenance</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Optimize Tables
                  </Button>
                  <Button variant="outline" size="sm">
                    Check Integrity
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clean Old Logs
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

export default AdminSettings;
