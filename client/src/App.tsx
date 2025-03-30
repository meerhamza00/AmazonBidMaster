import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Dashboard from "@/pages/dashboard";
import Rules from "@/pages/rules";
import Documentation from "@/pages/documentation";
import Support from "@/pages/support";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NotFound from "@/pages/not-found";
import PpcExpertChatbot from "@/components/ppc-expert-chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/rules" component={Rules} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/support" component={Support} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Router />
        </main>
        <Footer />
        <PpcExpertChatbot />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
