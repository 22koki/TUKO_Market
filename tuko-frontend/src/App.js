import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import VendorDashboard from "./pages/VendorDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

export default function App(){
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Marketplace/>}/>
            <Route path="/vendor" element={<VendorDashboard/>}/>
            <Route path="/rider" element={<RiderDashboard/>}/>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
