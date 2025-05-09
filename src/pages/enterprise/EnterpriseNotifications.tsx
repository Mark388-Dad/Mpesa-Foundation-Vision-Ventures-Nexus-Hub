
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings, CheckCheck, X, ShoppingCart, Box, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'booking' | 'product' | 'system' | 'approval';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
  status?: string;
}

const EnterpriseNotifications = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    // In a real app, you would fetch this from Supabase
    // Here we're generating sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        type: 'booking',
        title: 'New Booking Received',
        message: 'Student John Doe has booked 2x "Scientific Calculator". Please confirm the booking.',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'pending'
      },
      {
        id: "2",
        type: 'product',
        title: 'Low Stock Alert',
        message: 'Your product "School T-Shirt (Size M)" is running low on stock. Only 2 items remaining.',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
      },
      {
        id: "3",
        type: 'booking',
        title: 'Booking Cancelled',
        message: 'Student Mary Smith has cancelled their booking for "Chemistry Textbook".',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'cancelled'
      },
      {
        id: "4",
        type: 'approval',
        title: 'Product Approved',
        message: 'Your product "Handmade Notebook" has been approved by the administrator.',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      },
      {
        id: "5",
        type: 'system',
        title: 'System Maintenance',
        message: 'The system will undergo maintenance on Saturday, 10 PM - 2 AM. Some features may be temporarily unavailable.',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
      }
    ];
    
    setNotifications(sampleNotifications);
  }, []);
  
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
  
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.type === activeTab);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const getNotificationIcon = (type: string, status?: string) => {
    switch(type) {
      case 'booking':
        if (status === 'pending') return <ShoppingCart className="h-5 w-5 text-amber-500" />;
        if (status === 'cancelled') return <X className="h-5 w-5 text-red-500" />;
        return <ShoppingCart className="h-5 w-5 text-academy-blue" />;
      case 'product':
        return <Box className="h-5 w-5 text-academy-blue" />;
      case 'system':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'approval':
        return <CheckCheck className="h-5 w-5 text-academy-green" />;
      default:
        return <Bell className="h-5 w-5" />;
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Enterprise Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-academy-green">{unreadCount} new</Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-1 h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-academy-green text-white inline-flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="booking">Bookings</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="approval">Approvals</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications
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
                      className={`p-4 border rounded-md flex ${notification.isRead ? 'bg-white' : 'bg-green-50'}`}
                    >
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(notification.type, notification.status)}
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
                          <div>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${notification.type === 'booking' ? 'border-amber-500 text-amber-500' : ''}
                                ${notification.type === 'product' ? 'border-academy-blue text-academy-blue' : ''}
                                ${notification.type === 'system' ? 'border-amber-500 text-amber-500' : ''}
                                ${notification.type === 'approval' ? 'border-academy-green text-academy-green' : ''}
                              `}
                            >
                              {notification.type}
                            </Badge>
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
      </Tabs>
    </div>
  );
};

export default EnterpriseNotifications;
