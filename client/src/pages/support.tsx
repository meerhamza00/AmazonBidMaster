import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageSquare, 
  FileText,
  User,
  Building,
  Clock,
  AlertCircle,
  CheckCircle2,
  PanelRight,
  Video,
  Calendar,
  BookOpen,
  LifeBuoy
} from "lucide-react";

// FAQ items for the support page
const faqItems = [
  {
    question: "How do I import my Amazon Advertising data?",
    answer: "You can import your data in two ways: 1) Upload a CSV file from your Amazon Advertising console by clicking the 'Upload CSV' button on the Dashboard page, or 2) Connect directly to your Amazon Advertising account via the API integration in the Settings menu."
  },
  {
    question: "What should I do if my optimization rules aren't working?",
    answer: "First, check that your rules have the correct conditions and are properly activated. Then, verify that your campaign data is up-to-date. If rules still aren't working, ensure your conditions aren't too restrictive - you might need to broaden your criteria. For persistent issues, contact our support team with details of the specific rule configuration."
  },
  {
    question: "How often is my data refreshed?",
    answer: "If you're using CSV imports, data is only refreshed when you manually upload new files. If you've set up the API integration, data is refreshed according to your configured schedule (default is daily at midnight). You can change this schedule in Settings > Data Synchronization."
  },
  {
    question: "Can I export reports from the tool?",
    answer: "Yes, you can export data in multiple formats (CSV, PDF, or Excel) by clicking the Export button in the top-right corner of any data visualization or campaign table. You can customize which metrics to include and date ranges before exporting."
  },
  {
    question: "How do I reset my password?",
    answer: "Click on your profile icon in the top-right corner, select 'Account Settings', and then choose 'Change Password'. You'll need to enter your current password before setting a new one. If you've forgotten your password, use the 'Forgot Password' link on the login page."
  },
  {
    question: "What's the difference between ACoS and ROAS?",
    answer: "ACoS (Advertising Cost of Sale) is your ad spend divided by sales, expressed as a percentage. Lower ACoS indicates better performance. ROAS (Return on Ad Spend) is sales divided by ad spend, expressed as a ratio. Higher ROAS indicates better performance. For example, an ACoS of 25% equals a ROAS of 4.0."
  },
  {
    question: "How can I connect multiple Amazon accounts?",
    answer: "Go to Settings > Account Management > Add New Account. You'll need to provide API credentials for each Amazon Advertising account you want to connect. Once connected, you can switch between accounts using the account selector in the top navigation bar."
  },
  {
    question: "Is there a limit to how many campaigns I can manage?",
    answer: "The number of campaigns you can manage depends on your subscription plan. Free accounts can manage up to 10 campaigns, Professional accounts up to 100 campaigns, and Enterprise accounts have unlimited campaigns. You can view and upgrade your plan in Settings > Subscription."
  }
];

