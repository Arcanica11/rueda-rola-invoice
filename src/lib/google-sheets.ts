import { google } from "googleapis";

let sheets: any = null;

export function getGoogleSheetsClient() {
  if (sheets) return sheets;

  try {
    const rawKeys = process.env.GOOGLE_SERVICE_ACCOUNT_KEYS;
    let authOptions: any = {
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    };

    if (rawKeys) {
      try {
        const sanitizedKeys = rawKeys.trim().replace(/^['"]|['"]$/g, '');
        const credentials = JSON.parse(sanitizedKeys);
        if (credentials.private_key) {
          credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
        authOptions.credentials = credentials;
      } catch (e: any) {
        console.error("GOOGLE AUTH JSON PARSE ERROR:", e.message);
      }
    } else {
      // Local development fallback
      const fs = require('fs');
      const path = require('path');
      const keyPath = path.join(process.cwd(), 'service-account.json');
      if (fs.existsSync(keyPath)) {
        authOptions.keyFile = keyPath;
      }
    }

    const auth = new google.auth.GoogleAuth(authOptions);
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
