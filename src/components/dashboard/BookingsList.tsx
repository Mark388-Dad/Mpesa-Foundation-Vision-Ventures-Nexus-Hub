
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking, Product, User } from "@/types";
import { formatDate } from "@/utils/helpers";

interface BookingsListProps {
  bookings: (Booking & { 
    product: Product;
    student: User;
  })[];
  showActions?: boolean;
  onStatusChange?: (bookingId: string, status: Booking['status']) => void;
  isLoading: boolean;
}

export function BookingsList({ 
  bookings, 
  showActions = false,
  onStatusChange,
  isLoading 
}: BookingsListProps) {
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-academy-amber">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-academy-blue">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-academy-green">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={showActions ? 7 : 6} className="text-center h-32">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 7 : 6} className="text-center h-32">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-xs">
                    {booking.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{booking.product.name}</TableCell>
                  <TableCell>
                    {booking.student.admissionNumber || booking.student.username || booking.student.email}
                  </TableCell>
                  <TableCell>{booking.quantity}</TableCell>
                  <TableCell>{formatDate(booking.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  {showActions && onStatusChange && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-academy-blue border-academy-blue hover:bg-academy-blue hover:text-white"
                              onClick={() => onStatusChange(booking.id, "confirmed")}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => onStatusChange(booking.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        
                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-academy-green border-academy-green hover:bg-academy-green hover:text-white"
                            onClick={() => onStatusChange(booking.id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {booking.status === "completed" && (
                          <span className="text-xs text-muted-foreground">Completed</span>
                        )}
                        
                        {booking.status === "cancelled" && (
                          <span className="text-xs text-muted-foreground">Cancelled</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