export default function Support() {
  const [activeTab, setActiveTab] = useState("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      alert("Support request submitted. We'll respond within 24 hours.");
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setPriority("medium");
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Support</h1>
        <p className="text-lg text-muted-foreground">
          Get help with your Amazon PPC Optimizer experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar with contact information */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LifeBuoy className="h-6 w-6 text-orange-500 mr-2" />
              Contact Options
            </CardTitle>
            <CardDescription>Multiple ways to reach our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm text-muted-foreground">
                  support@ecomhawks.com
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Response within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Phone Support</h3>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mon-Fri, 9am-5pm EST
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Available in dashboard
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Business hours only
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Schedule Consultation</h3>
                <Button variant="link" className="h-auto p-0 text-sm text-primary">
                  Book a 30-min session
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  1-on-1 expert guidance
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="rounded-lg bg-primary/5 p-4 w-full">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-medium">Support Hours</h3>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Monday - Friday: 9am - 8pm EST</p>
                <p>Saturday: 10am - 5pm EST</p>
                <p>Sunday: Closed</p>
                <p className="text-xs mt-2 italic">
                  Premium users have access to 24/7 emergency support
                </p>
              </div>
            </div>

            <div className="w-full">
              <h4 className="text-sm font-medium mb-2">Typical Response Times</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">5-10 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Live Chat:</span>
                  <span className="font-medium">2-5 minutes</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Main content area */}
        <div className="md:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact">
                <Mail className="h-4 w-4 mr-2" />
                Contact Form
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
              <TabsTrigger value="resources">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Contact Form Tab */}
            <TabsContent value="contact" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Request</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="name">
                          Name
                        </label>
                        <Input 
                          id="name"
                          placeholder="Your name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">
                          Email
                        </label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="your.email@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="subject">
                        Subject
                      </label>
                      <Input 
                        id="subject"
                        placeholder="Brief description of your issue" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Priority
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="priority-low" 
                            name="priority" 
                            value="low"
                            checked={priority === "low"}
                            onChange={() => setPriority("low")}
                            className="h-4 w-4 text-primary"
                          />
                          <label htmlFor="priority-low" className="text-sm">
                            Low - General question
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="priority-medium" 
                            name="priority" 
                            value="medium"
                            checked={priority === "medium"}
                            onChange={() => setPriority("medium")}
                            className="h-4 w-4 text-primary"
                          />
                          <label htmlFor="priority-medium" className="text-sm">
                            Medium - Issue
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="priority-high" 
                            name="priority" 
                            value="high"
                            checked={priority === "high"}
                            onChange={() => setPriority("high")}
                            className="h-4 w-4 text-primary"
                          />
                          <label htmlFor="priority-high" className="text-sm">
                            High - Critical
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="message">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
                        className="min-h-[120px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Please be as specific as possible to help us assist you faster.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Support Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions about the Amazon PPC Optimizer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {faqItems.map((item, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                          <p className="text-muted-foreground text-sm">{item.answer}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 mb-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-orange-500">Can't find what you're looking for?</h3>
                          <p className="text-sm mt-1 text-muted-foreground">
                            If you couldn't find the answer to your question, please submit a support request using our contact form or reach out through any of the contact methods listed.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-2" 
                            onClick={() => setActiveTab("contact")}
                          >
                            Go to Contact Form
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Support Resources</CardTitle>
                  <CardDescription>
                    Helpful guides, tutorials, and documentation to help you get the most out of your Amazon PPC Optimizer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Getting Started Guide */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <BookOpen className="h-5 w-5 text-orange-500 mr-2" />
                          Getting Started Guide
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Learn the basics of setting up your account, importing data, and navigating the interface.
                        </p>
                        <Button variant="outline" className="w-full">View Guide</Button>
                      </CardContent>
                    </Card>

                    {/* Video Tutorials */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Video className="h-5 w-5 text-orange-500 mr-2" />
                          Video Tutorials
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Watch step-by-step videos covering all aspects of the Amazon PPC Optimizer.
                        </p>
                        <Button variant="outline" className="w-full">View Tutorials</Button>
                      </CardContent>
                    </Card>

                    {/* Full Documentation */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="h-5 w-5 text-orange-500 mr-2" />
                          Documentation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Comprehensive technical documentation of all features and functionality.
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => window.location.href = '/documentation'}>View Documentation</Button>
                      </CardContent>
                    </Card>

                    {/* Knowledge Base */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <PanelRight className="h-5 w-5 text-orange-500 mr-2" />
                          Knowledge Base
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Browse our extensive collection of articles and solutions to common issues.
                        </p>
                        <Button variant="outline" className="w-full">View Knowledge Base</Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-medium">Support Status</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-500">All Systems Operational</h4>
                            <p className="text-sm mt-1 text-muted-foreground">
                              All services are running normally. 
                              <a href="#" className="text-primary ml-1">View system status</a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <Clock className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Average Response Time</h4>
                            <p className="text-sm mt-1 text-muted-foreground">
                              Current support queue: 2 hours 
                              <span className="text-green-500 ml-1">(below average)</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Support status information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Company</span>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="font-medium">Ecom Hawks</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Account Manager</span>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="font-medium">Meer Hamza</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Support Priority</span>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="font-medium">Normal (4hr SLA)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}