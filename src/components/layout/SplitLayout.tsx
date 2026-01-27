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
      {/* Mobile Tabs Navigation */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-1 py-1 rounded-full shadow-2xl flex items-center gap-1 print:hidden">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === "edit"
              ? "bg-primary text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === "preview"
              ? "bg-primary text-white shadow-lg"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Eye className="w-4 h-4" />
          Vista Previa
        </button>
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
