"use client";

import { InvoiceItem } from "@/types/invoice";
import { cn } from "@/lib/utils";
// Note: We use AnimatePresence in the implementation if we were rendering directly, but here we just render the list.
// The LiveCanvas update will handle some transition, but for row-specific animations we need motion.tr
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
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-2 pl-2 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-1/2">
              Descripción
            </th>
            <th className="py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-widest w-[16%]">
              Cant.
            </th>
            <th className="py-2 text-right text-xs font-bold text-slate-500 uppercase tracking-widest w-[16%]">
              Precio
            </th>
            <th className="py-2 pr-2 text-right text-xs font-bold text-slate-500 uppercase tracking-widest w-[16%]">
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
                className="border-b border-slate-100 group item-row"
                layout="position"
              >
                <td className="py-2 pl-2 font-medium text-slate-700 text-sm group-hover:text-primary transition-colors align-top">
                  {item.description || (
                    <span className="text-slate-300 italic">
                      Nueva línea...
                    </span>
                  )}
                </td>
                <td className="py-2 text-right text-slate-600 font-mono text-sm align-top">
                  {item.quantity}
                </td>
                <td className="py-2 text-right text-slate-600 font-mono text-sm align-top">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-2 pr-2 text-right font-bold text-slate-800 font-mono text-sm whitespace-nowrap align-top">
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
                No hay items en esta factura
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
