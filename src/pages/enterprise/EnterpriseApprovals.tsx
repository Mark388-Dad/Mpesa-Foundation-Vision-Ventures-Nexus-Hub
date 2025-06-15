
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

const EnterpriseApprovals = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }

  if (!profile || profile.role !== 'enterprise') {
    return <Navigate to="/auth" />;
  }

  const approvals = [
    {
      id: "1",
      title: "Tech Fair 2024 Event Approval",
      type: "Event Proposal",
      status: "approved",
      submittedDate: "2024-01-15",
      approvedDate: "2024-01-18",
      documentUrl: "#"
    },
    {
      id: "2",
      title: "Audio Equipment Request",
      type: "Equipment Request",
      status: "approved",
      submittedDate: "2024-01-20",
      approvedDate: "2024-01-22",
      documentUrl: "#"
    },
    {
      id: "3",
      title: "Innovation Workshop Proposal",
      type: "Event Proposal",
      status: "pending",
      submittedDate: "2024-01-25",
      approvedDate: null,
      documentUrl: null
    },
    {
      id: "4",
      title: "Venue Setup Guidelines",
      type: "Facility Booking",
      status: "rejected",
      submittedDate: "2024-01-10",
      approvedDate: "2024-01-12",
      documentUrl: null
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="academy-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Download Approvals</h1>
        <p className="text-muted-foreground">Access your approved documents and certificates</p>
      </div>

      <div className="grid gap-6">
        {approvals.map((approval) => (
          <Card key={approval.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{approval.title}</CardTitle>
                  <p className="text-muted-foreground">{approval.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(approval.status)}
                  <Badge className={getStatusColor(approval.status)}>
                    {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-sm">{new Date(approval.submittedDate).toLocaleDateString()}</p>
                </div>
                {approval.approvedDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {approval.status === 'approved' ? 'Approved' : 'Processed'}
                    </p>
                    <p className="text-sm">{new Date(approval.approvedDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-sm">{approval.type}</p>
                </div>
              </div>
              
              {approval.status === 'approved' && approval.documentUrl && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              )}
              
              {approval.status === 'pending' && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Your request is currently under review. You'll receive an email once it's processed.
                  </p>
                </div>
              )}
              
              {approval.status === 'rejected' && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    This request was not approved. Please contact the administration for more details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnterpriseApprovals;
