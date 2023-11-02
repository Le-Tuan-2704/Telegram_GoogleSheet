const Excel = require("./excel");
const TelegramBot = require('node-telegram-bot-api');
const Common = require("../common");
const Enum = require("../enum");
const { ProductList } = require("./model");
require('dotenv').config();

function start() {

    Excel.init()

    // replace the value below with the Telegram token you receive from @BotFather
    const token = process.env.TOKEN_TELE;

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: true });

    bot.on('message', async (message) => {
        let namePeopleSend = message.from.first_name + message.from.last_name;
        let idPeopleSend = message.from.id;
        let chatId = message.chat.id;
        let chatType = message.chat.type;
        let dataSend = message.date;
        let textSend = message.text.trim();
        let chatBotId = message.from.id;
        try {
            let messageSendTele = "";

            if (chatId.toString() == process.env.GROUP_ID_TELE_EXPORT_PRODUCT && chatType == "supergroup") {
                let res = null;
                switch (textSend) {
                    case ".":
                        messageSendTele = Enum.formatMessage;
                        break;
                    case "thongke":
                        res = await Excel.getHist("");
                        messageSendTele = JSON.stringify(res);
                        break;
                    default:
                        var dateTime = Common.convertTimestampToDateTime(dataSend);
                        // xử lý text
                        let req = { ...handelMessage(textSend), idPeopleSend, namePeopleSend, dateTime };

                        res = await updateProduct(req);
                        console.log('res', res);
                        messageSendTele = JSON.stringify(res);
                        break;
                }
            }
        } catch (error) {
            messageSendTele = error.message;
        } finally {
            console.log(messageSendTele);
            bot.sendMessage(chatId, messageSendTele);
        }
    })
}

async function updateProduct(req) {
    // thêm vào sheet lịch sử
    await Excel.insertHist(req);

    // lấy danh sách các mã sản phẩm
    productArray = await Excel.get("");

    let indexProduct = 0;
    // tìm mã sản phẩm thay đổi, và index trong sheet đó
    let product = productArray.filter(function (iRow, index) {
        if (iRow[0] == req.maSanPham) {
            indexProduct = index + 1;
            return iRow;
        };
    });

    // Tạo mảng đối tượng từ mảng productList
    const [maSanPham, tenSanPham, maSanPhamQT, soLuongKho, soLuongNha, soLuongChuyenKho, soLuongXuatNgoai, soLuongConLai, soLuongTong] = product[0];
    let productObj = new ProductList(maSanPham, tenSanPham, maSanPhamQT, soLuongKho, soLuongNha, soLuongChuyenKho, soLuongXuatNgoai, soLuongConLai, soLuongTong);

    console.log('productObj', productObj);

    // xử lý dữ liệu để update
    if (req.diaChi1 == Enum.enumAddress['k']) {
        productObj.soLuongKho += req.soLuong;
    } else if (req.diaChi1 == Enum.enumAddress['n']) {
        productObj.soLuongNha += req.soLuong;
    }

    if (req.soLuong && req.diaChi2) {
        productObj.soLuongChuyenKho -= req.soLuong;
    }

    if (req.soLuong < 0 && !req.diaChi2) {
        productObj.soLuongXuatNgoai += req.soLuong;
    }

    // update dòng index
    await Excel.update(indexProduct, productObj);

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

    if (maSanPham && diaChi1 && soLuong) {
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


function handelResponse(params) {
    let res = params.values[0];
    let totalRow = res[0];
    let amountMoney = Common.convertMoney(Number(res[1]));

    return `totalRow = ${totalRow} \n amountMoney = ${amountMoney}`;
}


module.exports = {
    start,
}