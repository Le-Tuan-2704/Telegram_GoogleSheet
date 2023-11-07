const { google } = require("googleapis");
const { BalanceList } = require("./model");
require('dotenv').config();

let auth;
let googleSheets;
let spreadsheetId;
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

    spreadsheetId = process.env.SPREAD_SHEET_ID_BALANCE_MASTER;
    listLastColomn = process.env.SHEET_BALANCE_MASTER_LAST_COLUMN;
}

async function get(index = "") {
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: process.env.SHEET_BALANCE_MASTER + "!A" + index + ":" + listLastColomn + index,
    })

    let balanceArray = getRows.data.values;
    if (balanceArray.length > 1) {
        balanceArray.shift();
    }

    // Tạo mảng đối tượng từ mảng balance
    const balanceList = balanceArray.map(row => {
        const [key, title, content, note, time] = row;
        return new BalanceList(key, title, content, note, time);
    });

    return balanceList;
}

async function insert(params) {
    // Write row(s) to spreadsheet
    const insertRows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: process.env.SHEET_BALANCE_MASTER + "!A:" + listLastColomn,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                Object.values(params)
            ]
        }
    })
}

module.exports = {
    init,
    get,
    insert
}














