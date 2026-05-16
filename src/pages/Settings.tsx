import { useThemeStore, Theme } from "../store";

const themes: { id: Theme; name: string }[] = [
  { id: "dark", name: "Modern Dark (Vercel)" },
  { id: "vercel-light", name: "Modern Light" },
  { id: "cyberpunk", name: "Cyberpunk 2077" },
  { id: "dracula", name: "Dracula" },
  { id: "ocean", name: "Deep Ocean" },
  { id: "tokyo-night", name: "Tokyo Night" },
  { id: "monokai", name: "Monokai" },
  { id: "solarized-dark", name: "Solarized Dark" },
  { id: "technical-dashboard", name: "Technical Dashboard" },
];

export function Settings() {
  const { theme, setTheme, terminalStyle, updateTerminalStyle } = useThemeStore();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Preferences</h1>
        <p className="text-muted-foreground mt-1 text-sm">Customize your Skyeb experience and terminal visual styles.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 flex flex-col">
        <h2 className="text-xl font-semibold text-foreground">Platform Theme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-start p-4 rounded-lg border-2 text-left transition-all ${
                theme === t.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <span className="font-medium text-foreground">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6 flex flex-col">
        <h2 className="text-xl font-semibold text-foreground">Terminal Customization</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Font Family</label>
              <select 
                value={terminalStyle.fontFamily}
                onChange={(e) => updateTerminalStyle({ fontFamily: e.target.value })}
                className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2"
              >
                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                <option value="'Fira Code', monospace">Fira Code</option>
                <option value="Consolas, monospace">Consolas</option>
                <option value="ui-monospace, monospace">System Mono</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Font Size ({terminalStyle.fontSize}px)</label>
              <input 
                type="range" min="10" max="24" 
                value={terminalStyle.fontSize} 
                onChange={(e) => updateTerminalStyle({ fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Background Opacity ({Math.round(terminalStyle.backgroundOpacity * 100)}%)</label>
              <input 
                type="range" min="0" max="100" 
                value={terminalStyle.backgroundOpacity * 100} 
                onChange={(e) => updateTerminalStyle({ backgroundOpacity: parseInt(e.target.value) / 100 })}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mt-8">
              <input 
                type="checkbox" 
                id="blur"
                checked={terminalStyle.blur}
                onChange={(e) => updateTerminalStyle({ blur: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="blur" className="text-sm font-medium text-foreground">Enable Backdrop Blur (Glassmorphism)</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Custom Background Image URL</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={terminalStyle.backgroundImage || ""} 
                onChange={(e) => updateTerminalStyle({ backgroundImage: e.target.value })}
                className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty for solid/transparent colors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

