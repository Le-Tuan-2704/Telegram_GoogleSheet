const excel = require('excel4node');
const Common = require("../common");

// Hàm tạo file Excel từ mảng đối tượng Product
async function generateExcel(products, productHists) {
    return new Promise((resolve, reject) => {
        // Tạo một workbook và một worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('ProductList');
        const worksheetHist = workbook.addWorksheet('ProductHist');

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

        // Ghi tiêu đề vào worksheet
        worksheet.cell(1, 1).string('Mã Sản Phẩm').style(headerStyle);
        worksheet.cell(1, 2).string('Tên Sản Phẩm').style(headerStyle);
        worksheet.cell(1, 3).string('Mã Sản Phẩm QT').style(headerStyle);
        worksheet.cell(1, 4).string('Số Lượng Kho').style(headerStyle);
        worksheet.cell(1, 5).string('Số Lượng Nhà').style(headerStyle);
        worksheet.cell(1, 6).string('Số Lượng Chuyển Kho sang Nhà').style(headerStyle);
        worksheet.cell(1, 7).string('Số Lượng Xuất Ngoại').style(headerStyle);
        worksheet.cell(1, 8).string('Số Lượng Còn Lại').style(headerStyle);
        worksheet.cell(1, 9).string('Số Lượng Tổng').style(headerStyle);

        // Ghi tiêu đề vào worksheetHist
        worksheetHist.cell(1, 1).string('Mã Sản Phẩm').style(headerStyle);
        worksheetHist.cell(1, 2).string('Địa chỉ 1').style(headerStyle);
        worksheetHist.cell(1, 3).string('Số lượng').style(headerStyle);
        worksheetHist.cell(1, 4).string('Địa chỉ 2').style(headerStyle);
        worksheetHist.cell(1, 5).string('Ghi chú').style(headerStyle);
        worksheetHist.cell(1, 6).string('Id người nhập').style(headerStyle);
        worksheetHist.cell(1, 7).string('Người nhập').style(headerStyle);
        worksheetHist.cell(1, 8).string('Thời gian').style(headerStyle);

        // Ghi dữ liệu vào worksheet từ mảng đối tượng Product
        products.forEach((product, index) => {
            worksheet.cell(index + 2, 1).string(product.maSanPham);
            worksheet.cell(index + 2, 2).string(product.tenSanPham);
            worksheet.cell(index + 2, 3).string(product.maSanPhamQT);
            worksheet.cell(index + 2, 4).number(product.soLuongKho);
            worksheet.cell(index + 2, 5).number(product.soLuongNha);
            worksheet.cell(index + 2, 6).number(product.soLuongChuyenKho);
            worksheet.cell(index + 2, 7).number(product.soLuongXuatNgoai);
            worksheet.cell(index + 2, 8).number(product.soLuongConLai);
            worksheet.cell(index + 2, 9).number(product.soLuongTong);
        });

        // Ghi dữ liệu vào worksheetHist từ mảng đối tượng ProductHist
        productHists.forEach((hist, index) => {
            worksheetHist.cell(index + 2, 1).string(hist.maSanPham);
            worksheetHist.cell(index + 2, 2).string(hist.diaChi1);
            worksheetHist.cell(index + 2, 3).number(hist.soLuong);
            worksheetHist.cell(index + 2, 4).string(hist.diaChi2);
            worksheetHist.cell(index + 2, 5).string(hist.ghiChu);
            worksheetHist.cell(index + 2, 6).string(hist.idNguoiNhap);
            worksheetHist.cell(index + 2, 7).string(hist.nguoiNhap);
            worksheetHist.cell(index + 2, 8).string(hist.thoiGian);
        });

        let date = Common.get_CurrentDate();
        // Lưu workbook vào một file Excel
        const excelFileName = 'public/ceool_product_' + date + '.xlsx';
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