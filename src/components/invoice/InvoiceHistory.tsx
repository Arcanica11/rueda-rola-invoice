"use client";

import { useEffect, useState } from "react";
import { X, Loader2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHistory } from "@/app/actions";

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
  // Extra fields for loading back into editor
  items?: string;
  payments?: string;
}

interface InvoiceHistoryProps {
  onClose: () => void;
  onSelectInvoice: (invoice: any) => void;
}

export default function InvoiceHistory({
  onClose,
  onSelectInvoice,
}: InvoiceHistoryProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getHistory();
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm print:hidden">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Invoice History (Google Sheets)
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
              No invoices saved on Google Sheets yet.
            </div>
          ) : (
            <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
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
                        {inv.client_company && (
                          <span className="block text-[10px] text-slate-400 uppercase">
                            {inv.client_company}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(inv.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">
                        {formatCurrency(inv.total_amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {inv.status || "Saved"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onSelectInvoice(inv);
                            onClose();
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Load in Editor
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
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
