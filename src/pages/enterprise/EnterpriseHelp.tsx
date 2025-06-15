
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, BookOpen, MessageSquare, Phone } from "lucide-react";

const EnterpriseHelp = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }

  if (!profile || profile.role !== 'enterprise') {
    return <Navigate to="/auth" />;
  }

  const faqs = [
    {
      id: "booking-process",
      question: "How do I book school facilities for my event?",
      answer: "To book school facilities, navigate to 'Book School Facilities' from the sidebar. Select your desired facility, choose the date and time, and submit your request. The administration will review and approve your booking within 2-3 business days."
    },
    {
      id: "equipment-request",
      question: "What equipment can I request for my event?",
      answer: "You can request various equipment including audio/visual equipment, chairs, tables, staging equipment, and technical support. Submit your equipment list through the 'Request Equipment' section with detailed specifications and quantities needed."
    },
    {
      id: "document-upload",
      question: "What documents do I need to upload for event approval?",
      answer: "Required documents typically include: event proposal, safety plan, equipment list, attendee estimate, and insurance documentation (if applicable). Upload all documents through the 'Upload Documents' section."
    },
    {
      id: "approval-timeline",
      question: "How long does the approval process take?",
      answer: "Standard approvals take 3-5 business days. Complex events requiring special permissions may take up to 10 business days. You'll receive email notifications at each stage of the approval process."
    },
    {
      id: "modification-policy",
      question: "Can I modify my booking after approval?",
      answer: "Minor modifications can be made up to 48 hours before your event. Major changes require resubmission of your request. Contact the events coordinator through the messaging system for assistance."
    },
    {
      id: "cancellation-policy",
      question: "What is the cancellation policy?",
      answer: "Cancellations must be made at least 72 hours before the event. Late cancellations may incur fees. Emergency cancellations are reviewed on a case-by-case basis."
    }
  ];

  return (
    <div className="academy-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Help & Instructions</h1>
        <p className="text-muted-foreground">Find answers to common questions and learn how to use the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Help Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Guides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium text-sm">Booking Process</h4>
                <p className="text-xs text-muted-foreground">Step-by-step facility booking guide</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium text-sm">Document Requirements</h4>
                <p className="text-xs text-muted-foreground">What documents you need to submit</p>
              </div>
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium text-sm">Equipment Guidelines</h4>
                <p className="text-xs text-muted-foreground">Available equipment and request process</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Need More Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm text-blue-900">Message Coordinator</span>
                </div>
                <p className="text-xs text-blue-700">Get direct help from our events team</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-sm text-green-900">Contact Admin</span>
                </div>
                <p className="text-xs text-green-700">Speak with administration directly</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseHelp;
