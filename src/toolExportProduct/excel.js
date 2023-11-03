const { google } = require("googleapis");
const { ProductList, ProductHist } = require("./model");
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

    let productHistArray = getRows.data.values;
    if (productHistArray.length > 1) {
        productHistArray.shift();
    }

    // Tạo mảng đối tượng từ mảng productHist
    const productHistList = productHistArray.map(row => {
        const [maSanPham, diaChi1, soLuong, diaChi2, ghiChu, idNguoiNhap, nguoiNhap, thoiGian] = row;
        return new ProductHist(maSanPham, diaChi1, soLuong, diaChi2, ghiChu, idNguoiNhap, nguoiNhap, thoiGian);
    });

    return productHistList;
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

    let productArray = getRows.data.values;
    if (productArray.length > 1) {
        productArray.shift();
    }

    // Tạo mảng đối tượng từ mảng productList
    let productList = productArray.map(row => {
        const [maSanPham, tenSanPham, maSanPhamQT, soLuongKho, soLuongNha, soLuongChuyenKho, soLuongXuatNgoai, soLuongConLai, soLuongTong] = row;
        return new ProductList(maSanPham, tenSanPham, maSanPhamQT, soLuongKho, soLuongNha, soLuongChuyenKho, soLuongXuatNgoai, soLuongConLai, soLuongTong);
    });

    return productList;
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














