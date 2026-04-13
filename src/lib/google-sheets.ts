import { google } from "googleapis";

let credentials;
try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEYS) {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEYS);
    // Fix for Vercel/Node 17+ private key formatting
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
  }
} catch (e) {
  console.error("CRITICAL ERROR: GOOGLE_SERVICE_ACCOUNT_KEYS is not a valid JSON string.");
  credentials = undefined;
}

// Authenticate with Service Account
const auth = new google.auth.GoogleAuth({
  credentials,
  keyFile: !credentials && !process.env.GOOGLE_SERVICE_ACCOUNT_KEYS
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
  } catch (error: any) {
    console.error("==== ERROR EN GOOGLE SHEETS API (appendRow) ====");
    console.error("Mensaje:", error.message);
    if (error.response && error.response.data) {
      console.error("Detalle Google:", JSON.stringify(error.response.data, null, 2));
    }
    console.error("=================================================");
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
  } catch (error: any) {
    console.error("==== ERROR EN GOOGLE SHEETS API (readSheet) ====");
    console.error("Mensaje:", error.message);
    if (error.response && error.response.data) {
      console.error("Detalle Google:", JSON.stringify(error.response.data, null, 2));
    }
    console.error("================================================");
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
