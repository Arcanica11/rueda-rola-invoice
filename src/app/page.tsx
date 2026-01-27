"use client";

import { useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

// Dynamic import for html2canvas and jspdf to avoid SSR issues
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoicePage() {
  const { data, calculations, actions } = useInvoice();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      // Find the actual element inside LiveCanvas that we want to capture
      // The id 'invoice-a4-canvas' is on the motion div in LiveCanvas
      const element = document.getElementById("invoice-a4-canvas");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2, // High DPI
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${data.number}.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SplitLayout
      controlPanelContent={
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-400">
              Rueda Rola Invoice
            </h1>
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="rounded-full shadow-lg shadow-primary/25"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? "Generando..." : "Exportar PDF"}
            </Button>
          </div>
          <InvoiceForm data={data} actions={actions} />

          <div className="text-xs text-center text-muted-foreground mt-4 pb-4 opacity-50">
            Design System v2026.1 • Arknica
          </div>
        </>
      }
      liveCanvasContent={
        <div
          className="h-full w-full pt-16 px-[15mm] pb-[15mm] flex flex-col relative z-10"
          ref={canvasRef}
        >
          <Watermark />
          <InvoiceHeader data={data} />
          <ClientInfo client={data.client} />
          <ItemsTable items={data.items} />
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex justify-between items-end mt-8">
            {/* QR Code Placeholder */}
            <div className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center p-1">
              <span className="text-[9px] text-slate-400 font-medium uppercase leading-tight">
                Escanea
                <br />
                para pagar
              </span>
            </div>

            <InvoiceSummary calculations={calculations} />
          </div>
          {/* Footer Terms */}
          <div className="mt-12 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            <p>{data.notes}</p>
            <p className="mt-1 font-bold">{data.terms}</p>
            <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-widest">
              Austin, Texas, USA
            </p>
          </div>
        </div>
      }
    />
  );
}
