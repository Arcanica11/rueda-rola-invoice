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
        // 1. Remove any outer quotes that Vercel or local .env might have added
        const sanitizedKeys = rawKeys.trim().replace(/^['"]|['"]$/g, '');
        credentials = JSON.parse(sanitizedKeys);
        
        if (credentials.private_key) {
          // 2. Ultra-robust newline normalization
          // Handles: literal \n strings, double-escaped \\n, and actual encoded newlines
          const normalizedKey = credentials.private_key
            .replace(/\\n/g, '\n')      // Convert literal \n to actual newline
            .replace(/\n\n/g, '\n')    // Remove double newlines if any
            .trim();

          credentials.private_key = normalizedKey;

          // 3. SAFE DIAGNOSTIC LOG (Masked)
          // This helps verify if the key starts and ends correctly without leaking it
          const keyCheck = normalizedKey.trim();
          const startsWithHeader = keyCheck.startsWith("-----BEGIN PRIVATE KEY-----");
          const endsWithFooter = keyCheck.endsWith("-----END PRIVATE KEY-----");
          
          console.log("==== GOOGLE AUTH DIAGNOSTIC ====");
          console.log(`Key length: ${keyCheck.length} chars`);
          console.log(`Header OK: ${startsWithHeader}`);
          console.log(`Footer OK: ${endsWithFooter}`);
          console.log("================================");

          if (!startsWithHeader || !endsWithFooter) {
            console.error("CRITICAL: The private key is missing the standard PEM header/footer.");
          }
        }
      } catch (e: any) {
        console.error("GOOGLE AUTH JSON PARSE ERROR:", e.message);
        console.error("Raw Keys Start (debug):", rawKeys.substring(0, 20) + "...");
      }
    }
    
    // Explicitly pass credentials with cleaned private key
    auth = new google.auth.GoogleAuth({
      credentials: credentials ? {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
        project_id: credentials.project_id
      } : undefined,
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
