import { cn } from "@/lib/utils";

interface Calculations {
  subtotal: number;
  tax: number;
  total: number;
  taxRate: number;
}

export default function InvoiceSummary({
  calculations,
}: {
  calculations: Calculations;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex justify-end mt-8 relative z-10">
      <div className="w-1/2 xs:w-1/3 min-w-[200px] space-y-3">
        <div className="flex justify-between text-slate-500 text-sm">
          <span className="font-medium">Subtotal</span>
          <span className="font-mono">
            {formatCurrency(calculations.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-slate-500 text-sm">
          <span className="font-medium">
            Tax ({calculations.taxRate * 100}%)
          </span>
          <span className="font-mono">{formatCurrency(calculations.tax)}</span>
        </div>
        <div className="h-px bg-slate-200 my-2" />
        <div className="flex justify-between text-slate-900 items-baseline">
          <span className="font-bold text-lg">Balance</span>
          <span className="font-black text-2xl tracking-tight text-primary">
            {formatCurrency(calculations.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
