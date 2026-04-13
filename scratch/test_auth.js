const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  console.log("--- Starting Google Sheets Connection Test ---");
  
  try {
    const filePath = path.join(process.cwd(), 'service-account.json');
    if (!fs.existsSync(filePath)) {
      console.error("Error: service-account.json not found in current directory.");
      return;
    }

    const credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log("Credentials file loaded successfully.");
    console.log("Client Email:", credentials.client_email);

    // Clean key the same way the app does
    const cleanKey = credentials.private_key
      .replace(/\\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    const jwtClient = new google.auth.JWT(
      credentials.client_email,
      null,
      cleanKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    console.log("Authorizing...");
    await jwtClient.authorize();
    console.log("Successfully authorized!");

    const sheets = google.sheets({ version: 'v4', auth: jwtClient });
    const spreadsheetId = "1TzIRncOpOPojmLvlF_XFEU-LaGgplttRlyTVJSV-I28";

    // Get spreadsheet info
    console.log("Attempting to get spreadsheet info...");
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    console.log("Spreadsheet Title:", res.data.properties.title);
  } catch (error) {
    console.error("Test failed with error:");
    console.error(error);
  }
}

testConnection();
