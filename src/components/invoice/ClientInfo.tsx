import { InvoiceData } from "@/types/invoice";

export default function ClientInfo({
  client,
}: {
  client: InvoiceData["client"];
}) {
  return (
    <div className="mb-12 relative z-10 grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Facturar a
        </h3>
        <div className="text-slate-800 space-y-1">
          <p className="font-bold text-lg">
            {client.name || (
              <span className="text-slate-300 text-base font-normal">
                Nombre del Cliente
              </span>
            )}
          </p>
          <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
            {client.address || "Dirección del Cliente"}
          </p>
          <p className="text-sm text-slate-600 font-mono mt-2">
            {client.email && (
              <span className="block text-primary/80">{client.email}</span>
            )}
            {client.taxId && (
              <span className="block font-medium">RFC: {client.taxId}</span>
            )}
          </p>
        </div>
      </div>
      <div>
        {/* Placeholder for optional shipping or other info, keeping balance */}
      </div>
    </div>
  );
}
