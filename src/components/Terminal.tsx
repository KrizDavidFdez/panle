import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { io, Socket } from "socket.io-client";
import "xterm/css/xterm.css";
import { useThemeStore } from "../store";

export function TerminalConsole({ serverId }: { serverId: string }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { terminalStyle } = useThemeStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: terminalStyle.fontFamily,
      fontSize: terminalStyle.fontSize,
      theme: {
        background: "transparent",
      },
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    let isDisposed = false;

    const handleResize = () => {
      if (isDisposed) return;
      // We wrap the fit call in a timeout to ensure React/Browser has finished painting
      // and xterm._core._renderService is fully initialized.
      setTimeout(() => {
        if (isDisposed) return;
        try {
          if (
            terminalRef.current && 
            terminalRef.current.clientWidth > 0 && 
            terminalRef.current.clientHeight > 0 &&
            term.element && 
            term.element.isConnected
          ) {
            const core = (term as any)._core;
            if (core && core._renderService && core._renderService.dimensions) {
              fitAddon.fit();
            }
          }
        } catch (e) {
          // Ignore xterm internal errors during render/fit (e.g., dimensions undefined)
        }
      }, 50);
    };

    // Initial fit
    const timeout = setTimeout(() => {
      handleResize();
    }, 100);

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    // Socket io connection
    const currentProtocol = window.location.protocol;
    const socketUrl = `${currentProtocol}//${window.location.host}`;
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("attach", serverId);
    });

    socket.on("terminal:data", (data: string) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit("terminal:write", data);
    });

    return () => {
      isDisposed = true;
      clearTimeout(timeout);
      observer.disconnect();
      socket.disconnect();
      term.dispose();
    };
  }, [serverId, terminalStyle.fontFamily, terminalStyle.fontSize]);

  return (
    <div 
      className={`w-full h-full rounded-lg overflow-hidden border border-border p-4 relative terminal-container`}
      style={{
        backgroundImage: terminalStyle.backgroundImage ? `url(${terminalStyle.backgroundImage})` : "none",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundColor: `hsl(var(--background) / ${terminalStyle.backgroundOpacity})`,
          backdropFilter: terminalStyle.blur ? "blur(12px)" : "none",
        }}
      />
      <div className="w-full h-full relative z-10" ref={terminalRef} />
    </div>
  );
}
