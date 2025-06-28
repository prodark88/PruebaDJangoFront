import { createBrowserRouter, Outlet } from "react-router-dom";
import CRMDashboard from "./components/CRMDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DataLoader from "./components/LoadFakeData";
const Root = () => (
  <div className="flex flex-col min-h-screen">
    <Header /> 
   
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer /> 
  </div>

);


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Componente que es común en todas las rutas
    children: [
      {
        index: true,
        element: <CRMDashboard />, // Componente que aparece en la ruta raíz
      },
      {
        path: "load-data",
        element: <DataLoader/>, // Componente que aparece en la ruta raíz
      },
    ],
  },
]);