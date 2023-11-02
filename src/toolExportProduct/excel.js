const { google } = require("googleapis");
require('dotenv').config();

let auth;
let googleSheets;
let spreadsheetId;

let histLastColomn;
let listLastColomn;

async function init() {
    auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets Api
    googleSheets = google.sheets({ version: "v4", auth: client })

    spreadsheetId = process.env.SPREAD_GGSHEET_ID_EXPORT_PRODUCT;
    histLastColomn = process.env.SHEET_EXPORT_PRODUCT_HIST_LAST_COLUMN;
    listLastColomn = process.env.SHEET_EXPORT_PRODUCT_LIST_LAST_COLUMN;
}



async function getHist(index = "") {
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: process.env.SHEET_EXPORT_PRODUCT_HIST + "!A" + index + ":" + histLastColomn + index,
    })

    return getRows.data.values;
}

async function insertHist(params) {
    // Write row(s) to spreadsheet
    const insertRows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: process.env.SHEET_EXPORT_PRODUCT_HIST + "!A:" + histLastColomn,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                Object.values(params)
            ]
        }
    })
}

async function get(index = "") {
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: process.env.SHEET_EXPORT_PRODUCT_LIST + "!A" + index + ":" + listLastColomn + index,
    })

    return getRows.data.values;
}

async function insert(params) {
    // Write row(s) to spreadsheet
    const insertRows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: process.env.SHEET_EXPORT_PRODUCT_LIST + "!A:" + listLastColomn,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                Object.values(params)
            ]
        }
    })
}

async function update(index, object) {
    // Write row(s) to spreadsheet
    const insertRows = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: process.env.SHEET_EXPORT_PRODUCT_LIST + "!A" + index + ":" + listLastColomn + index,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                Object.values(object)
            ]
        }
    })
}

module.exports = {
    init,
    get,
    insert,
    update,
    getHist,
    insertHist
}














