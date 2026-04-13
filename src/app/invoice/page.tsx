"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInvoice } from "@/hooks/use-invoice";
import { InvoiceData } from "@/types/invoice";
import SplitLayout from "@/components/layout/SplitLayout";
import ControlPanel from "@/components/invoice/ControlPanel";
// InvoiceForm moved to ControlPanel

import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import Watermark from "@/components/invoice/Watermark";
import ClientInfo from "@/components/invoice/ClientInfo";
import ItemsTable from "@/components/invoice/ItemsTable";
import InvoiceSummary from "@/components/invoice/InvoiceSummary";
import InvoiceHistory from "@/components/invoice/InvoiceHistory";
// Icons and Button removed as they are now in ControlPanel
import { getNextInvoiceNumber, saveInvoice, getHistory } from "@/app/actions";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
      const nextNumber = await getNextInvoiceNumber();
      actions.setInvoiceNumber(nextNumber);
    } catch (error) {
      console.error("Error fetching next invoice number:", error);
      toast.error("Error conectando con Google Sheets");
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

  const handleSaveInvoice = async (silent = false) => {
    if (!data.client.name) {
      if (!silent) toast.error("Nombre de cliente requerido");
      return { success: false, error: "Nombre de cliente requerido" };
    }
    if (data.items.length === 0) {
      if (!silent) toast.error("Agregue ítems a la factura");
      return { success: false, error: "Agregue ítems a la factura" };
    }

    setIsSaving(true);
    try {
      const result = await saveInvoice(data);
      if (!silent) {
        toast.success(`Guardado en Google Sheets: ${result.sheetName}`);
      }
      setIsLocked(true);
      return { success: true };
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      const msg = error.message || "Error al guardar";
      if (!silent) toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setIsSaving(false);
    }
  };

  // -- PDF Export logic using html2canvas & jspdf --
  const handleExportPDF = async (customFileName: string) => {
    // 1. Auto-save first
    const saveResult = await handleSaveInvoice(true);
    if (!saveResult.success) {
      toast.error(saveResult.error || "No se pudo guardar la factura. Verifique los datos.");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("Generando PDF...");
    
    try {
      if (!canvasRef.current) throw new Error("Canvas ref is null");

      const element = canvasRef.current;
      const wrapper = element.parentElement;
      const originalTransform = wrapper ? wrapper.style.transform : "none";
      if (wrapper) wrapper.style.transform = "none";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        logging: false,
        onclone: (clonedDoc: Document) => {
          const allElements = clonedDoc.querySelectorAll("*");
          allElements.forEach((el: Element) => {
            const style = window.getComputedStyle(el);
            const isUnsupported = (val: string) =>
              val &&
              (val.includes("oklab") ||
                val.includes("lab(") ||
                val.includes("oklch"));

            if (isUnsupported(style.backgroundColor)) {
              (el as HTMLElement).style.backgroundColor = "#ffffff";
            }
            if (isUnsupported(style.color)) {
              (el as HTMLElement).style.color = "#000000";
            }
            if (isUnsupported(style.borderColor)) {
              (el as HTMLElement).style.borderColor = "#cbd5e1"; // slate-300
            }
          });
        },
      } as any);

      // Restore transform
      if (wrapper) wrapper.style.transform = originalTransform;

      const imgData = canvas.toDataURL("image/jpeg", 0.75);

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      let finalFileName = customFileName || (data.number ? `Factura-${data.number}` : "Factura-RuedaRola");
      if (!finalFileName.toLowerCase().endsWith(".pdf")) {
        finalFileName += ".pdf";
      }
      
      pdf.save(finalFileName);
      toast.success("PDF generado y guardado en historial", { id: toastId });
    } catch (error: any) {
      console.error("==== ERROR GENERANDO PDF ====");
      toast.error("Error al exportar: " + (error?.message || "Revisar consola"), { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleNewInvoice = async () => {
    actions.resetInvoice();
    setIsLocked(false);
    await fetchNextInvoiceNumber();
  };

  const loadInvoiceFromHistory = (historyItem: any) => {
    try {
      const items = typeof historyItem.items === 'string' ? JSON.parse(historyItem.items) : historyItem.items;
      const payments = typeof historyItem.payments === 'string' ? JSON.parse(historyItem.payments) : historyItem.payments;
      
      setData({
        number: historyItem.invoice_number,
        date: new Date(historyItem.created_at),
        dueDate: historyItem.due_at ? new Date(historyItem.due_at) : new Date(),
        status: historyItem.status || "pending",
        client: {
          name: historyItem.client_name,
          company: historyItem.client_company,
          email: historyItem.client_email,
          phone: historyItem.client_phone,
          address: historyItem.client_address,
          taxId: historyItem.client_tax_id,
        },
        items: items || [],
        payments: payments || [],
        notes: historyItem.notes || "",
        terms: historyItem.terms || "",
      });
      setIsLocked(false);
      toast.success(`Factura ${historyItem.invoice_number} cargada`);
    } catch (error) {
      console.error("Error loading invoice:", error);
      toast.error("Error al cargar los datos de la factura");
    }
  };

  return (
    <>
      <SplitLayout
        controlPanelContent={
          <ControlPanel
            data={data}
            actions={actions}
            isLocked={isLocked}
            isSaving={isSaving}
            isExporting={isExporting}
            onSave={() => handleSaveInvoice()}
            onNew={handleNewInvoice}
            onHistory={() => setShowHistory(true)}
            onPrint={handleExportPDF}
          />
        }
        liveCanvasContent={
          <div className="flex justify-center p-8 min-h-full bg-slate-100/50 overflow-auto">
            {/* Scale Wrapper: Ensures A4 dimensions while scaling down if necessary on smaller screens */}
            <div
              className="relative origin-top transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-300"
              style={{ minWidth: "210mm", minHeight: "297mm" }}
            >
              <div
                id="invoice-preview-container"
                className="w-[210mm] min-h-[297mm] bg-white shadow-2xl relative z-10 flex flex-col pt-16 px-[12mm] pb-[12mm] mx-auto origin-top"
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/imagenes/qr_contacto.png"
                            alt="QR Contacto"
                            className="w-24 h-24 object-contain"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        </div>
                      </div>

                      <InvoiceSummary
                        calculations={calculations}
                        payments={data.payments || []}
                      />
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t-2 border-slate-900">
                    <div className="flex flex-row justify-between items-end">
                      {/* Left: Thank You & Notes */}
                      <div className="mb-0 max-w-sm">
                        <h4 className="font-black text-xl text-slate-900 mb-2 italic">
                          Thank you for your business
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                              NOTES
                            </p>
                            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 min-h-[60px]">
                              {data.notes ||
                                "Payment due as specified in terms."}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Agency Info */}
                      <div className="text-right space-y-1 text-sm text-slate-600">
                        <p className="font-bold text-slate-900 text-lg">MG</p>
                        <p>(512) 489-0417</p>
                        <p className="text-primary font-medium">
                          Antonieta@Ruedalarolamedia.com
                        </p>
                        <p>www.ruedalarolamedia.com</p>
                        <p className="text-slate-500">@ruedalarolamedia</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="print-footer-fixed hidden print:flex">
                  <span>www.ruedalarolamedia.com</span>
                  <span className="page-number"></span>
                </div>
              </div>
            </div>
          </div>
        }
      />

      {showHistory && (
        <InvoiceHistory
          onClose={() => setShowHistory(false)}
          onSelectInvoice={loadInvoiceFromHistory}
        />
      )}
    </>
  );
}
