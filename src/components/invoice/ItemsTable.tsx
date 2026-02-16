"use client";

import { InvoiceItem } from "@/types/invoice";
import { motion, AnimatePresence } from "framer-motion";

export default function ItemsTable({ items }: { items: InvoiceItem[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="mb-8 relative z-10 w-full">
      {/* Project Description Title */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          Project / Description Title
        </h4>
        <div className="h-0.5 w-full bg-slate-100 rounded-full"></div>
      </div>

      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b-2 border-slate-800">
            <th className="py-3 pl-2 text-center text-xs font-black text-slate-800 uppercase tracking-widest w-[15%]">
              Item Quantity
            </th>
            <th className="py-3 text-left text-xs font-black text-slate-800 uppercase tracking-widest w-[55%]">
              Description
            </th>
            <th className="py-3 text-right text-xs font-black text-slate-800 uppercase tracking-widest w-[15%]">
              Unit Price
            </th>
            <th className="py-3 pr-2 text-right text-xs font-black text-slate-800 uppercase tracking-widest w-[15%]">
              Total
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b border-slate-100 group hover:bg-slate-50/50"
                layout="position"
              >
                {/* Quantity First */}
                <td className="py-2 text-center text-slate-600 font-mono text-sm align-top font-bold">
                  {item.quantity}
                </td>
                {/* Description Second */}
                <td className="py-2 pl-2 font-medium text-slate-700 text-sm group-hover:text-primary transition-colors align-top">
                  {item.description || (
                    <span className="text-slate-300 italic">
                      Nueva línea...
                    </span>
                  )}
                </td>
                {/* Unit Price */}
                <td className="py-2 text-right text-slate-600 font-mono text-sm align-top">
                  {formatCurrency(item.price)}
                </td>
                {/* Total */}
                <td className="py-2 pr-2 text-right font-bold text-slate-900 font-mono text-sm whitespace-nowrap align-top">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="py-12 text-center text-slate-300 italic font-light"
              >
                No items added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
