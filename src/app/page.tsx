"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInvoice } from "@/hooks/use-invoice";
import SplitLayout from "@/components/layout/SplitLayout";
import ControlPanel from "@/components/invoice/ControlPanel";
import LiveCanvas from "@/components/invoice/LiveCanvas";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import Watermark from "@/components/invoice/Watermark";
import ClientInfo from "@/components/invoice/ClientInfo";
import ItemsTable from "@/components/invoice/ItemsTable";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoiceHistory, {
  InvoiceRecord,
} from "@/components/invoice/InvoiceHistory";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Save, PlusCircle, History } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InvoicePage() {
  const { data, calculations, actions, setData } = useInvoice();

  // Note: canvasRef is used by LiveCanvas wrapper, keep it if needed or remove if ref is unused logic
  // But ref={canvasRef} is in JSX below. Let's keep it to avoid TS error.
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch next invoice number
  const fetchNextInvoiceNumber = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      const nextNum = (count || 0) + 1;
      // Format: INV-2026-00X
      const year = new Date().getFullYear();
      const formattedNumber = `INV-${year}-${nextNum.toString().padStart(3, "0")}`;

      actions.setInvoiceNumber(formattedNumber);
    } catch (error) {
      console.error("Error fetching next invoice number:", error);
      // Fallback or alert if needed, but keeping silent for UX smoothness if it's just a connection glitch
    }
  }, [actions]);

  // Initial fetch
  useEffect(() => {
    fetchNextInvoiceNumber();
  }, [fetchNextInvoiceNumber]);

  // Update document title
  useEffect(() => {
    document.title = data.number ? `Factura ${data.number}` : "Nueva Factura";
  }, [data.number]);

  // html2canvas and jspdf removed for Native CSS Print strategy

  const handleExportPDF = () => {
    window.print();
  };

  const handleSaveInvoice = async () => {
    if (!data.client.name) {
      alert("Por favor ingrese el nombre del cliente");
      return;
    }
    if (data.items.length === 0) {
      alert("Por favor agregue al menos un ítem a la factura");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Insert Invoice
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: data.number, // Ensure we save the number too
          client_name: data.client.name,
          client_address: data.client.address || "",
          subtotal: calculations.subtotal,
          tax_amount: calculations.tax,
          total_amount: calculations.total,
          status: "closed",
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const invoiceId = invoiceData.id;

      // 2. Insert Items
      if (invoiceId) {
        const itemsToInsert = data.items.map((item) => ({
          invoice_id: invoiceId,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.quantity * item.price,
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      alert(`Factura #${data.number} guardada correctamente.`);
      setIsLocked(true);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error al guardar: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewInvoice = async () => {
    actions.resetInvoice();
    setIsLocked(false);
    await fetchNextInvoiceNumber();
  };

  const loadInvoiceFromHistory = async (invoice: InvoiceRecord) => {
    try {
      setIsSaving(true); // Show loading state via existing state or add new one? saving is close enough for blocking UI if used elsewhere, but here maybe just toast.
      // Actually, let's just use window.alert as feedback is requested.

      // 1. Fetch Items
      const { data: itemsData, error } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoice.id);

      if (error) throw error;

      // 2. Map Items
      const loadedItems = (itemsData || []).map((item) => ({
        id: Math.random().toString(36).substr(2, 9), // Generate new temp IDs for frontend state
        description: item.description,
        quantity: item.quantity,
        price: item.unit_price,
      }));

      // 3. Update State
      // We use setData directly via the hook's returned function if exposed?
      // Wait, useInvoice returns data, setData, calculations, actions.
      // I can use setData to set everything at once.

      /*
         Need to access setData here.
         The hook is used at top level: const { data, calculations, actions, setData } = useInvoice();
         I need to make sure setData is destructured above.
      */

      // 4. Set Client Data
      // Note: In Supabase I might check if client_address is actually in the 'invoices' table.
      // Based on previous file reads, invoices table has: client_name, client_address, total_amount, etc.

      // Update the whole state
      // @ts-ignore - accessing setData which is returned by useInvoice but I need to make sure I destructure it.
      // I will update the destructuring in the render function too.

      // Construct the new data object
      // We keep the current date for "re-issue" or use the original date?
      // Prompt says "Setea invoiceNumber...". Usually if loading history we want to see that invoice.

      const newInvoiceData = {
        number: invoice.invoice_number,
        date: new Date(invoice.created_at), // Use original date
        dueDate: new Date(
          new Date(invoice.created_at).getTime() + 7 * 24 * 60 * 60 * 1000,
        ), // Approx
        client: {
          name: invoice.client_name || "",
          address: invoice.client_address || "", // Assuming this field exists in DB response
          email: invoice.client_email || "",
          taxId: invoice.client_tax_id || "",
        },
        items: loadedItems.length > 0 ? loadedItems : [],
        notes: "Copia de factura cargada del historial.",
        terms: "Payment due within 7 days.",
      };

      // Using actions.resetInvoice() first? No, setData completely overwrites.
      setData(newInvoiceData);

      alert(`Factura ${invoice.invoice_number} cargada. Lista para exportar.`);
      setIsLocked(true); // Lock it so they don't accidentally edit a past invoice? Or false?
      // Prompt says: "Lista para exportar." -> implies ready state.
    } catch (error) {
      console.error("Error loading invoice:", error);
      alert("Error al cargar la factura.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SplitLayout
      controlPanelContent={
        <div className="no-print form-container">
          <div className="flex items-center justify-between mb-8 print:hidden">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400">
              Rueda Rola Invoice
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowHistory(true)}
                variant="outline"
                size="icon"
                className="no-print"
                title="Ver Historial"
              >
                <History className="w-4 h-4" />
              </Button>

              {!isLocked ? (
                <Button
                  onClick={handleSaveInvoice}
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
                  onClick={handleNewInvoice}
                  variant="default"
                  className="rounded-full bg-green-600 hover:bg-green-700 no-print"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nueva Factura
                </Button>
              )}

              <Button
                onClick={handleExportPDF}
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
          <InvoiceForm data={data} actions={actions} isLocked={isLocked} />

          <div className="text-xs text-center text-muted-foreground mt-4 pb-4 opacity-50">
            Design System v2026.1 • Arknica
          </div>
        </div>
      }
      liveCanvasContent={
        <>
          <div
            className="h-full w-full pt-16 px-[15mm] pb-[15mm] flex flex-col relative z-10"
            ref={canvasRef}
          >
            <Watermark />
            <InvoiceHeader data={data} />
            <ClientInfo client={data.client} />
            <ItemsTable items={data.items} />
            <div className="flex-1" /> {/* Spacer */}
            <div className="invoice-footer invoice-break-avoid mt-12">
              {/* Payment Methods & Footer */}
              <div className="mb-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      {/* Payment Methods Image */}
                      <img
                        src="/imagenes/metodos_pago.png"
                        alt="Métodos de Pago"
                        className="h-12 w-auto object-contain"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        } // Fallback if missing
                      />
                      {/* Contact QR */}
                      <img
                        src="/imagenes/qr_contacto.png"
                        alt="QR Contacto"
                        className="w-24 h-24 object-contain"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      Métodos de pago: Martha P. Martinez Cel. (469) 428-6018
                    </p>
                  </div>

                  <InvoiceSummary calculations={calculations} />
                </div>
              </div>
              {/* Footer Terms */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                <p>{data.notes}</p>
                <p className="mt-1 font-bold">{data.terms}</p>
                <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-widest">
                  Austin, Texas, USA •{" "}
                  <span className="font-semibold text-primary/70">
                    www.ruedalarolamedia.com
                  </span>
                </p>
              </div>
            </div>
            {/* Este footer se repite en cada hoja impresa */}
            <div className="print-footer-fixed hidden print:flex">
              <span>www.ruedalarolamedia.com</span>
              <span className="page-number"></span>
            </div>
          </div>
          {showHistory && (
            <InvoiceHistory
              onClose={() => setShowHistory(false)}
              onSelectInvoice={loadInvoiceFromHistory}
            />
          )}
        </>
      }
    />
  );
}
