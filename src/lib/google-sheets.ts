import { google } from "googleapis";

let auth: any = null;
let sheets: any = null;

function getGoogleSheetsClient() {
  if (sheets) return sheets;

  try {
    const rawKeys = process.env.GOOGLE_SERVICE_ACCOUNT_KEYS;
    let credentials;

    if (rawKeys) {
      try {
        // Handle case where env var might have escaped quotes
        const sanitizedKeys = rawKeys.trim().replace(/^['"]|['"]$/g, '');
        credentials = JSON.parse(sanitizedKeys);
        
        if (credentials.private_key) {
          // Fix for Vercel/Node 17+ private key formatting
          // Replaces both double-escaped (\\n) and literal \n if they survived JSON.parse incorrectly
          credentials.private_key = credentials.private_key
            .replace(/\\n/g, '\n')
            .replace(/\n/g, '\n'); // Ensure actual newlines are preserved
          
          // Debug check (hidden from user)
          if (!credentials.private_key.includes("-----BEGIN PRIVATE KEY-----")) {
            console.error("GOOGLE AUTH ERROR: private_key does not contain expected header.");
          }
        }
      } catch (e: any) {
        console.error("GOOGLE AUTH JSON PARSE ERROR:", e.message);
      }
    }
    
    auth = new google.auth.GoogleAuth({
      credentials,
      keyFile: !credentials && !rawKeys ? "service-account.json" : undefined,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheets = google.sheets({ version: "v4", auth });
    return sheets;
  } catch (e) {
    console.error("GOOGLE SHEETS FATAL AUTH ERROR:", e);
    return null;
  }
}

/**
 * Appends a row to the specified sheet.
 */
export async function appendRow(
  spreadsheetId: string,
  range: string,
  values: (string | number | boolean)[],
) {
  try {
    const client = getGoogleSheetsClient();
    if (!client) throw new Error("Google Sheets client could not be initialized.");

    const response = await client.spreadsheets.values.append({
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
    throw error;
  }
}

/**
 * Reads all values from a specified range.
 */
export async function readSheet(spreadsheetId: string, range: string) {
  try {
    const client = getGoogleSheetsClient();
    if (!client) return [];

    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error: any) {
    console.error("==== ERROR EN GOOGLE SHEETS API (readSheet) ====");
    return [];
  }
}

/**
 * Gets the title of the first sheet in the spreadsheet.
 */
export async function getFirstSheetTitle(
  spreadsheetId: string,
): Promise<string> {
  try {
    const client = getGoogleSheetsClient();
    if (!client) return "Sheet1";

    const response = await client.spreadsheets.get({
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
    return "Sheet1";
  } catch (error) {
    return "Sheet1";
  }
}
