import { google } from "googleapis";

// Authenticate with Service Account
// Supports both local file (dev) and Env Var (prod/Vercel)
const auth = new google.auth.GoogleAuth({
  credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEYS
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEYS)
    : undefined,
  keyFile: !process.env.GOOGLE_SERVICE_ACCOUNT_KEYS
    ? "service-account.json"
    : undefined,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * Appends a row to the specified sheet.
 * @param spreadsheetId The ID of the Google Sheet
 * @param range The range/sheet name (e.g., "Sheet1!A:A")
 * @param values The row data to append
 */
export async function appendRow(
  spreadsheetId: string,
  range: string,
  values: (string | number | boolean)[],
) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error appending to Sheet:", error);
    throw error;
  }
}

/**
 * Reads all values from a specified range.
 * @param spreadsheetId The ID of the Google Sheet
 * @param range The range to read (e.g., "Sheet1!A:Z")
 */
export async function readSheet(spreadsheetId: string, range: string) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    console.error("Error reading Sheet:", error);
    throw error;
  }
}

/**
 * Gets the title of the first sheet in the spreadsheet.
 * Useful if we don't know if it's "Sheet1", "Hoja 1", or "Invoices".
 */
export async function getFirstSheetTitle(
  spreadsheetId: string,
): Promise<string> {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties.title",
    });

    const sheetsList = response.data.sheets;
    if (
      sheetsList &&
      sheetsList.length > 0 &&
      sheetsList[0].properties?.title
    ) {
      return sheetsList[0].properties.title;
    }
    return "Sheet1"; // Fallback
  } catch (error) {
    console.error("Error getting sheet title:", error);
    return "Sheet1";
  }
}
