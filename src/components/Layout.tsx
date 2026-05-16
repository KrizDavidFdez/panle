import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Server, Users, Terminal, Database, Cloud, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(() => {
    return localStorage.getItem('skyeb-sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('skyeb-sidebar-collapsed', desktopSidebarCollapsed.toString());
  }, [desktopSidebarCollapsed]);

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Deployments", href: "/deployments", icon: Cloud },
    { name: "Databases", href: "/databases", icon: Database },
    { name: "Team", href: "/team", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Header Overlay */}
      <div className="md:hidden flex items-center justify-between h-14 border-b border-border px-4 bg-card fixed top-0 w-full z-20">
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <Server className="w-5 h-5 text-primary" />
          <span>Skyeb</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground p-1 relative z-50">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar background overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative z-40 h-full border-r border-border bg-card flex flex-col transition-all duration-300 md:translate-x-0 shrink-0",
        mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
        desktopSidebarCollapsed ? "md:w-16" : "md:w-64",
        !mobileMenuOpen && !desktopSidebarCollapsed && "w-64" // fallback
      )}>
        <div className="h-14 md:h-16 flex items-center px-4 border-b border-border shrink-0 font-bold text-lg md:text-xl tracking-tight justify-between overflow-hidden">
          <div className={cn("flex items-center gap-2 text-primary transition-all duration-300", desktopSidebarCollapsed ? "w-0 opacity-0 md:opacity-0" : "opacity-100")}>
            <Server className="w-6 h-6 text-primary shrink-0" />
            <span className={cn(desktopSidebarCollapsed ? "md:hidden" : "")}>Skyeb</span>
          </div>
          {desktopSidebarCollapsed && (
            <Server className="hidden md:block w-6 h-6 text-primary shrink-0 mx-auto" />
          )}
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground relative z-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-4 md:py-6 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                title={desktopSidebarCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                  desktopSidebarCollapsed ? "md:justify-center md:px-0" : "gap-3",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span className={cn("transition-all duration-300 truncate", desktopSidebarCollapsed ? "md:hidden" : "")}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-border shrink-0 flex flex-col gap-2">
          <button 
            title={desktopSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)} 
            className="hidden md:flex items-center justify-center w-full py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors cursor-pointer relative z-50"
          >
            {desktopSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          
          <div className={cn("flex items-center gap-3", desktopSidebarCollapsed ? "md:justify-center" : "")}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
              U
            </div>
            <div className={cn("flex flex-col min-w-0 transition-opacity duration-300", desktopSidebarCollapsed ? "md:hidden md:opacity-0 md:w-0" : "opacity-100")}>
              <span className="text-sm font-medium text-foreground truncate block">User Admin</span>
              <span className="text-xs text-muted-foreground truncate block">Admin Pro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 pt-14 md:pt-0 flex flex-col w-full h-full relative z-0">
        {children}
      </main>
    </div>
  );
}
