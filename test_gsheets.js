const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// No need to load env, we can just hardcode for test
const SPREADSHEET_ID = '1TzIRncOpOPojmLvlF_XFEU-LaGgplttRlyTVJSV-I28';
const KEY_FILE = 'service-account.json';

async function testConnection() {
    console.log('Testing connection to Google Sheets...');
    
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });
        console.log('Successfully connected!');
        console.log('Spreadsheet Title:', spreadsheet.data.properties.title);
        
        const firstSheet = spreadsheet.data.sheets[0].properties.title;
        console.log('First Sheet Name:', firstSheet);

        console.log('Attempting to append a test row...');
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `'${firstSheet}'!A:A`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['TEST_CONNECTION', new Date().toISOString(), 'Bot Connection Test', 'Success']],
            },
        });
        console.log('Test row appended successfully!');

    } catch (error) {
        console.error('Error:');
        if (error.response) {
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testConnection();
