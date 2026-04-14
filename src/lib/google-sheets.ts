import { google } from "googleapis";

let sheets: any = null;

export function getGoogleSheetsClient() {
  if (sheets) return sheets;

  try {
    const rawKeys = process.env.GOOGLE_SERVICE_ACCOUNT_KEYS;
    let credentials;

    if (rawKeys) {
      try {
        let jsonString = rawKeys.trim().replace(/^['"]|['"]$/g, '');
        
        // Robust Base64 detection (Base64 for '{' is 'ewog')
        if (!jsonString.startsWith('{') && (jsonString.startsWith('ewog') || !jsonString.includes(' '))) {
          try {
            console.log("Detecting Base64 encoded credentials, decoding...");
            jsonString = Buffer.from(jsonString, 'base64').toString('utf8');
          } catch (e) {
            console.warn("Base64 decoding failed, using raw string.");
          }
        }

        credentials = JSON.parse(jsonString);
      } catch (e: any) {
        console.error("GOOGLE AUTH JSON PARSE ERROR:", e.message);
      }
    }

    // Fallback to local file
    if (!credentials) {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'service-account.json');
        if (fs.existsSync(filePath)) {
          credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
      } catch (e) {
        // Safe to ignore if running in production without file
      }
    }

    if (!credentials || !credentials.private_key) {
      console.error("GOOGLE AUTH ERROR: No valid credentials found.");
      return null;
    }

    // Ultra-clean the private key for OpenSSL compatibility
    const cleanKey = credentials.private_key
      .replace(/\\n/g, '\n')
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .join('\n');

    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      undefined,
      cleanKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    sheets = google.sheets({ version: "v4", auth: jwtClient });
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
