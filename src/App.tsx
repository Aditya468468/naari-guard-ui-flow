
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import TrustCircle from "./pages/TrustCircle";
import PassiveListener from "./pages/PassiveListener";
import Settings from "./pages/Settings";
import Assistant from "./pages/Assistant";
import RoutePlanner from "./pages/RoutePlanner";
import SafetyReviews from "./pages/SafetyReviews";
import SafetyAnalytics from "./pages/SafetyAnalytics";
import Emergency from "./pages/Emergency";
import Calculator from "./pages/Calculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/trust-circle" element={<TrustCircle />} />
          <Route path="/passive-listener" element={<PassiveListener />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/route-planner" element={<RoutePlanner />} />
          <Route path="/safety-reviews" element={<SafetyReviews />} />
          <Route path="/safety-analytics" element={<SafetyAnalytics />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/calculator" element={<Calculator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
