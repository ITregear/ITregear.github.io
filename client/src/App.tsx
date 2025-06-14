// App.tsx
// Main entry point for the React client application. Sets up global providers and routing.

import { Switch, Route } from "wouter"; // Lightweight router for React
import { queryClient } from "./lib/queryClient"; // React Query client instance
import { QueryClientProvider } from "@tanstack/react-query"; // Provider for React Query
import { Toaster } from "@/components/ui/toaster"; // Global toast notifications
import { TooltipProvider } from "@/components/ui/tooltip"; // Tooltip context provider
import Home from "@/pages/home"; // Home page component
import NotFound from "@/pages/not-found"; // 404 page component

// Router component: defines the main application routes
function Router() {
  return (
    <Switch>
      {/* Home route */}
      <Route path="/" component={Home} />
      {/* Catch-all route for 404s */}
      <Route component={NotFound} />
    </Switch>
  );
}

// App component: wraps the app in global providers and renders the router
function App() {
  return (
    // React Query provider for server state management
    <QueryClientProvider client={queryClient}>
      {/* Tooltip provider for consistent tooltips throughout the app */}
      <TooltipProvider>
        {/* Global toast notification system */}
        <Toaster />
        {/* Main app content, ensures footer sticks to bottom */}
        <div style={{ position: 'relative', minHeight: '100vh' }}>
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
