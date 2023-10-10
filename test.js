const express = require("express");

const { google } = require("googleapis");

const app = express();

app.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets Api
    const googleSheets = google.sheets({ version: "v4", auth: client })

    const spreadsheetId = "1cL2BwdFw5Qfv8_yz5C5m5f0EFV2_tmkL27qB8A0no_A";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    })

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Test!A2:C2",
    })

    // Write row(s) to spreadsheet
    // const insertRows = await googleSheets.spreadsheets.values.append({
    //     auth,
    //     spreadsheetId,
    //     range: "Test!A:C",
    //     valueInputOption: "USER_ENTERED",
    //     resource: {
    //         values: [
    //             ["make a tutorial", "test", 123456]
    //         ]
    //     }
    // })

    res.send(getRows.data);
});





app.listen(3000, (req, res) => console.log("App running on port 3000"))


