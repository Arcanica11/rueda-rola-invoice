import { InvoiceData } from "@/types/invoice";

export default function ClientInfo({
  client,
}: {
  client: InvoiceData["client"];
}) {
  return (
    <div className="mb-6 relative z-10 w-full">
      <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-200/60 pb-2">
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-6 gap-x-8">
          {/* Main Info: Name & Company */}
          <div className="md:col-span-5 space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Client Name
              </label>
              <p className="text-slate-900 font-bold text-base leading-tight whitespace-pre-wrap">
                {client.name || "N/A"}
              </p>
            </div>
            {client.company && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Company / Business
                </label>
                <p className="text-slate-800 font-bold text-sm whitespace-pre-wrap">
                  {client.company}
                </p>
              </div>
            )}
          </div>

          {/* Contact Info: Address, Phone, Email */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address occupies full width of this sub-grid if possible */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Address
              </label>
              <p className="text-slate-800 font-bold text-sm whitespace-pre-wrap">
                {client.address || "-"}
              </p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Phone
              </label>
              <p className="text-slate-800 font-bold font-mono text-sm">
                {client.phone || "-"}
              </p>
            </div>

            {client.email && (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Email
                </label>
                <p className="text-slate-800 font-bold text-sm break-all">
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
