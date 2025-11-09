import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

(window as any).global = window;

createRoot(document.getElementById("root")!).render(<App />);
