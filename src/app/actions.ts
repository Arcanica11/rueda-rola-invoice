"use server";

import { appendRow, readSheet, getFirstSheetTitle, getGoogleSheetsClient } from "@/lib/google-sheets";
import { InvoiceData } from "@/types/invoice";
import { revalidatePath } from "next/cache";

// SPREADSHEET_ID from env
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_LOGS_ID || "";

// Helper to get the correct sheet name
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
    const rows = await readSheet(SPREADSHEET_ID, `'${sheetName}'!A:A`);
    const count = rows.length > 1 ? rows.length - 1 : 0;
    const nextNum = count + 1;
    const year = new Date().getFullYear();
    const formattedNumber = `INV-${year}-${nextNum.toString().padStart(3, "0")}`;
    return formattedNumber;
  } catch (error) {
    console.error("Error fetching next invoice number:", error);
    return `INV-${new Date().getFullYear()}-001`;
  }
}

export async function saveInvoice(data: InvoiceData) {
  if (!SPREADSHEET_ID) {
    console.error("SAVE ERROR: GOOGLE_SHEET_LOGS_ID is not defined in environment variables.");
    throw new Error("Configuración incompleta: Falta el ID de la hoja de cálculo (GOOGLE_SHEET_LOGS_ID).");
  }

  try {
    const sheetName = await getSheetName();
    const client = getGoogleSheetsClient();
    
    if (!client) {
      throw new Error("Error de autenticación: No se pudo conectar con Google Sheets. Revisa la variable GOOGLE_SERVICE_ACCOUNT_KEYS.");
    }
    
    // Calculate totals on server to be sure
    const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxRate = 0.0825; // Matching client side
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

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
      JSON.stringify(data.payments || []), // M: Pagos (JSON)
      JSON.stringify(data.items),       // N: Ítems (JSON)
      data.notes || "",                 // O: Notas
      data.terms || "",                 // P: Términos
    ];

    const result = await appendRow(SPREADSHEET_ID, `'${sheetName}'!A:P`, row);

    revalidatePath("/invoice");

    return {
      success: true,
      spreadsheetId: SPREADSHEET_ID,
      sheetName,
      range: result.updates?.updatedRange,
    };
  } catch (error: any) {
    console.error("==== SAVE INVOICE CRITICAL ERROR ====");
    console.error(error);
    throw new Error(`Google Sheets Sync Error: ${error.message}`);
  }
}

export async function getHistory() {
  if (!SPREADSHEET_ID) {
    console.warn("HISTORY ERROR: GOOGLE_SHEET_LOGS_ID is missing.");
    return [];
  }

  try {
    const sheetName = await getSheetName();
    const rows = await readSheet(SPREADSHEET_ID, `'${sheetName}'!A:P`);
    
    if (!rows || rows.length <= 1) return [];

    // Skip header row
    const dataRows = rows.slice(1);
    
    return dataRows.map((row: any[], index: number) => ({
      id: `gs-${index}`,
      invoice_number: row[0],
      created_at: row[1],
      due_at: row[2],
      client_name: row[3],
      client_company: row[4],
      client_email: row[5],
      client_phone: row[6],
      client_address: row[7],
      client_tax_id: row[8],
      subtotal: Number(row[9]) || 0,
      total_amount: Number(row[10]) || 0,
      status: row[11],
      payments: row[12], // JSON string
      items: row[13],    // JSON string
      notes: row[14],
      terms: row[15],
    }));
  } catch (error) {
    console.error("HISTORY FETCH ERROR:", error);
    return [];
  }
}
