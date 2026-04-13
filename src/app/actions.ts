"use server";

import { appendRow, readSheet, getFirstSheetTitle } from "@/lib/google-sheets";
import { InvoiceData } from "@/types/invoice";
import { revalidatePath } from "next/cache";

// User provided 1Q1VveJEsQLsxEYdEilBFFIlrZlattbknHdHUzPB808g as LOGS ID
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_LOGS_ID || "";

// Helper to get the correct sheet name (Invoices, Sheet1, Hoja 1, etc.)
async function getSheetName() {
  const title = await getFirstSheetTitle(SPREADSHEET_ID);
  return title;
}

export async function getNextInvoiceNumber() {
  if (!SPREADSHEET_ID) {
    throw new Error("Google Sheet ID is not defined");
  }

  try {
    const sheetName = await getSheetName();
    // Read Column A to get all invoice numbers
    const rows = await readSheet(SPREADSHEET_ID, `'${sheetName}'!A:A`);

    // If only header or empty, start from 0
    const count = rows.length > 1 ? rows.length - 1 : 0;

    const nextNum = count + 1;
    const year = new Date().getFullYear();
    const formattedNumber = `INV-${year}-${nextNum.toString().padStart(3, "0")}`;

    return formattedNumber;
  } catch (error) {
    console.error("Error fetching next invoice number:", error);
    // Fallback if sheet doesn't exist or other error
    return `INV-${new Date().getFullYear()}-001`;
  }
}

export async function saveInvoice(data: InvoiceData) {
  if (!SPREADSHEET_ID) {
    throw new Error("Google Sheet ID is not defined");
  }

  try {
    const sheetName = await getSheetName();
    
    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const total = subtotal; // Adjust if taxes/discounts are added later

    const row = [
      data.number,                      // A: Factura #
      new Date().toISOString(),         // B: Fecha Emisión
      data.dueDate ? new Date(data.dueDate).toISOString() : "", // C: Fecha Vencimiento
      data.client.name,                 // D: Cliente
      data.client.company || "",        // E: Empresa
      data.client.email || "",          // F: Email
      data.client.phone || "",          // G: Teléfono
      data.client.address || "",        // H: Dirección
      data.client.taxId || "",          // I: Tax ID / NIT
      subtotal,                         // J: Subtotal
      total,                            // K: Total
      data.status,                      // L: Estado
      JSON.stringify(data.payments || data.abonos || []), // M: Abonos / Pagos (JSON)
      JSON.stringify(data.items),       // N: Ítems (JSON)
      data.notes || "",                 // O: Notas
      data.terms || "",                 // P: Términos
    ];

    const result = await appendRow(SPREADSHEET_ID, `'${sheetName}'!A:P`, row);

    console.log("Invoice saved successfully:", {
      spreadsheetId: SPREADSHEET_ID,
      sheetName,
      range: result.updates?.updatedRange,
    });

    revalidatePath("/invoice");

    return {
      success: true,
      spreadsheetId: SPREADSHEET_ID,
      sheetName,
      range: result.updates?.updatedRange,
    };
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
}
