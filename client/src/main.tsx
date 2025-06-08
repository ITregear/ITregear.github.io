// main.tsx
// Entry point for the React application. Mounts the App component to the DOM.

import { createRoot } from "react-dom/client"; // React 18+ root API
import App from "./App"; // Main App component
import "./index.css"; // Global styles

// Mount the App component to the root DOM node
createRoot(document.getElementById("root")!).render(<App />);
