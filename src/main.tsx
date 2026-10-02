import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LightboxProvider } from "./components/Lightbox/Lightbox";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/interactions.css";
import "./styles/infinite-grid.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LightboxProvider>
        <App />
      </LightboxProvider>
    </BrowserRouter>
  </StrictMode>
);
