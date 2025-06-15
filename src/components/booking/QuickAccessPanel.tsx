
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Clock, FileText, Folder, Star } from "lucide-react";

export function QuickAccessPanel() {
  const quickActions = [
    { icon: RotateCcw, label: "Rebook Last Session", color: "text-blue-500" },
    { icon: Clock, label: "View Booking History", color: "text-green-500" },
    { icon: FileText, label: "Booking Receipts", color: "text-purple-500" },
    { icon: Folder, label: "Documents & Files", color: "text-orange-500" },
    { icon: FileText, label: "Resource Manuals", color: "text-red-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🔁 Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start h-auto p-3"
          >
            <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Top Rated Rooms
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Room 204 - Conference</span>
              <span className="text-yellow-500">⭐️ 4.8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Lab 101 - Chemistry</span>
              <span className="text-yellow-500">⭐️ 4.7</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Studio A - Music</span>
              <span className="text-yellow-500">⭐️ 4.6</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
