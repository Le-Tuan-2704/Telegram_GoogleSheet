const Excel = require("./excel");
const TelegramBot = require('node-telegram-bot-api');
const Common = require("../common");
const Enum = require("../enum");
const SendFile = require("./sendFile");
const { ProductList } = require("./model");
require('dotenv').config();
const schedule = require('node-schedule');

let bot;
let chatId = process.env.GROUP_ID_TELE_EXPORT_PRODUCT;

const job = schedule.scheduleJob('0 22 * * *', function () {
    getProduct('thongke');
});

function start() {

    Excel.init()

    // replace the value below with the Telegram token you receive from @BotFather
    const token = process.env.TOKEN_TELE;

    // Create a bot that uses 'polling' to fetch new updates
    bot = new TelegramBot(token, { polling: true });

    bot.on('message', async (message) => {
        let namePeopleSend = message.from.first_name + message.from.last_name;
        let idPeopleSend = message.from.id;
        chatId = message.chat.id;
        let chatType = message.chat.type;
        let dataSend = message.date;
        let textSend = message.text.trim();
        let chatBotId = message.from.id;

        let messageSendTele = "";
        try {
            if (chatId.toString() == process.env.GROUP_ID_TELE_EXPORT_PRODUCT && chatType == "supergroup") {
                let res = null;
                if (textSend == ".") {
                    messageSendTele = Enum.formatMessage;
                    bot.sendMessage(chatId, messageSendTele);
                } else if (textSend.includes('thongke')) {
                    res = await getProduct(textSend);
                } else {
                    var dateTime = Common.convertTimestampToDateTime(dataSend);
                    // xử lý text
                    let req = { ...handelMessage(textSend), idPeopleSend, namePeopleSend, dateTime };

                    res = await updateProduct(req);
                    messageSendTele = JSON.stringify(res);
                    bot.sendMessage(chatId, messageSendTele);
                }
            }
        } catch (error) {
            messageSendTele = error.message;
            bot.sendMessage(chatId, messageSendTele);
        }
    })
}

async function getProduct(req) {
    let ProductList = await Excel.get("");
    let [textKey, maSanPham] = req.split(/\s+/);
    let response = null;
    if (maSanPham) {
        maSanPham = maSanPham.toUpperCase();
        response = ProductList.find(function (product) {
            if (product.maSanPham == maSanPham) {
                return product;
            };
        });
        if (!response) {
            throw Error("Mã sản phẩm không đúng.")
        }

        messageSendTele = JSON.stringify(response);
        bot.sendMessage(chatId, messageSendTele);
        return;
    } else {
        const ProductHistAll = await Excel.getHist("");
        const today = Common.formatDate(new Date());

        let ProductHistToday = ProductHistAll.filter(function (obj) {
            let dateObj = Common.formatDate(new Date(obj.thoiGian));
            return dateObj === today;
        });

        let excelFileName = await SendFile.generateExcel(ProductList, ProductHistToday);

        const fileOptions = {
            filename: excelFileName,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };

        bot.sendDocument(chatId, excelFileName, { disable_notification: true });
    }
}

async function updateProduct(req) {
    // lấy danh sách các mã sản phẩm
    let productList = await Excel.get("");

    let indexProduct = 0;
    // tìm mã sản phẩm thay đổi, và index trong sheet đó
    let productObj = productList.find(function (product, index) {
        if (product.maSanPham == req.maSanPham) {
            indexProduct = index + 2;
            return product;
        };
    });

    if (!productObj) {
        throw Error("Mã sản phẩm Không Chính Xác!");
    }

    // xử lý dữ liệu để update
    if (req.diaChi1 == Enum.enumAddress['k']) {
        productObj.soLuongKho += req.soLuong;
        if (productObj.soLuongKho < 0) {
            throw Error("Kho không đủ số lượng xuất");
        }
    } else if (req.diaChi1 == Enum.enumAddress['n']) {
        productObj.soLuongNha += req.soLuong;
        if (productObj.soLuongNha < 0) {
            throw Error("Nhà không đủ số lượng xuất");
        }
    }

    if (req.soLuong && req.diaChi2) {
        // nhận từ địa chỉ này sang địa chỉ kia(phải có số lượng xuất mới nhận được)
        if (Math.abs(productObj.soLuongChuyenKho) < req.soLuong) {
            throw Error("Số lượng xuất chưa đủ! xin xuất thêm(số lượng xuất là: " + productObj.soLuongChuyenKho + ")!");
        }

        productObj.soLuongChuyenKho -= req.soLuong;
    }

    if (req.soLuong < 0 && !req.diaChi2) {
        productObj.soLuongXuatNgoai -= req.soLuong;
    }


    productObj.soLuongConLai = productObj.soLuongKho + productObj.soLuongNha;

    productObj.soLuongTong = productObj.soLuongKho + productObj.soLuongNha + Math.abs(productObj.soLuongChuyenKho) + productObj.soLuongXuatNgoai;

    // update dòng index
    await Excel.update(indexProduct, productObj);
    // thêm vào sheet lịch sử
    await Excel.insertHist(req);
    // lấy ra dòng index
    return await Excel.get(indexProduct);
}

function handelMessage(reqStr) {
    reqStr = reqStr.trim();
    const firstDotIndex = reqStr.indexOf('.');
    const mainPart = firstDotIndex !== -1 ? reqStr.slice(0, firstDotIndex) : reqStr;

    let [maSanPham, diaChi1, soLuong, diaChi2] = mainPart.split(/\s+/);

    soLuong = parseInt(soLuong);

    const ghiChu = firstDotIndex !== -1 ? reqStr.slice(firstDotIndex + 1).trim() : ""; // Ghi chú có thể rỗng

    if (diaChi2 && !Enum.enumAddress[diaChi2.toLowerCase()]) {
        throw Error("Chuỗi không khớp với mẫu.");
    }

    if (maSanPham && Enum.enumAddress[diaChi1.toLowerCase()] && soLuong) {
        const resultObject = {
            maSanPham: maSanPham.toUpperCase(),
            diaChi1: Enum.enumAddress[diaChi1.toLowerCase()],
            soLuong: soLuong,
            diaChi2: diaChi2 ? Enum.enumAddress[diaChi2.toLowerCase()] : "",
            ghiChu: ghiChu || "",
        };
        return resultObject;
    } else {
        throw Error("Chuỗi không khớp với mẫu.");
    }
}


module.exports = {
    start,
}