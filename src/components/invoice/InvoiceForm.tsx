"use client";

import { Plus, Trash2, FileText, User, Hash } from "lucide-react";
import { InvoiceData, InvoiceItem } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";

interface InvoiceFormProps {
  data: InvoiceData;
  isLocked?: boolean;
  actions: {
    setClient: (field: keyof InvoiceData["client"], value: string) => void;
    updateItem: (
      id: string,
      field: keyof InvoiceItem,
      value: string | number,
    ) => void;
    addItem: () => void;
    removeItem: (id: string) => void;
    setInvoiceNumber: (num: string) => void;
    setNotes: (notes: string) => void;
    setDate: (date: Date) => void;
    setDeposit: (amount: number) => void;
  };
}

export default function InvoiceForm({
  data,
  actions,
  isLocked = false,
}: InvoiceFormProps) {
  return (
    <div className="space-y-10 pb-20">
      {/* Factura Identifier Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Hash className="w-4 h-4" />
          <h3 className="uppercase tracking-wider text-xs">
            Invoice Identifier
          </h3>
        </div>
        <div className="p-6 rounded-xl border border-border bg-white shadow-sm">
          <div className="grid gap-2 max-w-sm">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Invoice No.
            </Label>
            <Input
              value={data.number}
              onChange={(e) => actions.setInvoiceNumber(e.target.value)}
              placeholder="INV-2026-001"
              className="h-11 text-lg font-mono font-bold text-primary"
              disabled={isLocked}
            />
          </div>
        </div>
      </section>

      {/* Client Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <User className="w-4 h-4" />
          <h3 className="uppercase tracking-wider text-xs">
            Client Details
          </h3>
        </div>
        <div className="grid gap-6 p-6 rounded-xl border border-border bg-white shadow-sm">
          {/* Row 1: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Client Name
              </Label>
              <textarea
                value={data.client.name}
                onChange={(e) => actions.setClient("name", e.target.value)}
                placeholder="Person 1, Person 2..."
                className="flex min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-base font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                disabled={isLocked}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Company / Business
              </Label>
              <Input
                value={data.client.company || ""}
                onChange={(e) => actions.setClient("company", e.target.value)}
                placeholder="Company name"
                className="h-11 text-base"
                disabled={isLocked}
              />
            </div>
          </div>

          {/* Row 2: Address & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="grid gap-2 sm:col-span-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Address
              </Label>
              <Input
                value={data.client.address}
                onChange={(e) => actions.setClient("address", e.target.value)}
                placeholder="Main St 123, City..."
                className="h-11 text-base"
                disabled={isLocked}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Phone
              </Label>
              <Input
                value={data.client.phone || ""}
                onChange={(e) => actions.setClient("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="h-11 text-base"
                disabled={isLocked}
              />
            </div>
          </div>

          {/* Row 3: Email (Hidden/Optional) and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Email (Optional)
              </Label>
              <Input
                value={data.client.email}
                onChange={(e) => actions.setClient("email", e.target.value)}
                placeholder="client@example.com"
                className="h-10 text-sm"
                disabled={isLocked}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Invoice Date
              </Label>
              <Input
                type="date"
                value={data.date.toISOString().split("T")[0]}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month, day] = e.target.value.split('-').map(Number);
                    actions.setDate(new Date(year, month - 1, day));
                  }
                }}
                className="h-10 text-sm"
                disabled={isLocked}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Items Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-primary font-bold">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <h3 className="uppercase tracking-wider text-xs">
              Service Lines
            </h3>
          </div>
          <Button
            size="sm"
            onClick={actions.addItem}
            variant="secondary"
            className="h-7 text-xs"
            disabled={isLocked}
          >
            <Plus className="w-3 h-3 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {data.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="group relative grid grid-cols-12 gap-3 items-start p-4 rounded-xl border border-border/60 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="col-span-12 sm:col-span-6 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Description
                  </Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      actions.updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Service description"
                    className="h-10 text-base"
                    disabled={isLocked}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Qty
                  </Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      actions.updateItem(
                        item.id,
                        "quantity",
                        Number(e.target.value),
                      )
                    }
                    className="h-10 text-base text-right font-mono"
                    disabled={isLocked}
                  />
                </div>
                <div className="col-span-8 sm:col-span-4 space-y-1.5 relative">
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Unit Price
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        actions.updateItem(
                          item.id,
                          "price",
                          Number(e.target.value),
                        )
                      }
                      className="h-10 text-base text-right font-mono"
                      disabled={isLocked}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => actions.removeItem(item.id)}
                      disabled={isLocked}
                      title="Remove Line"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Financials & Notes Section */}
      <section className="space-y-6 pt-4 border-t border-border">
        {/* Deposit */}
        <div className="grid gap-2 p-6 rounded-xl border border-border bg-white shadow-sm">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Deposit / Initial Payment
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              $
            </span>
            <Input
              type="number"
              value={data.payments?.[0]?.amount || ""}
              onChange={(e) => actions.setDeposit(Number(e.target.value))}
              placeholder="0.00"
              className="h-11 pl-8 text-lg font-mono font-medium"
              disabled={isLocked}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            This amount will be subtracted from the total.
          </p>
        </div>

        {/* Notes */}
        <div className="grid gap-2">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Notes / Terms
          </Label>
          <textarea
            value={data.notes || ""}
            onChange={(e) => actions.setNotes(e.target.value)}
            placeholder="Thank you for your business..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            disabled={isLocked}
          />
        </div>
      </section>
    </div>
  );
}
