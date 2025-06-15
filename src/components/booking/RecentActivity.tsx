
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "booking",
      message: "You booked Room 104",
      time: "2 minutes ago",
      status: "confirmed",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 2,
      type: "approval",
      message: "Your request was approved",
      time: "1 hour ago",
      status: "approved",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 3,
      type: "cancellation",
      message: "Admin cancelled booking due to maintenance",
      time: "3 hours ago",
      status: "cancelled",
      icon: XCircle,
      color: "text-red-500"
    },
    {
      id: 4,
      type: "reminder",
      message: "Reminder: Chemistry Lab session in 30 minutes",
      time: "30 minutes ago",
      status: "reminder",
      icon: Clock,
      color: "text-blue-500"
    },
    {
      id: 5,
      type: "warning",
      message: "Equipment return overdue - Microscope #12",
      time: "1 day ago",
      status: "warning",
      icon: AlertTriangle,
      color: "text-yellow-500"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'reminder':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reminder</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🟫 Recent Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  {getStatusBadge(activity.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
