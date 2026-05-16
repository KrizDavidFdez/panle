import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export function ServerSettings({ serverId }: { serverId: string }) {
  const [nodeVersion, setNodeVersion] = useState("20.x");
  const [startCommand, setStartCommand] = useState("npm start");
  const [dockerImage, setDockerImage] = useState("node:20-alpine");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Server Configuration</h2>
        <p className="text-muted-foreground mt-1">Configure runtime settings, environment, and startup commands for {serverId}.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          Runtime Environment
        </h3>
        
        <div className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-foreground mb-1">Docker Image</label>
             <input 
               type="text" 
               value={dockerImage}
               onChange={(e) => setDockerImage(e.target.value)}
               className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2"
               placeholder="e.g. node:20-alpine"
             />
             <p className="text-xs text-muted-foreground mt-1">The base Docker image used to run your application.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Node.js Version</label>
            <select 
              value={nodeVersion}
              onChange={(e) => setNodeVersion(e.target.value)}
              className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2"
            >
              <option value="18.x">Node.js 18.x (LTS)</option>
              <option value="20.x">Node.js 20.x (LTS)</option>
              <option value="22.x">Node.js 22.x (Current)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Start Command / Entry File</label>
            <input 
               type="text" 
               value={startCommand}
               onChange={(e) => setStartCommand(e.target.value)}
               className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 font-mono text-sm"
               placeholder="e.g. node index.js or npm start"
             />
             <p className="text-xs text-muted-foreground mt-1">The command used to start your bot, API, or web server.</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3 text-blue-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Changes to runtime settings will take effect upon the next container restart. Make sure your start command is valid.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
