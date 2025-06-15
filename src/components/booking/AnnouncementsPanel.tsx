
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction, Megaphone, Calendar, Settings, Droplets } from "lucide-react";

export function AnnouncementsPanel() {
  const announcements = [
    {
      id: 1,
      type: "maintenance",
      title: "Hall under renovation next week",
      message: "Main hall will be unavailable from Monday to Friday",
      icon: Construction,
      color: "text-orange-500",
      badge: "Maintenance",
      badgeColor: "bg-orange-100 text-orange-800"
    },
    {
      id: 2,
      type: "rules",
      title: "New rules for lab bookings",
      message: "Safety protocols updated - please review before booking",
      icon: Megaphone,
      color: "text-blue-500",
      badge: "Important",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      type: "events",
      title: "Upcoming school events",
      message: "Science fair next month - reserve equipment early",
      icon: Calendar,
      color: "text-green-500",
      badge: "Events",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      id: 4,
      type: "system",
      title: "Scheduled system maintenance",
      message: "Booking system will be offline Sunday 2-4 AM",
      icon: Settings,
      color: "text-purple-500",
      badge: "System",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      id: 5,
      type: "cleaning",
      title: "Enhanced cleaning schedule",
      message: "All rooms deep cleaned daily at 6 PM",
      icon: Droplets,
      color: "text-teal-500",
      badge: "Hygiene",
      badgeColor: "bg-teal-100 text-teal-800"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🟩 Announcements & Notices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <announcement.icon className={`h-5 w-5 mt-0.5 ${announcement.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                    <Badge variant="outline" className={announcement.badgeColor}>
                      {announcement.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{announcement.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
