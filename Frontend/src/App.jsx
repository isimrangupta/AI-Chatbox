import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoute from "./routes/AppRoute";
import "./styles/global.css";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoute />
      </AuthProvider>
    </ThemeProvider>
  );
}