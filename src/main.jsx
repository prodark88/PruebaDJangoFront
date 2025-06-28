import "./App.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router.jsx"; // Asegúrate de que la ruta sea correcta
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
