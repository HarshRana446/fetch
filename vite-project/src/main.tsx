import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ProductProvider } from "./context/productContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ProductProvider>
    <App />
  </ProductProvider>
);
