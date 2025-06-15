
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Clock, Calendar, AlertCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export function RecentActivity() {
  const { user } = useAuth();

  // Fetch recent bookings
  const { data: recentBookings = [] } = useQuery({
    queryKey: ['recent-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          products (
            name,
            enterprises (
              name
            )
          )
        `)
        .eq('student_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching recent bookings:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch recent notifications
  const { data: recentNotifications = [] } = useQuery({
    queryKey: ['recent-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });

  const getActivityIcon = (type: string, status?: string) => {
    if (type === 'booking') {
      switch (status) {
        case 'confirmed':
          return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'cancelled':
          return <XCircle className="h-4 w-4 text-red-500" />;
        case 'pending':
          return <Clock className="h-4 w-4 text-orange-500" />;
        default:
          return <Calendar className="h-4 w-4 text-blue-500" />;
      }
    }
    return <AlertCircle className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Combine and sort activities
  const allActivities = [
    ...recentBookings.map(booking => ({
      id: booking.id,
      type: 'booking',
      title: `Booked ${booking.products?.name}`,
      description: `${booking.products?.enterprises?.name} • Quantity: ${booking.quantity}`,
      status: booking.status,
      timestamp: booking.updated_at,
      pickup_code: booking.pickup_code
    })),
    ...recentNotifications.map(notification => ({
      id: notification.id,
      type: 'notification',
      title: notification.title,
      description: notification.message,
      status: notification.read ? 'read' : 'unread',
      timestamp: notification.created_at
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📋 Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivities.length > 0 ? (
            allActivities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.description}
                  </p>
                  {activity.pickup_code && (
                    <div className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded inline-block mb-1">
                      Pickup Code: {activity.pickup_code}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs">Your bookings and notifications will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
