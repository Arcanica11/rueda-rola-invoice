"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInvoice } from "@/hooks/use-invoice";
import SplitLayout from "@/components/layout/SplitLayout";
import ControlPanel from "@/components/invoice/ControlPanel";
// InvoiceForm moved to ControlPanel
import LiveCanvas from "@/components/invoice/LiveCanvas";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import Watermark from "@/components/invoice/Watermark";
import ClientInfo from "@/components/invoice/ClientInfo";
import ItemsTable from "@/components/invoice/ItemsTable";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";
import InvoiceHistory, {
  InvoiceRecord,
} from "@/components/invoice/InvoiceHistory";
// Icons and Button removed as they are now in ControlPanel
import { supabase } from "@/lib/supabase";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export default function InvoicePage() {
  const { data, calculations, actions, setData } = useInvoice();

  // Note: canvasRef is used by LiveCanvas wrapper
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
      const year = new Date().getFullYear();
      const formattedNumber = `INV-${year}-${nextNum.toString().padStart(3, "0")}`;

      actions.setInvoiceNumber(formattedNumber);
    } catch (error) {
      console.error("Error fetching next invoice number:", error);
    }
  }, [actions]);

  // Initial fetch
  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  // Update document title
  useEffect(() => {
    document.title = data.number ? `Factura ${data.number}` : "Nueva Factura";
  }, [data.number]);

  const handlePrint = useReactToPrint({
    contentRef: canvasRef,
    documentTitle: data.number ? `Factura-${data.number}` : "Factura",
    onPrintError: (errorLocation, error) => {
      console.warn("Print Warning (non-critical):", error);
    },
    onBeforeGetContent: () => {
      setIsExporting(true);
    },
    onAfterPrint: () => {
      setIsExporting(false);
    },
  });

  const handleExportPDF = () => {
    if (handlePrint) {
      handlePrint();
    }
  };

  const handleSaveInvoice = async () => {
    if (!data.client.name) {
      toast.error("Nombre de cliente requerido");
      return;
    }
    if (data.items.length === 0) {
      toast.error("Agregue items a la factura");
      return;
    }

    setIsSaving(true);
    try {
      const numberParts = data.number.split("-");
      const consecutive = parseInt(numberParts[numberParts.length - 1]) || 0;

      // 1. Insert Header
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: consecutive,
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

      // 2. Insert Items
      if (invoiceData && invoiceData.id) {
        const itemsToInsert = data.items.map((item) => ({
          invoice_id: invoiceData.id,
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

      toast.success(`Factura #${data.number} guardada correctamente.`);
      setIsLocked(true);
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Error al guardar: " + (error as Error).message);
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
      setIsSaving(true);

      const { data: itemsData, error } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", invoice.id);

      if (error) throw error;

      const loadedItems = (itemsData || []).map((item) => ({
        id: Math.random().toString(36).substr(2, 9),
        description: item.description,
        quantity: item.quantity,
        price: item.unit_price,
      }));

      const newInvoiceData = {
        number: invoice.invoice_number,
        date: new Date(invoice.created_at),
        dueDate: new Date(
          new Date(invoice.created_at).getTime() + 7 * 24 * 60 * 60 * 1000,
        ),
        client: {
          name: invoice.client_name || "",
          address: invoice.client_address || "",
          email: invoice.client_email || "",
          taxId: invoice.client_tax_id || "",
        },
        items: loadedItems.length > 0 ? loadedItems : [],
        notes: "Copia de factura cargada del historial.",
        terms: "Payment due within 7 days.",
      };

      setData(newInvoiceData);

      toast.success(
        `Factura ${invoice.invoice_number} cargada. Lista para exportar.`,
      );
      setIsLocked(true);
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast.error("Error al cargar la factura.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SplitLayout
      controlPanelContent={
        <ControlPanel
          data={data}
          actions={actions}
          isLocked={isLocked}
          isSaving={isSaving}
          isExporting={isExporting}
          onSave={handleSaveInvoice}
          onNew={handleNewInvoice}
          onHistory={() => setShowHistory(true)}
          onPrint={handleExportPDF}
        />
      }
      liveCanvasContent={
        <>
          <div
            id="invoice-preview-container"
            className="h-full w-full pt-16 px-[15mm] pb-[15mm] flex flex-col relative z-10"
            ref={canvasRef}
          >
            <Watermark />
            <InvoiceHeader data={data} />
            <ClientInfo client={data.client} />
            <ItemsTable items={data.items} />
            <div className="flex-1" />
            <div className="invoice-footer invoice-break-avoid mt-12">
              <div className="mb-4">
                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
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
