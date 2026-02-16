import React, { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Eye, Pencil } from "lucide-react";

interface SplitLayoutProps {
  controlPanelContent: ReactNode;
  liveCanvasContent: ReactNode;
}

export default function SplitLayout({
  controlPanelContent,
  liveCanvasContent,
}: SplitLayoutProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-col lg:flex-row print:block">
      {/* Mobile Tabs Navigation - Now floating and less intrusive. STRICTLY HIDDEN ON DESKTOP. */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-full shadow-2xl flex items-center gap-1 pointer-events-auto border border-slate-700/50">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "edit"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Pencil className="w-4 h-4" />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === "preview"
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Vista Previa</span>
          </button>
        </div>
      </div>

      {/* Left Panel - Control Panel Content */}
      <div
        className={`${activeTab === "edit" ? "block" : "hidden"} lg:block w-full lg:w-[40%] h-full overflow-hidden`}
      >
        {controlPanelContent}
      </div>

      {/* Right Panel - Live Canvas Content */}
      <main
        className={`${activeTab === "preview" ? "block" : "hidden"} lg:block flex-1 bg-slate-100/50 relative overflow-y-auto overflow-x-hidden flex flex-col print:overflow-visible print:h-auto print:bg-white`}
      >
        {liveCanvasContent}
      </main>
    </div>
  );
}
