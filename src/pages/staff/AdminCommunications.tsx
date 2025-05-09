
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Clock, 
  User, 
  Paperclip,
  Search,
  Trash,
  Archive,
  ChevronRight,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  from: {
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
  date: Date;
}

const AdminCommunications = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  // Email form state
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  
  // Sample messages data
  const messages: Message[] = [
    {
      id: "1",
      from: { name: "John Doe", email: "john.doe@mfa.edu", role: "Student" },
      subject: "Question about booking process",
      content: "Hello,\n\nI'm having trouble with the booking process. When I try to book a calculator, I get an error message. Could you help me with this issue?\n\nThanks,\nJohn",
      isRead: false,
      date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: "2",
      from: { name: "Mary Smith", email: "mary.smith@mfa.edu", role: "Enterprise Owner" },
      subject: "Product approval request",
      content: "Hi Admin Team,\n\nI've submitted a new product for approval but it's been pending for 3 days. Could you please check the status?\n\nRegards,\nMary Smith\nTech Hub Enterprise",
      isRead: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
    },
    {
      id: "3",
      from: { name: "David Johnson", email: "david.j@mfa.edu", role: "Enterprise Owner" },
      subject: "Weekly sales report issue",
      content: "Dear Admin,\n\nThe weekly sales report for my enterprise seems to be showing incorrect data. The total revenue doesn't match my records. Can we schedule a call to discuss this?\n\nThank you,\nDavid Johnson\nSchool Store",
      isRead: false,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      id: "4",
      from: { name: "System Notification", email: "system@mfa.edu", role: "System" },
      subject: "Database backup completed",
      content: "Automatic database backup completed successfully on " + new Date().toLocaleDateString() + ".",
      isRead: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
    }
  ];
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Email sent successfully");
      
      // Reset form
      setEmailData({
        to: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read
    if (!message.isRead) {
      // In a real app, you would update the message status in the database
    }
  };
  
  // Filter messages based on search query
  const filteredMessages = messages.filter(message => 
    searchQuery === "" || 
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.from.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const unreadCount = messages.filter(message => !message.isRead).length;
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="academy-container py-8">
      <h1 className="text-2xl font-bold mb-6">Communications</h1>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="inbox">
            Inbox
            {unreadCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-academy-blue text-white inline-flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="compose">Compose Email</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Messages List */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Messages</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Archive">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="mt-2 text-muted-foreground">No messages found</p>
                    </div>
                  ) : (
                    filteredMessages.map(message => (
                      <div 
                        key={message.id}
                        className={`
                          p-3 border rounded-md cursor-pointer hover:bg-gray-50
                          ${selectedMessage?.id === message.id ? 'border-academy-blue bg-blue-50' : ''}
                          ${!message.isRead ? 'border-l-4 border-l-academy-blue' : ''}
                        `}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className="bg-academy-blue text-white text-xs">
                                {message.from.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className={`text-sm font-medium ${!message.isRead ? 'font-semibold' : ''}`}>
                                {message.from.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{message.from.role}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center">
                            {formatDate(message.date)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className={`text-sm ${!message.isRead ? 'font-semibold' : ''}`}>
                            {message.subject}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Message View */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>
                  {selectedMessage ? selectedMessage.subject : "Select a message"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMessage ? (
                  <div>
                    {/* Message header */}
                    <div className="flex justify-between items-start border-b pb-4 mb-4">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-academy-blue text-white">
                            {selectedMessage.from.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedMessage.from.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedMessage.from.email}</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatDate(selectedMessage.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="btn-primary">
                          <Mail className="mr-1 h-4 w-4" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Message content */}
                    <div className="whitespace-pre-wrap">{selectedMessage.content}</div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mt-4 text-lg font-medium">No message selected</h3>
                    <p className="text-muted-foreground mt-1">
                      Select a message from the list to view its contents
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
              <CardDescription>
                Send emails to students, enterprise owners, or staff members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  name="to"
                  value={emailData.to}
                  onChange={handleEmailChange}
                  placeholder="Enter email address or select recipient"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setEmailData(prev => ({ ...prev, to: "all-students@mfa.edu" }))}
                  >
                    <User className="mr-1 h-3 w-3" />
                    All Students
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setEmailData(prev => ({ ...prev, to: "all-enterprises@mfa.edu" }))}
                  >
                    <User className="mr-1 h-3 w-3" />
                    All Enterprises
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setEmailData(prev => ({ ...prev, to: "staff@mfa.edu" }))}
                  >
                    <User className="mr-1 h-3 w-3" />
                    Staff Members
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailChange}
                  placeholder="Enter email subject"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={emailData.message}
                  onChange={handleEmailChange}
                  placeholder="Write your message here..."
                  rows={8}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="outline" className="flex items-center">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach Files
                </Button>
                
                <div className="space-x-2">
                  <Button variant="outline">Save Draft</Button>
                  <Button 
                    onClick={handleSendEmail}
                    disabled={isSending || !emailData.to || !emailData.subject || !emailData.message}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Create and manage reusable email templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Template items */}
                {["Welcome Email", "Booking Confirmation", "Product Approval", "Low Stock Alert"].map((template, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{template}</h4>
                      <p className="text-sm text-muted-foreground">
                        {`Template for ${template.toLowerCase()} messages`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button className="w-full mt-4">
                  Create New Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommunications;
