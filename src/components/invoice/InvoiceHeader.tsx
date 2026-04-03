import { InvoiceData } from "@/types/invoice";

export default function InvoiceHeader({ data }: { data: InvoiceData }) {
  return (
    <div className="flex flex-row justify-between items-start mb-12 relative z-20 font-sans">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/imagenes/LOGO-RuedaLaRola.png"
          alt="Rueda La Rola Media"
          className="w-32 h-32 object-contain"
        />
        <div className="flex flex-col justify-center">
          <h2 className="font-bold text-slate-900 text-2xl uppercase tracking-tighter leading-none">
            RUEDA LA ROLA
            <br />
            <span className="text-primary">MEDIA LLC</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium tracking-widest mt-1 uppercase">
            YOUR ART COMES TO LIFE
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="text-right mt-0">
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-2 uppercase">
          INVOICE
        </h1>
        <div className="space-y-1">
          <div className="flex justify-end gap-3 items-baseline">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              NO.
            </span>
            <span className="text-slate-800 font-mono text-lg font-bold">
              {data.number}
            </span>
          </div>
          <div className="flex justify-end gap-3 items-baseline">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              DATE
            </span>
            <span className="text-slate-600 text-sm font-medium">
              {data.date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
