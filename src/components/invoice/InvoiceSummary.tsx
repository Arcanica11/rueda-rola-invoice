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
      <div className="w-full max-w-[350px] space-y-3 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
        {/* Sub-total */}
        <div className="flex justify-between text-slate-600 text-sm">
          <span className="font-bold uppercase tracking-wide">Sub-total</span>
          <span className="font-mono font-medium">
            {formatCurrency(calculations.subtotal)}
          </span>
        </div>

        {/* Sales Tax */}
        <div className="flex justify-between text-slate-600 text-sm">
          <span className="font-bold uppercase tracking-wide">
            Sales Tax ({(calculations.taxRate * 100).toFixed(2)}%)
          </span>
          <span className="font-mono font-medium">
            {formatCurrency(calculations.tax)}
          </span>
        </div>

        <div className="h-px bg-slate-800 my-2" />

        {/* TOTAL */}
        <div className="flex justify-between text-slate-900 font-black text-lg">
          <span className="uppercase">TOTAL</span>
          <span>{formatCurrency(calculations.total)}</span>
        </div>

        {/* Deposit Paid */}
        <div className="flex justify-between text-slate-500 text-sm font-medium">
          <span className="uppercase tracking-wide">Deposit Paid</span>
          <span className="font-mono text-red-500">
            - {formatCurrency(totalPaid)}
          </span>
        </div>

        <div className="h-px bg-slate-200 my-2" />

        {/* Balance Due */}
        <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-md shadow-md">
          <span className="font-bold uppercase tracking-widest text-xs">
            Balance Due
          </span>
          <span className="font-black text-xl tracking-tight">
            {formatCurrency(balanceDue > 0 ? balanceDue : 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
