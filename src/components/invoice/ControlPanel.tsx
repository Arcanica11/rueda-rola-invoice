export default function ControlPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:w-[40%] h-full overflow-y-auto bg-background/80 backdrop-blur-xl border-r border-border p-6 lg:p-10 print:hidden">
      <div className="max-w-xl mx-auto space-y-8">{children}</div>
    </div>
  );
}
