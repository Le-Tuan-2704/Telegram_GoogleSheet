const { google } = require("googleapis");
require('dotenv').config();

let auth;
let googleSheets;
let spreadsheetId;

async function init() {
    auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets Api
    googleSheets = google.sheets({ version: "v4", auth: client })

    spreadsheetId = process.env.SPREAD_SHEET_ID_BALANCE_MASTER;
}

async function get(params) {
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: process.env.SHEET_BALANCE_MASTER,
    })

    return getRows.data;
}

async function insert(params) {
    // Write row(s) to spreadsheet
    const insertRows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: process.env.SHEET_BALANCE_MASTER + "!A:C",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                Object.values(params)
            ]
        }
    })

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: process.env.SHEET_BALANCE_MASTER + "!A2:C2",
    })

    return getRows.data;
}

module.exports = {
    init,
    get,
    insert
}














