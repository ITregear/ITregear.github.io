// main.tsx
// Entry point for the React application. Mounts the App component to the DOM.

import { createRoot } from "react-dom/client"; // React 18+ root API
import App from "./App"; // Main App component
import "./index.css"; // Global styles
import { PostHogProvider } from "posthog-js/react";

// Mount the App component to the root DOM node with PostHog integration
const posthogApiKey = import.meta.env.VITE_POSTHOG_API_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

// Only render PostHog provider if API key is available
if (posthogApiKey) {
  createRoot(document.getElementById("root")!).render(
    <PostHogProvider
      apiKey={String(posthogApiKey)}
      options={{
        api_host: String(posthogHost),
        defaults: '2025-05-24',
        capture_exceptions: true, // enable Error Tracking
        debug: import.meta.env.MODE === "development",
      }}
    >
      <App />
    </PostHogProvider>
  );
} else {
  // Render without PostHog if no API key is provided
  createRoot(document.getElementById("root")!).render(<App />);
}
