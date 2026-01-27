"use client";

import { useInvoice } from "@/hooks/use-invoice";
import { InvoiceData } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Save, Loader2, PlusCircle, Download, History } from "lucide-react";
import InvoiceForm from "./InvoiceForm";

// Infiero el tipo de 'actions' directamente del hook
type InvoiceActions = ReturnType<typeof useInvoice>["actions"];

interface ControlPanelProps {
  data: InvoiceData;
  actions: InvoiceActions;
  isLocked: boolean;
  isSaving: boolean;
  isExporting?: boolean; // Optional if not always passed, but user logic implies it's used for the PDF button state
  onSave: () => void;
  onNew: () => void;
  onHistory: () => void;
  onPrint: () => void;
}

export default function ControlPanel({
  data,
  actions,
  isLocked,
  isSaving,
  isExporting = false,
  onSave,
  onNew,
  onHistory,
  onPrint,
}: ControlPanelProps) {
  return (
    <div className="w-full lg:w-[40%] h-full overflow-y-auto bg-background/80 backdrop-blur-xl border-r border-border p-6 lg:p-10 print:hidden no-print form-container">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header & Buttons */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400">
            Rueda Rola Invoice
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={onHistory}
              variant="outline"
              size="icon"
              className="no-print"
              title="Ver Historial"
            >
              <History className="w-4 h-4" />
            </Button>

            {!isLocked ? (
              <Button
                onClick={onSave}
                disabled={isSaving}
                variant="outline"
                className="rounded-full no-print"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar
              </Button>
            ) : (
              <Button
                onClick={onNew}
                variant="default"
                className="rounded-full bg-green-600 hover:bg-green-700 no-print"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nueva Factura
              </Button>
            )}

            <Button
              onClick={onPrint}
              disabled={isExporting}
              className="rounded-full shadow-lg shadow-primary/25 no-print"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "Generando..." : "Exportar PDF"}
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <InvoiceForm data={data} actions={actions} isLocked={isLocked} />

        {/* Footer info */}
        <div className="text-xs text-center text-muted-foreground mt-4 pb-4 opacity-50">
          Design System v2026.1 • Arknica
        </div>
      </div>
    </div>
  );
}
