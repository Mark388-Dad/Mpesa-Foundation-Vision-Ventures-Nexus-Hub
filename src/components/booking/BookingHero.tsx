
import { useState } from "react";
import { Search, Calendar, BookOpen, FlaskConical, Mic, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BookingHero() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickBookingOptions = [
    { icon: BookOpen, label: "Book a Room", color: "bg-blue-500", count: "12 available" },
    { icon: FlaskConical, label: "Book a Lab", color: "bg-green-500", count: "3 available" },
    { icon: Mic, label: "Book Equipment", color: "bg-purple-500", count: "8 available" },
    { icon: User, label: "Book a Teacher", color: "bg-orange-500", count: "5 available" },
  ];

  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-gradient-to-r from-academy-blue to-academy-green rounded-xl p-8 text-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">What would you like to book today?</h2>
        <p className="text-xl opacity-90 mb-6">{currentTime}</p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for rooms, equipment, teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white text-gray-900 border-0"
          />
        </div>
      </div>

      {/* Quick Booking Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickBookingOptions.map((option, index) => (
          <Button
            key={index}
            variant="secondary"
            className="h-auto p-4 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <option.icon className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium">{option.label}</p>
              <p className="text-xs opacity-80">{option.count}</p>
            </div>
          </Button>
        ))}
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Your Next Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Room 104 - Biology Lab</p>
            <p className="text-sm opacity-80">Tomorrow at 2:00 PM</p>
            <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-100">
              Confirmed
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm opacity-80">Requests awaiting approval</p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm opacity-80">Active sessions today</p>
            <Badge variant="secondary" className="mt-2 bg-blue-500/20 text-blue-100">
              All confirmed
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
