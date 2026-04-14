import { google } from "googleapis";
import fs from "fs";
import path from "path";

let sheets: any = null;

export function getGoogleSheetsClient() {
  if (sheets) return sheets;

  try {
    let credentials: any = null;

    // PRIORITY 1: Individual env vars (most reliable in Vercel)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
      credentials = {
        type: "service_account",
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      };
      console.log("Auth: Using individual env vars.");
    }

    // PRIORITY 2: Big JSON env var (legacy, Base64 or raw JSON)
    if (!credentials) {
      const rawKeys = process.env.GOOGLE_SERVICE_ACCOUNT_KEYS;
      if (rawKeys) {
        const trimmed = rawKeys.trim().replace(/^['"]|['"]$/g, '');
        // Only attempt JSON parse if it looks like JSON or Base64 — never PEM
        if (trimmed.startsWith('{') || trimmed.startsWith('ewog')) {
          try {
            const jsonString = trimmed.startsWith('{')
              ? trimmed
              : Buffer.from(trimmed, 'base64').toString('utf8');
            credentials = JSON.parse(jsonString);
            if (credentials?.private_key) {
              credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
            }
            console.log("Auth: Using GOOGLE_SERVICE_ACCOUNT_KEYS.");
          } catch (e: any) {
            console.error("GOOGLE AUTH JSON PARSE ERROR:", e.message);
          }
        } else {
          console.warn("Auth: GOOGLE_SERVICE_ACCOUNT_KEYS is not JSON/Base64 — skipping.");
        }
      }
    }

    // PRIORITY 3: Local file fallback (dev only)
    if (!credentials) {
      const keyPath = path.join(process.cwd(), 'service-account.json');
      if (fs.existsSync(keyPath)) {
        credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        console.log("Auth: Using local service-account.json.");
      }
    }

    if (!credentials) {
      console.error("GOOGLE AUTH ERROR: No credentials provided.");
      return null;
    }

    // Write to /tmp for Vercel (most robust path for GoogleAuth)
    let keyFile: string | undefined;
    try {
      if (fs.existsSync('/tmp')) {
        keyFile = path.join('/tmp', `gsa-${Date.now()}.json`);
        fs.writeFileSync(keyFile, JSON.stringify(credentials));
      }
    } catch (_) { /* ignore */ }

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFile || undefined,
      credentials: keyFile ? undefined : credentials,
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
