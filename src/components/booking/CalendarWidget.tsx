
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const { user } = useAuth();

  // Fetch bookings for the current month
  const { data: bookings = [] } = useQuery({
    queryKey: ['calendar-bookings', user?.id, format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      
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
        .gte('pickup_time', start.toISOString())
        .lte('pickup_time', end.toISOString())
        .order('pickup_time', { ascending: true });
        
      if (error) {
        console.error('Error fetching calendar bookings:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getBookingsForDay = (day: Date) => {
    return bookings.filter(booking => 
      booking.pickup_time && isSameDay(new Date(booking.pickup_time), day)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            📅 Calendar & Timeline
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          {days.map(day => {
            const dayBookings = getBookingsForDay(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`p-2 text-center text-sm border rounded hover:bg-gray-50 cursor-pointer transition-colors ${
                  isCurrentDay ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                }`}
              >
                <div className={`font-medium ${isCurrentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                  {format(day, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {dayBookings.slice(0, 2).map(booking => (
                    <div
                      key={booking.id}
                      className={`w-full h-1 rounded ${getStatusColor(booking.status)}`}
                      title={`${booking.products?.name} - ${booking.status}`}
                    />
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Slot Heatmap */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Time Slot Availability
          </h4>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }, (_, i) => {
              const hour = i + 8; // 8 AM to 7 PM
              const intensity = Math.random(); // Replace with actual booking density
              
              return (
                <div
                  key={hour}
                  className={`p-2 text-center text-xs rounded ${
                    intensity > 0.7 ? 'bg-red-200 text-red-800' :
                    intensity > 0.4 ? 'bg-orange-200 text-orange-800' :
                    'bg-green-200 text-green-800'
                  }`}
                  title={`${hour}:00 - ${intensity > 0.7 ? 'Busy' : intensity > 0.4 ? 'Moderate' : 'Free'}`}
                >
                  {hour}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>8 AM</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
                <span>Free</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-200 rounded mr-1"></div>
                <span>Busy</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-200 rounded mr-1"></div>
                <span>Full</span>
              </div>
            </div>
            <span>7 PM</span>
          </div>
        </div>

        {/* Booking Color Codes Legend */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-2">Booking Status</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Confirmed
            </Badge>
            <Badge className="bg-orange-100 text-orange-800">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Pending
            </Badge>
            <Badge className="bg-red-100 text-red-800">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Cancelled
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
