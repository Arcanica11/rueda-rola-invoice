"use server";

import { appendRow, readSheet, getFirstSheetTitle, getGoogleSheetsClient } from "@/lib/google-sheets";
import {
  saveInvoiceToSupabase,
  getHistoryFromSupabase,
  getNextInvoiceNumberFromSupabase,
} from "@/lib/supabase-invoices";
import { InvoiceData } from "@/types/invoice";
import { revalidatePath } from "next/cache";

// Google Sheets (secondary/optional)
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_LOGS_ID || "";

async function getSheetName() {
  return await getFirstSheetTitle(SPREADSHEET_ID);
}

// ─── Invoice Number ────────────────────────────────────────────────────────────
export async function getNextInvoiceNumber() {
  try {
    // Primary: Supabase (fast and always works)
    return await getNextInvoiceNumberFromSupabase();
  } catch (e) {
    console.warn("Supabase invoice number failed, using fallback.");
    return `INV-${new Date().getFullYear()}-001`;
  }
}

// ─── Save Invoice ──────────────────────────────────────────────────────────────
export async function saveInvoice(data: InvoiceData) {
  let supabaseResult = null;
  let supabaseError = null;

  // PRIMARY: Save to Supabase
  try {
    supabaseResult = await saveInvoiceToSupabase(data);
    console.log("Invoice saved to Supabase:", supabaseResult?.id);
  } catch (err: any) {
    supabaseError = err.message;
    console.error("Supabase save failed:", err.message);
  }

  // SECONDARY: Sync to Google Sheets (non-blocking — failures are logged, not thrown)
  if (SPREADSHEET_ID) {
    try {
      const sheetName = await getSheetName();
      const client = getGoogleSheetsClient();
      if (client) {
        const subtotal = data.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
        const tax = subtotal * 0.0825;
        const total = subtotal + tax;

        const row = [
          data.number,
          new Date().toISOString(),
          data.dueDate ? new Date(data.dueDate).toISOString() : "",
          data.client.name,
          data.client.company || "",
          data.client.email || "",
          data.client.phone || "",
          data.client.address || "",
          data.client.taxId || "",
          subtotal,
          total,
          data.status,
          JSON.stringify(data.payments || []),
          JSON.stringify(data.items),
          data.notes || "",
          data.terms || "",
        ];
        await appendRow(SPREADSHEET_ID, `'${sheetName}'!A:P`, row);
        console.log("Invoice also synced to Google Sheets.");
      }
    } catch (sheetsErr: any) {
      // Non-fatal: log but don't block the user
      console.warn("Google Sheets sync failed (non-fatal):", sheetsErr.message);
    }
  }

  // If Supabase also failed, NOW we throw to the user
  if (!supabaseResult) {
    throw new Error(
      `No se pudo guardar la factura. ${supabaseError || "Error desconocido."}`
    );
  }

  revalidatePath("/invoice");
  return { success: true, id: supabaseResult.id };
}

// ─── Get History ───────────────────────────────────────────────────────────────
export async function getHistory() {
  try {
    const rows = await getHistoryFromSupabase();
    return rows.map((row: any) => ({
      id: row.id,
      invoice_number: row.invoice_number,
      created_at: row.created_at,
      due_at: row.due_at,
      client_name: row.client_name,
      client_company: row.client_company,
      client_email: row.client_email,
      client_phone: row.client_phone,
      client_address: row.client_address,
      client_tax_id: row.client_tax_id,
      subtotal: row.subtotal,
      total_amount: row.total_amount,
      status: row.status,
      payments: row.payments,
      items: row.items,
      notes: row.notes,
      terms: row.terms,
    }));
  } catch (error) {
    console.error("HISTORY FETCH ERROR:", error);
    return [];
  }
}
