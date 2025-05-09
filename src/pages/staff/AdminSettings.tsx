
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Settings,
  Shield,
  Database,
  Key,
  AlertTriangle,
  Loader2,
  Globe,
  FileJson,
  RefreshCw,
  Clock
} from "lucide-react";

const AdminSettings = () => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "MFA Enterprise Hub",
    siteDescription: "Connecting students with student-run enterprises",
    contactEmail: "admin@mfa.edu",
    enableBookings: true,
    maintenanceMode: false
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiryDays: 90,
    loginAttempts: 5,
    sessionTimeout: 60,
    requireApproval: true
  });
  
  const handleGeneralSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggle = (settingsType: 'general' | 'security', key: string) => {
    if (settingsType === 'general') {
      setGeneralSettings(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof generalSettings]
      }));
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof securitySettings]
      }));
    }
  };
  
  const handleSecuritySettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSettings = async (settingsType: 'general' | 'security') => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} settings saved successfully`);
    } catch (error) {
      toast.error(`Failed to save settings`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRunBackup = async () => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Database backup completed successfully");
    } catch (error) {
      toast.error("Failed to run backup");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-1" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-1" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-1" />
            Database
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-1" />
            API Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-academy-blue" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure global settings for the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralSettingChange}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBookings" className="text-base">Enable Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to book products from enterprises
                    </p>
                  </div>
                  <Switch
                    id="enableBookings"
                    checked={generalSettings.enableBookings}
                    onCheckedChange={() => handleToggle('general', 'enableBookings')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the site in maintenance mode (only admins can access)
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={() => handleToggle('general', 'maintenanceMode')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button 
                onClick={() => handleSaveSettings('general')}
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
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-academy-blue" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth" className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for admin accounts
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleToggle('security', 'twoFactorAuth')}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiryDays"
                      name="passwordExpiryDays"
                      type="number"
                      min="0"
                      value={securitySettings.passwordExpiryDays}
                      onChange={handleSecuritySettingChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Days before passwords expire (0 = never)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      name="loginAttempts"
                      type="number"
                      min="1"
                      value={securitySettings.loginAttempts}
                      onChange={handleSecuritySettingChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of failed attempts before account lockout
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      name="sessionTimeout"
                      type="number"
                      min="5"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecuritySettingChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minutes of inactivity before session expires
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireApproval" className="text-base">Require Product Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require administrator approval for new products
                    </p>
                  </div>
                  <Switch
                    id="requireApproval"
                    checked={securitySettings.requireApproval}
                    onCheckedChange={() => handleToggle('security', 'requireApproval')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button 
                onClick={() => handleSaveSettings('security')}
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
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-academy-blue" />
                Database Management
              </CardTitle>
              <CardDescription>
                Manage database operations and backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Database Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border">
                  <div>
                    <p className="text-sm text-muted-foreground">Database Type</p>
                    <p className="font-medium">PostgreSQL</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Database Version</p>
                    <p className="font-medium">14.5</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tables</p>
                    <p className="font-medium">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Backup</p>
                    <p className="font-medium">
                      {new Date().toLocaleDateString()} (12:30 PM)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Backup & Restore</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-md border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Manual Backup</p>
                      <p className="text-sm text-muted-foreground">
                        Create a backup of the entire database
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleRunBackup}
                      disabled={isSubmitting}
                      className="flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Backing up...
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Run Backup
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-muted-foreground">
                        Export database as JSON file
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center">
                      <FileJson className="mr-2 h-4 w-4" />
                      Export JSON
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Backups</p>
                      <p className="text-sm text-muted-foreground">
                        Current schedule: Daily at 12:00 AM
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Change Schedule
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-600 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reset Database</p>
                      <p className="text-sm text-muted-foreground">
                        Reset the database to its initial state
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Database
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-academy-blue" />
                API Settings
              </CardTitle>
              <CardDescription>
                Manage API keys and endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">API Keys</h3>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex mt-1">
                        <Input
                          id="apiKey"
                          value="••••••••••••••••••••••••••••••"
                          readOnly
                          className="font-mono"
                        />
                        <Button className="ml-2">Show</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last generated: 2023-10-15
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <Button>
                        Generate New API Key
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg">API Access Control</h3>
                <div className="bg-gray-50 p-4 rounded-md border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableApi" className="text-base">Enable API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow external applications to access the API
                      </p>
                    </div>
                    <Switch id="enableApi" defaultChecked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="rateLimit" className="text-base">Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">
                        Limit API requests to 100 per minute
                      </p>
                    </div>
                    <Switch id="rateLimit" defaultChecked={true} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Webhook Configuration</h3>
                <div className="bg-gray-50 p-4 rounded-md border">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://your-webhook-endpoint.com/hook"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableWebhooks" className="text-base">Enable Webhooks</Label>
                        <p className="text-sm text-muted-foreground">
                          Send webhook notifications for important events
                        </p>
                      </div>
                      <Switch id="enableWebhooks" defaultChecked={false} />
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline">
                        Test Webhook
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button>
                Save API Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
