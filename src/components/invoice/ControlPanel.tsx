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
    <div className="w-full lg:w-[40%] h-full overflow-y-auto overflow-x-hidden lg:overflow-visible bg-background/80 backdrop-blur-xl border-r border-border p-6 lg:p-10 pb-28 lg:pb-10 print:hidden no-print form-container">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header & Buttons */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 print:hidden z-50 relative">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400 shrink-0">
            Rueda Rola Invoice
          </h1>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button
              onClick={onHistory}
              variant="outline"
              size="default"
              className="no-print h-11 px-4 grow lg:grow-0"
              title="Ver Historial"
            >
              <History className="w-4 h-4 mr-2" />
              <span>Facturas Pasadas</span>
            </Button>

            {!isLocked ? (
              <Button
                onClick={onSave}
                disabled={isSaving}
                variant="outline"
                className="rounded-full no-print h-11 grow lg:grow-0"
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
                className="rounded-full bg-green-600 hover:bg-green-700 no-print h-11 shadow-md shadow-green-900/20 grow lg:grow-0"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nueva Factura
              </Button>
            )}

            <Button
              onClick={onPrint}
              disabled={isExporting}
              className="rounded-full shadow-lg shadow-primary/25 no-print h-11 grow lg:grow-0"
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
