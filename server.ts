import express from "express";
import http from "http";
import { Server } from "socket.io";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";
import os from "os";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store active fake "servers" / processes
const activeServers = new Map<string, ChildProcessWithoutNullStreams>();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/servers", (req, res) => {
  // Mock servers for dashboard
  res.json([
    { id: "node-app-1", name: "Next.js Frontend", status: activeServers.has("node-app-1") ? "running" : "stopped", ram: "1.2GB / 2GB", cpu: "12%", type: "node" },
    { id: "python-api", name: "FastAPI Backend", status: activeServers.has("python-api") ? "running" : "stopped", ram: "400MB / 1GB", cpu: "2%", type: "python" },
    { id: "discord-bot", name: "JS Discord Bot", status: "running", ram: "120MB / 512MB", cpu: "1%", type: "bun" },
  ]);
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  let currentProcess: ChildProcessWithoutNullStreams | null = null;
  
  socket.on("attach", (serverId: string) => {
    // Basic pseudo-terminal using simple spawn bash
    // In a real Pterodactyl/Koyeb this would use docker attach or node-pty
    // For this environment we use bash and pipe stdin/stdout
    if (!activeServers.has(serverId)) {
      console.log(`Starting mock terminal for ${serverId}`);
      // Send fake startup sequence first
      socket.emit("terminal:data", `\x1b[1;36m[Skyeb System] Preparando entorno para ${serverId}...\x1b[0m\r\n`);
      socket.emit("terminal:data", `\x1b[1;33m[Node.js] Instalando dependencias (npm install)...\x1b[0m\r\n`);
      
      setTimeout(() => {
        if (!activeServers.has(serverId)) return;

        socket.emit("terminal:data", `\x1b[1;32m[Node.js] ✔ Dependencias instaladas correctamente en 2.4s.\x1b[0m\r\n`);
        socket.emit("terminal:data", `\x1b[1;36m[System] Iniciando el archivo principal del servidor...\x1b[0m\r\n`);
        
        setTimeout(() => {
          if (!activeServers.has(serverId)) return;

          socket.emit("terminal:data", `\x1b[1;32m[Server] ✔ Servidor ejecutandose y escuchando peticiones\x1b[0m\r\n\r\n`);
          
          // Start the actual interactive bash process after "startup"
          const proc = spawn("bash", ["--norc", "-i"], {
            env: { 
              ...process.env, 
              FORCE_COLOR: "1", 
              PS1: "\\[\\e[32;1m\\]✓\\[\\e[0m\\] \\[\\e[36;1m\\]skyeb\\[\\e[0m\\] \\[\\e[35;1m\\]⚡\\[\\e[0m\\] \\[\\e[34;1m\\]\\W\\[\\e[0m\\] \\$ " 
            },
            cwd: process.cwd()
          });
          
          activeServers.set(serverId, proc);
          currentProcess = proc;
          
          proc.stdout.on("data", (data) => {
            socket.emit("terminal:data", data.toString().replace(/\n/g, '\r\n'));
          });
          proc.stderr.on("data", (data) => {
            socket.emit("terminal:data", data.toString().replace(/\n/g, '\r\n'));
          });
          proc.on("close", (code) => {
            socket.emit("terminal:data", `\r\n\x1b[31m[Process exited with code ${code}]\x1b[0m\r\n`);
            activeServers.delete(serverId);
          });
        }, 1200);
      }, 2000);
      
      // Temporarily set a dummy to avoid multiple setups at the same time
      activeServers.set(serverId, {} as any);
      
    } else {
      currentProcess = activeServers.get(serverId) || null;
      socket.emit("terminal:data", `\x1b[36mReattached to ${serverId} container...\x1b[0m\r\n`);
      // Trigger a newline to redraw prompt
      if (currentProcess && !("isDummy" in currentProcess)) {
         currentProcess.stdin?.write('\n');
      }
    }
  });

  socket.on("terminal:write", (data: string) => {
    if (currentProcess && typeof currentProcess.killed !== 'undefined' && !currentProcess.killed) {
      currentProcess.stdin?.write(data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // We don't kill the process on disconnect to simulate persistent servers!
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, () => {
    console.log(`Skyeb Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
