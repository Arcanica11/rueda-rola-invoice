export default function Watermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <img
        src="/imagenes/slogan.png"
        alt="Watermark"
        className="w-[80%] opacity-[0.04] object-contain"
        style={{ transform: "rotate(-15deg)" }}
      />
    </div>
  );
}
