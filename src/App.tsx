// App.tsx
// Main entry point for the React client application. Sets up global providers and routing.

import { Switch, Route, useLocation } from "wouter"; // Lightweight router for React
import { queryClient } from "./lib/queryClient"; // React Query client instance
import { QueryClientProvider } from "@tanstack/react-query"; // Provider for React Query
import { Toaster } from "@/components/ui/toaster"; // Global toast notifications
import { TooltipProvider } from "@/components/ui/tooltip"; // Tooltip context provider
import { HelmetProvider } from 'react-helmet-async';
import Home from "@/pages/home"; // Home page component
import NotFound from "@/pages/not-found"; // 404 page component
import Thoughts from "@/pages/thoughts";
import Article from "@/pages/article";

import { useEffect } from "react";
import posthog from "posthog-js";

// Router component: defines the main application routes
function Router() {
  return (
    <Switch>
      {/* Home route */}
      <Route path="/" component={Home} />
      <Route path="/thoughts" component={Thoughts} />
      <Route path="/thoughts/:slug" component={Article} />

      {/* Catch-all route for 404s */}
      <Route component={NotFound} />
    </Switch>
  );
}

// App component: wraps the app in global providers and renders the router
function App() {
  const [location] = useLocation();
  useEffect(() => {
    // Only track pageviews if PostHog is initialized
    if (typeof window !== 'undefined' && (window as any).posthog) {
      posthog.capture("$pageview");
    }
  }, [location]);
  return (
    // React Query provider for server state management
    <QueryClientProvider client={queryClient}>
      {/* Helmet provider for meta tag management */}
      <HelmetProvider>
        {/* Tooltip provider for consistent tooltips throughout the app */}
        <TooltipProvider>
          {/* Global toast notification system */}
          <Toaster />
          {/* Main app content, ensures footer sticks to bottom */}
          <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Router />
          </div>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
