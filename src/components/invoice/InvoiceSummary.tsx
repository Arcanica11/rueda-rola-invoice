import { cn } from "@/lib/utils";
import { Payment } from "@/types/invoice";

interface Calculations {
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
}

export default function InvoiceSummary({
  calculations,
  payments = [],
}: {
  calculations: Calculations;
  payments?: Payment[];
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const balanceDue = calculations.total - totalPaid;

  return (
    <div className="flex justify-end mt-8 relative z-10 w-full">
      <div className="w-full max-w-[300px] space-y-3">
        <div className="flex justify-between text-slate-500 text-sm">
          <span className="font-medium">Subtotal</span>
          <span className="font-mono">
            {formatCurrency(calculations.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-500 text-sm">
          <span className="font-medium">
            Tax ({(calculations.taxRate * 100).toFixed(2)}%)
          </span>
          <span className="font-mono">{formatCurrency(calculations.tax)}</span>
        </div>

        <div className="h-px bg-slate-200 my-2" />

        <div className="flex justify-between text-slate-900 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(calculations.total)}</span>
        </div>

        {payments.length > 0 && (
          <div className="flex justify-between text-emerald-600 text-sm font-medium">
            <span>Pagado (Abonos)</span>
            <span>-{formatCurrency(totalPaid)}</span>
          </div>
        )}

        <div className="h-px bg-slate-200 my-2" />

        <div className="flex justify-between items-baseline p-2 bg-red-50/50 rounded-lg border border-red-100">
          <span className="font-bold text-lg text-red-900">Balance Due</span>
          <span className="font-black text-2xl tracking-tight text-red-600">
            {formatCurrency(balanceDue)}
          </span>
        </div>
      </div>
    </div>
  );
}
