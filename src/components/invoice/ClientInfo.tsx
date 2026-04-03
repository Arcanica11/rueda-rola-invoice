import { InvoiceData } from "@/types/invoice";

export default function ClientInfo({
  client,
}: {
  client: InvoiceData["client"];
}) {
  return (
    <div className="mb-4 relative z-10">
      <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">
          Client Information
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {/* Client Name */}
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Client Name
            </label>
            <p className="text-slate-900 font-bold text-sm leading-tight whitespace-pre-wrap">
              {client.name || "N/A"}
            </p>
          </div>

          {/* Company Name */}
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Company Name
            </label>
            <p className="text-slate-700 font-medium text-xs whitespace-pre-wrap">
              {client.company || "-"}
            </p>
          </div>

          {/* Address */}
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Address
            </label>
            <p className="text-slate-600 text-xs whitespace-pre-wrap">
              {client.address || "-"}
            </p>
          </div>

          {/* Phone */}
          <div className="col-span-1">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Phone
            </label>
            <p className="text-slate-700 font-mono text-xs">
              {client.phone || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
