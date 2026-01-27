import React, { ReactNode } from "react";

interface SplitLayoutProps {
  controlPanelContent: ReactNode;
  liveCanvasContent: ReactNode;
}

export default function SplitLayout({
  controlPanelContent,
  liveCanvasContent,
}: SplitLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-col lg:flex-row print:block">
      {/* Left Panel - Control Panel Content */}
      {controlPanelContent}

      {/* Right Panel - Live Canvas Content */}
      <main className="flex-1 bg-slate-100/50 relative overflow-y-auto overflow-x-hidden flex flex-col print:overflow-visible print:h-auto print:bg-white">
        {liveCanvasContent}
      </main>
    </div>
  );
}
