
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BookingHeader } from "@/components/booking/BookingHeader";
import { BookingHero } from "@/components/booking/BookingHero";
import { RoleDashboard } from "@/components/booking/RoleDashboard";
import { QuickAccessPanel } from "@/components/booking/QuickAccessPanel";
import { RecentActivity } from "@/components/booking/RecentActivity";
import { AnnouncementsPanel } from "@/components/booking/AnnouncementsPanel";

const BookingDashboard = () => {
  const { profile, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access the booking system</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingHeader />
      
      <main className="academy-container py-6">
        <BookingHero />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <RoleDashboard userRole={profile?.role} />
            <RecentActivity />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <QuickAccessPanel />
            <AnnouncementsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDashboard;
