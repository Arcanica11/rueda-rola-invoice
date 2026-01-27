import { InvoiceData } from "@/types/invoice";

export default function InvoiceHeader({ data }: { data: InvoiceData }) {
  return (
    <div className="flex justify-between items-start mb-12 relative z-10">
      {/* Brand Identity */}
      <div className="space-y-2">
        <img
          src="/imagenes/LOGO-RuedaLaRola.png"
          alt="Rueda La Rola"
          className="w-auto h-24 object-contain"
        />
        <div className="mt-4">
          <h2 className="font-bold text-slate-900 text-lg">
            Rueda Rola Invoice
          </h2>
          <p className="text-slate-500 text-sm">
            Creative Studio & Development
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="text-right">
        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
          FACTURA
        </h1>
        <div className="flex flex-col items-end space-y-1">
          <span className="text-primary font-mono text-xl font-bold">
            {data.number}
          </span>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">
            {data.date.toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
