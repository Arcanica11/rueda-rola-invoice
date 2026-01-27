"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  client_name: string;
  client_address?: string;
  client_email?: string;
  client_tax_id?: string;
  total_amount: number;
  created_at: string;
  status: string;
}

interface InvoiceHistoryProps {
  onClose: () => void;
  onSelectInvoice: (invoice: InvoiceRecord) => void;
}

export default function InvoiceHistory({
  onClose,
  onSelectInvoice,
}: InvoiceHistoryProps) {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Historial de Facturas
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No hay facturas guardadas aún.
            </div>
          ) : (
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3"># Factura</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {inv.invoice_number}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {inv.client_name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(inv.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">
                        {formatCurrency(inv.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {inv.status || "Guardada"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSelectInvoice(inv);
                            onClose();
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver/Imprimir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
