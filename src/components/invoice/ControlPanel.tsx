"use client";

import { useState, useEffect } from "react";
import { useInvoice } from "@/hooks/use-invoice";
import { InvoiceData } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { Save, Loader2, PlusCircle, Download, History, LogOut } from "lucide-react";
import InvoiceForm from "./InvoiceForm";
import { logoutUser } from "@/app/actions/auth";
import ChangePasswordModal from "./ChangePasswordModal";

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
  onPrint: (fileName: string) => void;
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
  const defaultFileName = data.number ? `Factura-${data.number}` : "Factura-RuedaRola";
  const [fileName, setFileName] = useState(defaultFileName);

  useEffect(() => {
    setFileName(data.number ? `Factura-${data.number}` : "Factura-RuedaRola");
  }, [data.number]);

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  return (
    <div className="w-full h-full lg:overflow-visible bg-background/80 backdrop-blur-xl p-6 lg:p-10 pb-28 lg:pb-10 print:hidden no-print form-container relative">
      <Button 
        onClick={handleLogout}
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-red-500 hover:bg-red-50"
        title="Cerrar Sesión"
      >
        <LogOut className="w-5 h-5" />
      </Button>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header & Buttons */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 print:hidden z-50 relative">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400 shrink-0">
            Rueda Rola Invoice
          </h1>
          <div className="flex flex-wrap lg:flex-nowrap items-end gap-2 w-full lg:w-auto">
            <div className="flex flex-col gap-1 w-full lg:w-48 shrink-0">
              <label className="text-[10px] uppercase font-bold text-slate-500">
                PDF Filename
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="h-11 px-3 rounded-full border border-slate-300 bg-white/80 backdrop-blur text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary w-full shadow-xs"
                placeholder="Filename"
              />
            </div>
            
            <Button
              onClick={onHistory}
              variant="outline"
              size="default"
              className="no-print h-11 px-4 grow lg:grow-0"
              title="View History"
            >
              <History className="w-4 h-4 mr-2" />
              <span>History</span>
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
                Save
              </Button>
            ) : (
              <Button
                onClick={onNew}
                variant="default"
                className="rounded-full bg-green-600 hover:bg-green-700 no-print h-11 shadow-md shadow-green-900/20 grow lg:grow-0"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            )}

            <Button
              onClick={() => onPrint(fileName)}
              disabled={isExporting}
              className="rounded-full shadow-lg shadow-primary/25 no-print h-11 grow lg:grow-0"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <InvoiceForm data={data} actions={actions} isLocked={isLocked} />

        {/* Footer info */}
        <div className="text-xs text-center text-muted-foreground mt-4 pb-4 opacity-50 flex items-center justify-center gap-4">
          <span>Design System v2026.1 • Rueda La Rola Media</span>
          <ChangePasswordModal />
        </div>
      </div>
    </div>
  );
}
