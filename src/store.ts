import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "cyberpunk" | "dracula" | "ocean" | "vercel-light" | "tokyo-night" | "monokai" | "solarized-dark" | "technical-dashboard";

interface ThemeState {
  theme: Theme;
  terminalStyle: {
    fontFamily: string;
    fontSize: number;
    backgroundOpacity: number;
    blur: boolean;
    backgroundImage?: string;
  };
  setTheme: (theme: Theme) => void;
  updateTerminalStyle: (style: Partial<ThemeState["terminalStyle"]>) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      terminalStyle: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 14,
        backgroundOpacity: 0.3,
        blur: false,
      },
      setTheme: (theme) => set({ theme }),
      updateTerminalStyle: (style) => set((state) => ({ terminalStyle: { ...state.terminalStyle, ...style } })),
    }),
    {
      name: "skyeb-theme",
    }
  )
);
