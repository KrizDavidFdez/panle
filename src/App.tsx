import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ApplicationView } from "./pages/ApplicationView";
import { Settings } from "./pages/Settings";
import { useCallback, useEffect } from "react";
import { useThemeStore } from "./store";

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.className = ""; // clear all
    root.classList.add(`theme-${theme}`);
    if (theme === "dark" || theme === "cyberpunk" || theme === "dracula" || theme === "ocean" || theme === "tokyo-night" || theme === "monokai" || theme === "solarized-dark" || theme === "technical-dashboard") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/app/:id/*" element={<ApplicationView />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
