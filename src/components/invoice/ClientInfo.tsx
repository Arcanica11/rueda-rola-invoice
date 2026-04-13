import { InvoiceData } from "@/types/invoice";

export default function ClientInfo({
  client,
}: {
  client: InvoiceData["client"];
}) {
  return (
    <div className="mb-4 relative z-10 w-full">
      <div className="bg-slate-50/40 rounded-lg p-3 border border-slate-100 shadow-sm">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 border-b border-slate-200/40 pb-1">
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
          {/* Column 1: Name & Company */}
          <div className="space-y-2">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                Client Name
              </label>
              <p className="text-slate-900 font-bold text-sm leading-tight whitespace-pre-wrap">
                {client.name || "N/A"}
              </p>
            </div>
            {client.company && (
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                  Company
                </label>
                <p className="text-slate-800 font-bold text-[13px] leading-tight whitespace-pre-wrap">
                  {client.company}
                </p>
              </div>
            )}
          </div>

          {/* Column 2: Address */}
          <div className="md:col-span-1">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
              Address
            </label>
            <p className="text-slate-800 font-bold text-[13px] leading-tight whitespace-pre-wrap">
              {client.address || "-"}
            </p>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-2">
            {client.phone && (
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                  Phone
                </label>
                <p className="text-slate-800 font-bold font-mono text-[13px] leading-none">
                  {client.phone}
                </p>
              </div>
            )}
            {client.email && (
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                  Email
                </label>
                <p className="text-slate-800 font-bold text-[13px] leading-none break-all">
                  {client.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
