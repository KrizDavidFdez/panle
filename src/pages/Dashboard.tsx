import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Plus, Server, Box, Cpu, HardDrive, Search } from "lucide-react";
import { cn } from "../lib/utils";

interface AppServer {
  id: string;
  name: string;
  status: string;
  ram: string;
  cpu: string;
  type: string;
}

export function Dashboard() {
  const [servers, setServers] = useState<AppServer[]>([]);

  useEffect(() => {
    fetch("/api/servers")
      .then(res => res.json())
      .then(data => setServers(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your cloud deployments</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          New Deployment
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {servers.map((server) => (
          <Link
            key={server.id}
            to={`/app/${server.id}`}
            className="block group"
          >
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center border border-border shrink-0">
                    <Box className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {server.name}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-mono bg-secondary text-secondary-foreground px-2 py-0.5 rounded shrink-0">
                        {server.type.toUpperCase()}
                      </span>
                      <span 
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline cursor-pointer truncate"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://${server.id}.skyeb.app`, '_blank');
                        }}
                      >
                        {server.id}.skyeb.app
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto pt-4 md:pt-0 border-t border-border/50 md:border-0 relative z-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Cpu className="w-4 h-4" />
                      <span>{server.cpu}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HardDrive className="w-4 h-4" />
                      <span>{server.ram}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={cn(
                      "flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border",
                      server.status === "running" 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        server.status === "running" ? "bg-green-500" : "bg-red-500"
                      )} />
                      {server.status === "running" ? "Running" : "Stopped"}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Deploy: 2m ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {servers.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No projects found</h3>
            <p className="text-muted-foreground mt-1">Get started by creating a new deployment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
