"use client";

import {
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  FileText,
  User,
} from "lucide-react";
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
  };
}

export default function InvoiceForm({
  data,
  actions,
  isLocked = false,
}: InvoiceFormProps) {
  return (
    <div className="space-y-10 pb-20">
      {/* Client Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <User className="w-4 h-4" />
          <h3 className="uppercase tracking-wider text-xs">
            Datos del Cliente
          </h3>
        </div>
        <div className="grid gap-4 p-4 rounded-xl border border-border/50 bg-white/50">
          <div className="grid gap-2">
            <Label>Nombre / Razón Social</Label>
            <Input
              value={data.client.name}
              onChange={(e) => actions.setClient("name", e.target.value)}
              placeholder="Ej. Tacos Michoacán LLC"
              disabled={isLocked}
            />
          </div>
          <div className="grid gap-2">
            <Label>Dirección</Label>
            <Input
              value={data.client.address}
              onChange={(e) => actions.setClient("address", e.target.value)}
              placeholder="Calle Principal 123, Ciudad..."
              disabled={isLocked}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={data.client.email}
                onChange={(e) => actions.setClient("email", e.target.value)}
                placeholder="cliente@ejemplo.com"
                disabled={isLocked}
              />
            </div>
            <div className="grid gap-2">
              <Label>RFC / Tax ID</Label>
              <Input
                value={data.client.taxId}
                onChange={(e) => actions.setClient("taxId", e.target.value)}
                placeholder="XAXX010101000"
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
              Líneas de Servicio
            </h3>
          </div>
          <Button
            size="sm"
            onClick={actions.addItem}
            variant="secondary"
            className="h-7 text-xs"
            disabled={isLocked}
          >
            <Plus className="w-3 h-3 mr-1" /> Agregar Item
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {data.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="group relative grid grid-cols-12 gap-2 items-start p-3 rounded-lg border border-border/40 bg-white/30 hover:bg-white/80 transition-all"
              >
                <div className="col-span-7 space-y-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Descripción
                  </Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      actions.updateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Descripción del servicio"
                    className="h-8 text-sm"
                    disabled={isLocked}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] text-muted-foreground">
                    Cant.
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
                    className="h-8 text-sm text-right font-mono"
                    disabled={isLocked}
                  />
                </div>
                <div className="col-span-3 space-y-1 relative">
                  <Label className="text-[10px] text-muted-foreground">
                    Precio
                  </Label>
                  <div className="flex items-center gap-1">
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
                      className="h-8 text-sm text-right font-mono"
                      disabled={isLocked}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute -right-10 top-6"
                      onClick={() => actions.removeItem(item.id)}
                      disabled={isLocked}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
