const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function manualTestSave() {
  console.log("--- Starting Manual Test Row Insertion ---");
  
  try {
    const keyPath = path.join(process.cwd(), 'service-account.json');
    if (!fs.existsSync(keyPath)) {
      throw new Error("service-account.json not found.");
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = "1TzIRncOpOPojmLvlF_XFEU-LaGgplttRlyTVJSV-I28";

    // Test Data
    const testRow1 = [
      "TEST-001",
      new Date().toISOString(),
      "",
      "Test Client 1",
      "Manual Test Co",
      "test1@example.com",
      "123-456",
      "123 Test St",
      "TAX-001",
      100,
      108.25,
      "pending",
      "[]",
      "[]",
      "Manual test row 1",
      "Terms here"
    ];

    const testRow2 = [
      "TEST-002",
      new Date().toISOString(),
      "",
      "Test Client 2",
      "Manual Test Co",
      "test2@example.com",
      "654-321",
      "456 Test Blvd",
      "TAX-002",
      200,
      216.5,
      "paid",
      "[]",
      "[]",
      "Manual test row 2",
      "Terms here"
    ];

    console.log("Appending Test Row 1...");
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Sheet1'!A:P", // Assuming Sheet1 is the name
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [testRow1] },
    });

    console.log("Appending Test Row 2...");
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Sheet1'!A:P",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [testRow2] },
    });

    console.log("SUCCESS: 2 Test rows appended to Google Sheets!");
  } catch (error) {
    console.error("FAILED to append test rows:");
    console.error(error.message);
  }
}

manualTestSave();
