export default function Watermark() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/imagenes/LOGO-RuedaLaRola.png"
        alt="Watermark"
        className="w-[80%] opacity-[0.04] object-contain"
        style={{ transform: "rotate(-15deg)" }}
      />
    </div>
  );
}
