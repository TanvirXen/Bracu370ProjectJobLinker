import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import Employers from "./pages/Employers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileUpdate from "./pages/ProfileUpdate";
import { useState } from "react";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/components/Dashboard";
import InterviewsPage from "@/pages/InterviewsPage";
import ReviewsPage from "@/pages/ReviewsPage";

const App = () => {
  // Create a client instance in the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <ProtectedRoute allowedRoles={["candidate"]}>
                      <Jobs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employers"
                  element={
                    <ProtectedRoute allowedRoles={["employer"]}>
                      <Employers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/update"
                  element={
                    <ProtectedRoute>
                      <ProfileUpdate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interviews"
                  element={
                    <ProtectedRoute>
                      <InterviewsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute>
                      <ReviewsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/job/:id" element={<JobDetail />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
