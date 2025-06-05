import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from "lucide-react";

const StudentSupport = () => {
  const { profile, loading } = useAuth();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated and has student role
  if (!profile) {
    toast.error("You need to be logged in to access support");
    return <Navigate to="/auth" />;
  }
  
  if (profile.role !== 'student') {
    toast.error("You don't have permission to access student support");
    return <Navigate to="/" />;
  }

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    // Here you would implement real-time messaging
    toast.success("Message sent to support team");
    setMessage("");
  };

  const handleTicketSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    toast.success("Support ticket created successfully");
    setSubject("");
    setMessage("");
  };

  // Mock chat messages
  const chatMessages = [
    {
      id: 1,
      sender: "Support Team",
      message: "Hello! How can we help you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isSupport: true
    },
    {
      id: 2,
      sender: "You",
      message: "I'm having trouble with my booking. It shows as pending for 2 days now.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isSupport: false
    },
    {
      id: 3,
      sender: "Support Team",
      message: "I understand your concern. Let me check your booking status. Can you please provide your booking ID?",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isSupport: true
    }
  ];

  // Mock support tickets
  const supportTickets = [
    {
      id: "TKT-001",
      subject: "Booking Issue",
      status: "In Progress",
      priority: "Medium",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      lastReply: new Date(Date.now() - 1000 * 60 * 60 * 6)
    },
    {
      id: "TKT-002",
      subject: "Payment Problem",
      status: "Resolved",
      priority: "High",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      lastReply: new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Open': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Student Support</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Window */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-academy-blue" />
                  Live Chat with Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
                  <div className="space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isSupport ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.isSupport 
                            ? 'bg-white border' 
                            : 'bg-academy-blue text-white'
                        }`}>
                          <div className="flex items-center mb-1">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="text-xs">
                                {msg.isSupport ? 'ST' : 'ME'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{msg.sender}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="btn-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Chat Info */}
            <Card>
              <CardHeader>
                <CardTitle>Support Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Support team is online</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Average response time: 2-5 minutes</p>
                  <p>Support hours: 8:00 AM - 6:00 PM</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      View FAQ
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tickets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create New Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detailed description of your issue"
                    rows={4}
                  />
                </div>
                <Button onClick={handleTicketSubmit} className="w-full">
                  Create Ticket
                </Button>
              </CardContent>
            </Card>
            
            {/* Existing Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Your Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{ticket.subject}</h4>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>ID: {ticket.id}</span>
                        <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Created: {ticket.createdAt.toLocaleDateString()}</p>
                        <p>Last reply: {ticket.lastReply.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">How do I book a product?</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse products, select the one you want, choose quantity, and click "Book Now". 
                    You'll receive a confirmation email with pickup details.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">How long does it take for booking confirmation?</h4>
                  <p className="text-sm text-muted-foreground">
                    Most bookings are confirmed within 24 hours. You'll receive an email notification 
                    with your pickup code once confirmed.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Can I cancel my booking?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your booking before it's confirmed. Go to your bookings 
                    page and click "Cancel" next to the booking you want to cancel.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">What if I forgot my pickup code?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can find your pickup code in your bookings page or in the confirmation email. 
                    If you still can't find it, contact support.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">How do I leave a review?</h4>
                  <p className="text-sm text-muted-foreground">
                    After completing a booking, you can leave a review from your bookings page. 
                    Click "Leave Review" next to completed bookings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-academy-blue" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@mfa.edu</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-academy-blue" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+254 700 123 456</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-academy-blue" />
                  <div>
                    <p className="font-medium">Support Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Emergency Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    For urgent issues outside support hours, contact the security office at +254 700 999 888
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentSupport;
