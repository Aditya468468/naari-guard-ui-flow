
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./components/auth/AuthProvider";
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
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/trust-circle" element={<RequireAuth><TrustCircle /></RequireAuth>} />
            <Route path="/passive-listener" element={<RequireAuth><PassiveListener /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="/assistant" element={<RequireAuth><Assistant /></RequireAuth>} />
            <Route path="/route-planner" element={<RequireAuth><RoutePlanner /></RequireAuth>} />
            <Route path="/safety-reviews" element={<RequireAuth><SafetyReviews /></RequireAuth>} />
            <Route path="/safety-analytics" element={<RequireAuth><SafetyAnalytics /></RequireAuth>} />
            <Route path="/emergency" element={<RequireAuth><Emergency /></RequireAuth>} />
            <Route path="/calculator" element={<RequireAuth><Calculator /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
