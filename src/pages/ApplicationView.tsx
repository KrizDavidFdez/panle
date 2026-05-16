import { Link, Route, Routes, useParams, useLocation } from "react-router-dom";
import { TerminalConsole } from "../components/Terminal";
import { FileManager } from "../components/FileManager";
import { ServerSettings } from "../components/ServerSettings";
import { Terminal, Folder, Settings as SettingsIcon, Play, Square, RotateCw, Activity } from "lucide-react";
import { cn } from "../lib/utils";

export function ApplicationView() {
  const { id } = useParams();
  const location = useLocation();

  const tabs = [
    { name: "Terminal", path: "", icon: Terminal },
    { name: "Files", path: "/files", icon: Folder },
    { name: "Metrics", path: "/metrics", icon: Activity },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-card border-b border-border p-6 flex flex-col gap-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">{id}</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="truncate">Running on Koyeb</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md font-medium hover:bg-secondary/80 transition-colors text-sm">
              <RotateCw className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Restart</span>
            </button>
            <button className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-md font-medium hover:bg-destructive/20 transition-colors text-sm">
              <Square className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Stop</span>
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border no-scrollbar pb-px">
          {tabs.map((tab) => {
            const isActive = location.pathname === `/app/${id}${tab.path}` || (tab.path === "" && location.pathname === `/app/${id}`);
            return (
              <Link
                key={tab.name}
                to={`/app/${id}${tab.path}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6">
        <Routes>
          <Route path="/" element={<div className="h-full max-w-6xl mx-auto"><TerminalConsole serverId={id || "unknown"} /></div>} />
          <Route path="/files" element={<div className="h-full max-w-6xl mx-auto"><FileManager /></div>} />
          <Route path="/metrics" element={<div className="flex items-center justify-center text-muted-foreground h-full border border-dashed rounded-lg">Metrics coming soon</div>} />
          <Route path="/settings" element={<div className="h-full overflow-y-auto"><ServerSettings serverId={id || "unknown"} /></div>} />
        </Routes>
      </div>
    </div>
  );
}
