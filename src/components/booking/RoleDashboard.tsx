
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Users, BarChart, FileText, MessageSquare } from "lucide-react";
import { UserRole } from "@/types";

interface RoleDashboardProps {
  userRole?: UserRole;
}

export function RoleDashboard({ userRole }: RoleDashboardProps) {
  const renderStudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Your Bookings Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Room 203 - Study Hall</p>
                <p className="text-sm text-gray-600">10:00 AM - 12:00 PM</p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">Confirmed</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">Chemistry Lab</p>
                <p className="text-sm text-gray-600">2:00 PM - 4:00 PM</p>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Book a Study Group
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            View Teacher Availability
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Recently Used Rooms
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">Room 104 Request</p>
                <p className="text-sm text-gray-600">Student: John Doe</p>
              </div>
              <Button size="sm">Approve</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">Lab Equipment Request</p>
                <p className="text-sm text-gray-600">Student: Jane Smith</p>
              </div>
              <Button size="sm">Approve</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-purple-500" />
            Management Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Schedule Club Session
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <BarChart className="h-4 w-4 mr-2" />
            Weekly Room Usage
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Analytics Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnterpriseDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-500" />
            Enterprise Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            View Past Events
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Booking Guidelines
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Chat with Events Team
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 capitalize">{userRole} Dashboard</h3>
      {userRole === 'student' && renderStudentDashboard()}
      {userRole === 'staff' && renderStaffDashboard()}
      {userRole === 'enterprise' && renderEnterpriseDashboard()}
    </div>
  );
}
