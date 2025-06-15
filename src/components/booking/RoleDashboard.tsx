
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  CheckCircle, 
  Users, 
  Eye, 
  Calendar,
  BarChart3,
  AlertTriangle,
  FileText,
  Upload,
  MessageSquare,
  Clock,
  TrendingUp
} from "lucide-react";

interface RoleDashboardProps {
  userRole?: string;
}

export function RoleDashboard({ userRole }: RoleDashboardProps) {
  const { user } = useAuth();

  // Fetch user's bookings
  const { data: userBookings = [] } = useQuery({
    queryKey: ['user-bookings', user?.id],
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
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch pending requests (for staff)
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: async () => {
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
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching pending requests:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: userRole === 'staff'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderStudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Your Bookings Today */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
            Your Bookings Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userBookings.filter(booking => 
              new Date(booking.created_at).toDateString() === new Date().toDateString()
            ).slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{booking.products?.name}</div>
                  <div className="text-xs text-gray-500">{booking.products?.enterprises?.name}</div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            ))}
            {userBookings.filter(booking => 
              new Date(booking.created_at).toDateString() === new Date().toDateString()
            ).length === 0 && (
              <p className="text-sm text-gray-500">No bookings today</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-500" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userBookings.filter(booking => booking.status === 'pending').slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                <div>
                  <div className="font-medium text-sm">{booking.products?.name}</div>
                  <div className="text-xs text-gray-500">Qty: {booking.quantity}</div>
                </div>
                <span className="text-xs text-orange-600">Waiting</span>
              </div>
            ))}
            {userBookings.filter(booking => booking.status === 'pending').length === 0 && (
              <p className="text-sm text-gray-500">No pending requests</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Book a Study Group
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Eye className="h-4 w-4 mr-2" />
            View Teacher Availability
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Recently Used Rooms
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Approve New Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Approve New Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="p-3 border rounded-lg">
                <div className="font-medium text-sm">{request.products?.name}</div>
                <div className="text-xs text-gray-500 mb-2">
                  Qty: {request.quantity} • {request.products?.enterprises?.name}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <p className="text-sm text-gray-500">No pending requests</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Club Session */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Schedule Club Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Drama Club - Friday 3PM
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Science Club - Thursday 2PM
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            View All Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Analytics & Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
            Analytics Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Weekly Room Usage
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Lab Safety Reminder
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Usage Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnterpriseDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Upload Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-500" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Event Proposal
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Equipment List
          </Button>
          <Button className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Document
          </Button>
        </CardContent>
      </Card>

      {/* Past Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Eye className="h-5 w-5 mr-2 text-green-500" />
            See Past Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded text-sm">
              <div className="font-medium">Tech Fair 2024</div>
              <div className="text-gray-500">March 15, 2024</div>
            </div>
            <div className="p-2 bg-gray-50 rounded text-sm">
              <div className="font-medium">Innovation Workshop</div>
              <div className="text-gray-500">February 28, 2024</div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View All Events
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support & Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-orange-500" />
            Support & Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            View Booking Guidelines
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with Events Team
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  switch (userRole) {
    case 'staff':
      return renderStaffDashboard();
    case 'enterprise':
      return renderEnterpriseDashboard();
    case 'student':
    default:
      return renderStudentDashboard();
  }
}
