
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Megaphone, Users, CheckCheck, X, AlertTriangle, Send, Building2 } from "lucide-react";

interface Notification {
  id: string;
  type: 'system' | 'approval' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

const AdminNotifications = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEnterprise, setSelectedEnterprise] = useState("all");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationPriority, setNotificationPriority] = useState<"low" | "medium" | "high">("medium");
  
  useEffect(() => {
    // In a real app, you would fetch this from Supabase
    // Sample notifications data
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: 'approval',
        title: 'Product Approval Request',
        message: 'The Tech Hub enterprise has submitted a new product "Wireless Headphones" for approval.',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        priority: 'medium'
      },
      {
        id: "2",
        type: 'system',
        title: 'New Enterprise Registration',
        message: 'A new enterprise "Art Studio" has registered and is waiting for approval.',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        priority: 'high'
      },
      {
        id: "3",
        type: 'alert',
        title: 'Low Stock Alert',
        message: 'Multiple products in "School Store" enterprise have low stock levels.',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        priority: 'low'
      },
      {
        id: "4",
        type: 'system',
        title: 'Weekly Report Generated',
        message: 'The weekly booking and sales report is now available for review.',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        priority: 'medium'
      }
    ];
    
    setNotifications(sampleNotifications);
  }, []);
  
  // Sample enterprises data
  const enterprises = [
    { id: "1", name: "Tech Hub" },
    { id: "2", name: "School Store" },
    { id: "3", name: "Art Studio" },
    { id: "4", name: "Sports Equipment" },
    { id: "5", name: "Book Shop" }
  ];
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    toast.success("Notification marked as read");
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
    toast.success("All notifications marked as read");
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };
  
  const handleSendNotification = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    toast.success(`Notification "${notificationTitle}" sent successfully`);
    
    // Reset form
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationPriority("medium");
    setSelectedEnterprise("all");
    
    // In a real app, you would send this notification to the selected recipients
  };
  
  const filteredNotifications = notifications.filter(n => activeTab === "inbox");
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const getNotificationIcon = (type: string, priority?: string) => {
    switch(type) {
      case 'system':
        return <Bell className="h-5 w-5 text-academy-blue" />;
      case 'approval':
        return <Users className="h-5 w-5 text-academy-green" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getPriorityClass = (priority?: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Notifications & Announcements</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="inbox">
            Inbox
            {unreadCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-academy-blue text-white inline-flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="send">Send Announcements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Notifications</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="mr-1 h-4 w-4" />
                  Mark all as read
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="mt-2 text-muted-foreground">No notifications to display</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`p-4 border rounded-md flex ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`
                                ${notification.type === 'system' ? 'border-academy-blue text-academy-blue' : ''}
                                ${notification.type === 'approval' ? 'border-academy-green text-academy-green' : ''}
                                ${notification.type === 'alert' ? 'border-amber-500 text-amber-500' : ''}
                              `}
                            >
                              {notification.type}
                            </Badge>
                            {notification.priority && (
                              <Badge variant="outline" className={getPriorityClass(notification.priority)}>
                                {notification.priority} priority
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {!notification.isRead && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <CheckCheck className="mr-1 h-4 w-4" />
                                Mark as read
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="mr-2 h-5 w-5 text-academy-blue" />
                Send Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Select value={selectedEnterprise} onValueChange={setSelectedEnterprise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Enterprises</SelectItem>
                    <SelectItem value="students">All Students</SelectItem>
                    <SelectItem value="staff">Staff Members</SelectItem>
                    {enterprises.map(enterprise => (
                      <SelectItem key={enterprise.id} value={enterprise.id}>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-academy-blue" />
                          {enterprise.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={notificationPriority} onValueChange={(val: "low" | "medium" | "high") => setNotificationPriority(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter your message"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSendNotification}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
