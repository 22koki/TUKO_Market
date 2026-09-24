import Marketplace from "./pages/Marketplace";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
export default function App(){return <ThemeProvider><CartProvider><Marketplace/></CartProvider></ThemeProvider>}
