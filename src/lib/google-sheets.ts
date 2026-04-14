import { google } from "googleapis";
import fs from "fs";
import path from "path";

let sheets: any = null;

export function getGoogleSheetsClient() {
  if (sheets) return sheets;

  try {
    const rawKeys = process.env.GOOGLE_SERVICE_ACCOUNT_KEYS;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    let credentials;
    let tempFilePath = "";

    // 1. Try individual variables (Safest/Newest)
    if (clientEmail && privateKey) {
      credentials = {
        type: "service_account",
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      };
    } 
    // 2. Try the big JSON variable (Legacy)
    else if (rawKeys) {
      try {
        let jsonString = rawKeys.trim().replace(/^['"]|['"]$/g, '');
        if (!jsonString.startsWith('{') && (jsonString.startsWith('ewog') || !jsonString.includes(' '))) {
          jsonString = Buffer.from(jsonString, 'base64').toString('utf8');
        }
        credentials = JSON.parse(jsonString);
        if (credentials.private_key) {
          credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
        }
      } catch (e: any) {
        console.error("GOOGLE AUTH JSON PARSE ERROR:", e.message);
      }
    }

    // 3. Fallback/Local File
    if (!credentials) {
      const keyPath = path.join(process.cwd(), 'service-account.json');
      if (fs.existsSync(keyPath)) {
        credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      }
    }

    if (!credentials) {
      console.error("GOOGLE AUTH ERROR: No credentials provided.");
      return null;
    }

    // 4. EMULATE FILE IN PRODUCTION (Double protection)
    // Writing to /tmp ensures the library uses its most robust file-path-based logic.
    try {
      const tmpDir = '/tmp';
      if (fs.existsSync(tmpDir)) {
        tempFilePath = path.join(tmpDir, `google-auth-${Date.now()}.json`);
        fs.writeFileSync(tempFilePath, JSON.stringify(credentials));
      }
    } catch (e) {
      // Possible in some local environments without /tmp
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: tempFilePath || undefined,
      credentials: tempFilePath ? undefined : credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheets = google.sheets({ version: "v4", auth });
    return sheets;
  } catch (e) {
    console.error("GOOGLE SHEETS FATAL AUTH ERROR:", e);
    return null;
  }
}
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
