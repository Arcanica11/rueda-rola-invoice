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
      <div className="w-full">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-200 mb-2">
          <div className="col-span-6 text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">
            Descripción
          </div>
          <div className="col-span-2 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">
            Cant.
          </div>
          <div className="col-span-2 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">
            Precio
          </div>
          <div className="col-span-2 text-right text-xs font-bold text-slate-500 uppercase tracking-widest pr-2">
            Total
          </div>
        </div>

        {/* Table Body */}
        <div className="min-h-[200px]">
          {" "}
          {/* Min height to maintain structure */}
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 gap-4 py-4 border-b border-slate-100 group"
              >
                <div className="col-span-6 pl-2 font-medium text-slate-700 group-hover:text-primary transition-colors">
                  {item.description || (
                    <span className="text-slate-300 italic">
                      Nueva línea...
                    </span>
                  )}
                </div>
                <div className="col-span-2 text-right text-slate-600 font-mono text-sm">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right text-slate-600 font-mono text-sm">
                  {formatCurrency(item.price)}
                </div>
                <div className="col-span-2 text-right font-bold text-slate-800 font-mono text-sm pr-2 whitespace-nowrap">
                  {formatCurrency(item.quantity * item.price)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="py-12 text-center text-slate-300 italic font-light">
              No hay items en esta factura
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
