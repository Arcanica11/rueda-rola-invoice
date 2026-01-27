import { InvoiceData } from "@/types/invoice";

export default function InvoiceHeader({ data }: { data: InvoiceData }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-6 md:gap-0 mb-8 md:mb-12 relative z-[20]">
      {/* Brand Identity */}
      <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2">
        <img
          src="/imagenes/LOGO-RuedaLaRola.png"
          alt="Rueda La Rola"
          className="w-auto h-16 md:h-24 object-contain"
        />
        <div className="md:mt-4 text-left">
          <h2 className="font-bold text-slate-900 text-base md:text-lg">
            Rueda Rola Invoice
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Creative Studio & Development
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="w-full md:w-auto text-left md:text-right flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end border-t md:border-0 pt-4 md:pt-0 border-slate-100 mt-2 md:mt-0">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-0 md:mb-2">
          FACTURA
        </h1>
        <div className="flex flex-col items-end space-y-0.5 md:space-y-1">
          <span className="text-primary font-mono text-lg md:text-xl font-bold">
            {data.number}
          </span>
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wide">
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
