import { useState } from "react";
import Editor from "@monaco-editor/react";
import { File, Folder, ChevronRight, ChevronDown, Download, Upload, Plus, Trash } from "lucide-react";
import { useThemeStore } from "../store";

const mockFileSystem = [
  { name: "src", type: "folder", children: [
    { name: "index.ts", type: "file", content: "console.log('Hello from Skyeb');" },
    { name: "utils.ts", type: "file", content: "export const add = (a: number, b: number) => a + b;" },
  ]},
  { name: "package.json", type: "file", content: '{\n  "name": "my-app",\n  "version": "1.0.0"\n}' },
  { name: ".env", type: "file", content: "PORT=3000\nDATABASE_URL=postgres://..." },
];

export function FileManager() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { theme } = useThemeStore();

  const isDarkMode = theme === "dark" || theme === "cyberpunk" || theme === "dracula" || theme === "ocean" || theme === "tokyo-night" || theme === "monokai" || theme === "solarized-dark";

  return (
    <div className="flex flex-col md:flex-row bg-card border border-border rounded-lg overflow-hidden h-full">
      {/* Sidebar / File Tree */}
      <div className="h-48 md:h-full w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card/50 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-border flex justify-between items-center bg-card flex-shrink-0">
          <span className="text-sm font-semibold">Explorer</span>
          <div className="flex gap-2">
            <button className="text-muted-foreground hover:text-foreground"><Plus className="w-4 h-4" /></button>
            <button className="text-muted-foreground hover:text-foreground"><Upload className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {mockFileSystem.map((item, idx) => (
            <div key={idx}>
              {item.type === "folder" ? (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-sm text-foreground hover:bg-secondary cursor-pointer rounded">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    <Folder className="w-4 h-4 text-blue-400" />
                    {item.name}
                  </div>
                  <div className="ml-4 border-l border-border pl-2 space-y-1">
                    {item.children?.map(child => (
                      <div 
                        key={child.name}
                        onClick={() => setSelectedFile(child)}
                        className={`flex items-center gap-1.5 px-2 py-1 text-sm cursor-pointer rounded ${selectedFile?.name === child.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                      >
                        <File className="w-4 h-4" />
                        {child.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setSelectedFile(item)}
                  className={`flex items-center gap-1.5 px-2 py-1 flex-1 text-sm cursor-pointer rounded ${selectedFile?.name === item.name ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  <File className="w-4 h-4" />
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedFile ? (
          <>
            <div className="h-10 border-b border-border bg-card flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <File className="w-4 h-4" />
                {selectedFile.name}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-secondary transition-colors" title="Delete">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage={selectedFile.name.endsWith('.ts') ? 'typescript' : selectedFile.name.endsWith('.json') ? 'json' : 'plaintext'}
                theme={isDarkMode ? 'vs-dark' : 'light'}
                value={selectedFile.content}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: { top: 16 },
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-4">
              <Folder className="w-16 h-16 mx-auto opacity-50" />
              <p>Select a file to edit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
