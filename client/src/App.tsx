import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Quote from "@/pages/Quote";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Career from "@/pages/Career";
import AdminDashboard from "@/pages/Admin";
import Login from "@/pages/Login";
// reverted: service/project detail pages for legacy version
import ServiceDetail from "@/pages/ServiceDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";
import ReturnPolicy from "@/pages/legal/ReturnPolicy";
import Disclaimer from "@/pages/legal/Disclaimer";
import PaymentPolicy from "@/pages/legal/PaymentPolicy";
// reverted: develop tool route for legacy version

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/services/:id" component={ServiceDetail} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio/:id" component={ProjectDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/quote" component={Quote} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/career" component={Career} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/payment-policy" component={PaymentPolicy} />
      {/* legacy: no develop tool route */}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
