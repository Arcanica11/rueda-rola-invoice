import ControlPanel from "../invoice/ControlPanel";
import LiveCanvas from "../invoice/LiveCanvas";

interface SplitLayoutProps {
  controlPanelContent: React.ReactNode;
  liveCanvasContent: React.ReactNode;
}

export default function SplitLayout({
  controlPanelContent,
  liveCanvasContent,
}: SplitLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-background android-keyboard-adjust">
      <ControlPanel>{controlPanelContent}</ControlPanel>
      <LiveCanvas>{liveCanvasContent}</LiveCanvas>
    </div>
  );
}
