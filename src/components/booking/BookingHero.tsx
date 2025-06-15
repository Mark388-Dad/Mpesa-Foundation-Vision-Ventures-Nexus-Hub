
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, FlaskConical, Mic, GraduationCap, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function BookingHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile } = useAuth();

  // Fetch user's next booking
  const { data: nextBooking } = useQuery({
    queryKey: ['next-booking', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
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
        .eq('status', 'confirmed')
        .gte('pickup_time', new Date().toISOString())
        .order('pickup_time', { ascending: true })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching next booking:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch pending bookings count for progress bar
  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['pending-bookings-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('status', 'pending');
        
      if (error) {
        console.error('Error fetching pending count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user?.id
  });

  const quickBookingActions = [
    { 
      icon: BookOpen, 
      label: "Book a Room", 
      color: "bg-blue-500 hover:bg-blue-600 text-white",
      description: "Conference rooms, study spaces"
    },
    { 
      icon: FlaskConical, 
      label: "Book a Lab", 
      color: "bg-green-500 hover:bg-green-600 text-white",
      description: "Science labs, computer labs"
    },
    { 
      icon: Mic, 
      label: "Book Equipment", 
      color: "bg-purple-500 hover:bg-purple-600 text-white",
      description: "Audio, video, projectors"
    },
    { 
      icon: GraduationCap, 
      label: "Book a Teacher", 
      color: "bg-orange-500 hover:bg-orange-600 text-white",
      description: "Consultations, tutorials"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-academy-blue to-academy-green text-white py-12">
      <div className="academy-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What would you like to book today?
          </h2>
          <p className="text-xl opacity-90 mb-6">
            Welcome back, {profile?.fullName || profile?.username || 'Student'}! Let's get you what you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for rooms, labs, equipment, teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>

        {/* Quick Booking Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickBookingActions.map((action, index) => (
            <Button
              key={index}
              className={`${action.color} h-auto p-6 flex flex-col items-center space-y-3 hover:scale-105 transition-all duration-200`}
            >
              <action.icon className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Live Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Info */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Today</h3>
              <div className="text-2xl font-bold">
                {format(new Date(), 'EEEE')}
              </div>
              <div className="text-sm opacity-90">
                {format(new Date(), 'MMMM d, yyyy')}
              </div>
              <div className="text-sm opacity-90 mt-2">
                {format(new Date(), 'HH:mm')}
              </div>
            </CardContent>
          </Card>

          {/* Next Booking */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-3 text-green-300" />
              <h3 className="font-semibold mb-2">Your Next Booking</h3>
              {nextBooking ? (
                <>
                  <div className="text-lg font-medium">
                    {nextBooking.products?.name}
                  </div>
                  <div className="text-sm opacity-90">
                    {nextBooking.products?.enterprises?.name}
                  </div>
                  {nextBooking.pickup_time && (
                    <div className="text-sm opacity-90 mt-1">
                      {format(new Date(nextBooking.pickup_time), 'MMM d, HH:mm')}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm opacity-90">
                  No upcoming bookings
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval Progress */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <div className="h-8 w-8 mx-auto mb-3 rounded-full bg-orange-300 flex items-center justify-center">
                <span className="text-sm font-bold text-orange-800">{pendingCount}</span>
              </div>
              <h3 className="font-semibold mb-2">Pending Approvals</h3>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-orange-300 h-2 rounded-full transition-all duration-300"
                  style={{ width: pendingCount > 0 ? '70%' : '100%' }}
                ></div>
              </div>
              <div className="text-sm opacity-90">
                {pendingCount > 0 
                  ? `${pendingCount} awaiting approval` 
                  : 'All requests processed'
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
