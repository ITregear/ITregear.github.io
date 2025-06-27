// main.tsx
// Entry point for the React application. Mounts the App component to the DOM.

import { createRoot } from "react-dom/client"; // React 18+ root API
import App from "./App"; // Main App component
import "./index.css"; // Global styles
import { PostHogProvider } from "posthog-js/react";

// Mount the App component to the root DOM node with PostHog integration
createRoot(document.getElementById("root")!).render(
  <PostHogProvider
    apiKey={String(import.meta.env.VITE_POSTHOG_API_KEY)}
    options={{
      api_host: String(import.meta.env.VITE_POSTHOG_HOST),
      capture_exceptions: true, // enable Error Tracking
      debug: import.meta.env.MODE === "development",
    }}
  >
    <App />
  </PostHogProvider>
);