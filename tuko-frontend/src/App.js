import Marketplace from "./pages/Marketplace";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Marketplace />
    </ThemeProvider>
  );
}
