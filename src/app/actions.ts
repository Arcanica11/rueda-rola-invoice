"use server";

import { appendRow, readSheet, getFirstSheetTitle } from "@/lib/google-sheets";
import { InvoiceData } from "@/types/invoice";

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
    const row = [
      data.number,
      new Date().toISOString(),
      data.client.name,
      data.client.email || "",
      data.client.address || "",
      data.client.taxId || "",
      // Money values
      // Note: We need to recalculate or trust frontend.
      // ideally we should recalculate, but for now specific to storage:
      // We will store just the JSON items string in the last column
      JSON.stringify(data.items), // Items
      data.notes || "",
      data.terms || "",
      data.status,
    ];

    const result = await appendRow(SPREADSHEET_ID, `'${sheetName}'!A:J`, row);

    console.log("Invoice saved successfully:", {
      spreadsheetId: SPREADSHEET_ID,
      sheetName,
      range: result.updates?.updatedRange,
    });

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
