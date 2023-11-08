const excel = require('excel4node');
const Common = require("../common");

// Hàm tạo file Excel từ mảng đối tượng Balance
async function generateExcel(balanceHists) {
    return new Promise((resolve, reject) => {
        // Tạo một workbook và một worksheet
        const workbook = new excel.Workbook();
        const worksheetHist = workbook.addWorksheet('BalanceHist');

        // Tạo một đối tượng style cho dòng tiêu đề
        const headerStyle = workbook.createStyle({
            font: {
                color: '#000000', // Màu chữ đen
                bold: true,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                fgColor: '#f1c232', // Màu nền vàng đất
            },
        });

        // Ghi tiêu đề vào worksheetHist
        worksheetHist.cell(1, 1).string('Key').style(headerStyle);
        worksheetHist.cell(1, 2).string('Title').style(headerStyle);
        worksheetHist.cell(1, 3).string('Money').style(headerStyle);
        worksheetHist.cell(1, 4).string('Note').style(headerStyle);
        worksheetHist.cell(1, 5).string('DateTime').style(headerStyle);

        // Ghi dữ liệu vào worksheet từ mảng đối tượng Balance
        balanceHists.forEach((balance, index) => {
            worksheetHist.cell(index + 2, 1).string(balance.key);
            worksheetHist.cell(index + 2, 2).string(balance.title);
            worksheetHist.cell(index + 2, 3).string(Common.convertMoney(parseInt(balance.money)));
            worksheetHist.cell(index + 2, 4).string(balance.note);
            worksheetHist.cell(index + 2, 5).string(balance.datetime);
        });

        let date = Common.get_CurrentDate();
        // Lưu workbook vào một file Excel
        const excelFileName = 'public/balance_' + date + '.xlsx';
        workbook.write(excelFileName, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                console.log('File Excel đã được tạo thành công:', excelFileName);
                resolve(excelFileName);
            }
        });
    });
}

module.exports = {
    generateExcel,
}