
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, Star, User, Send, Filter, ArrowUpDown } from "lucide-react";

interface Feedback {
  id: string;
  productId: string;
  productName: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  isReplied: boolean;
  reply?: string;
}

const EnterpriseFeedback = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  
  // Sample feedback data
  const [feedback, setFeedback] = useState<Feedback[]>([
    {
      id: "1",
      productId: "p1",
      productName: "Scientific Calculator",
      studentId: "s1",
      studentName: "John Doe",
      rating: 5,
      comment: "The calculator was in excellent condition and worked perfectly for my exam. Very satisfied with this product.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isReplied: false
    },
    {
      id: "2",
      productId: "p2",
      productName: "School T-Shirt",
      studentId: "s2",
      studentName: "Mary Smith",
      rating: 4,
      comment: "Good quality shirt. The size was perfect. Just a bit expensive.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      isReplied: true,
      reply: "Thank you for your feedback! We're glad you liked the quality. We'll consider your comment about pricing for future stock."
    },
    {
      id: "3",
      productId: "p3",
      productName: "Chemistry Textbook",
      studentId: "s3",
      studentName: "David Johnson",
      rating: 3,
      comment: "The book has some highlighting from previous users, but it's still usable. Would be good to mention this in the description.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      isReplied: false
    },
    {
      id: "4",
      productId: "p4",
      productName: "Notebook Set",
      studentId: "s4",
      studentName: "Emma Williams",
      rating: 2,
      comment: "The notebooks were slightly damaged when I received them. Not very happy with the quality.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      isReplied: true,
      reply: "We're sorry to hear about your experience. Please contact us directly and we'll arrange a replacement set for you right away."
    }
  ]);
  
  const renderStarRating = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  const handleSendReply = (feedbackId: string) => {
    if (!replyText[feedbackId]?.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    
    setFeedback(prev => 
      prev.map(item => 
        item.id === feedbackId 
          ? { ...item, isReplied: true, reply: replyText[feedbackId] }
          : item
      )
    );
    
    // Clear the reply text
    setReplyText(prev => ({ ...prev, [feedbackId]: "" }));
    toast.success("Reply sent successfully");
  };
  
  // Filter and sort feedback
  const filteredFeedback = feedback
    .filter(item => {
      if (activeTab === "all") return true;
      if (activeTab === "unanswered") return !item.isReplied;
      if (activeTab === "answered") return item.isReplied;
      
      // Filter by rating
      if (activeTab === "positive") return item.rating >= 4;
      if (activeTab === "neutral") return item.rating === 3;
      if (activeTab === "negative") return item.rating <= 2;
      
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortOrder === "oldest") return a.createdAt.getTime() - b.createdAt.getTime();
      if (sortOrder === "highest") return b.rating - a.rating;
      if (sortOrder === "lowest") return a.rating - b.rating;
      return 0;
    });
  
  const unansweredCount = feedback.filter(item => !item.isReplied).length;
  
  return (
    <div className="academy-container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Customer Feedback</h1>
          {unansweredCount > 0 && (
            <Badge className="ml-2 bg-amber-500">{unansweredCount} unanswered</Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            <ArrowUpDown className="mr-1 h-4 w-4" />
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="unanswered">
              Unanswered
              {unansweredCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-amber-500 text-white inline-flex items-center justify-center text-xs">
                  {unansweredCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="answered">Answered</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="neutral">Neutral</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 font-medium text-lg">No feedback found</h3>
                <p className="text-muted-foreground mt-1">
                  {activeTab === "all" 
                    ? "You haven't received any feedback yet" 
                    : `No ${activeTab} feedback available`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFeedback.map((item) => (
                <Card key={item.id} className={!item.isReplied ? "border-amber-200 bg-amber-50" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-2 items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-academy-green text-white">
                            {item.studentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{item.productName}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {renderStarRating(item.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              by {item.studentName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.createdAt.toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm mb-4">{item.comment}</p>
                    
                    {item.isReplied && item.reply && (
                      <div className="bg-gray-50 p-3 rounded-md mt-3 border">
                        <div className="flex items-center mb-2">
                          <Badge variant="outline" className="bg-academy-green bg-opacity-10 text-academy-green">
                            Your Reply
                          </Badge>
                        </div>
                        <p className="text-sm">{item.reply}</p>
                      </div>
                    )}
                    
                    {!item.isReplied && (
                      <div className="mt-4">
                        <Textarea
                          placeholder="Write your reply here..."
                          value={replyText[item.id] || ""}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="mb-2"
                        />
                        <div className="flex justify-end">
                          <Button 
                            size="sm"
                            onClick={() => handleSendReply(item.id)}
                            disabled={!replyText[item.id]?.trim()}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnterpriseFeedback;
