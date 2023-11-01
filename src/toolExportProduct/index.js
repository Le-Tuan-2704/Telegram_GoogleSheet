const Excel = require("./excel");
const TelegramBot = require('node-telegram-bot-api');
const Common = require("../common");
const Enum = require("../enum");
require('dotenv').config();

function start() {


    Excel.init()

    // replace the value below with the Telegram token you receive from @BotFather
    const token = process.env.TOKEN_TELE;

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: true });

    bot.on('message', async (message) => {
        // console.log(message);
        let req;
        let namePeopleSend = message.from.first_name + message.from.last_name;
        let idPeopleSend = message.from.id;
        let chatId = message.chat.id;
        let chatType = message.chat.type;
        let dataSend = message.date;
        let textSend = message.text;
        let chatBotId = message.from.id;


        let messageSendTele = "";
        try {
            if (chatId.toString() == process.env.GROUP_ID_TELE_BALANCE_MASTER && chatType == "supergroup") {
                var dateTime = Common.convertTimestampToDateTime(dataSend);

                // xử lý text
                req = { ...handelMessage(textSend), idPeopleSend, namePeopleSend, dateTime };
                console.log(req);
                // let res = await Excel.insert(req);
                // messageSendTele = handelResponse(res);
            }
        } catch (error) {
            messageSendTele = error.message;
        } finally {
            console.log(messageSendTele);
            // bot.sendMessage(chatId, messageSendTele);
        }
    })
}

function handelMessage(reqStr) {
    reqStr = reqStr.trim();
    const firstDotIndex = reqStr.indexOf('.');
    const mainPart = firstDotIndex !== -1 ? reqStr.slice(0, firstDotIndex) : reqStr;

    const [maSP, noiXuat, soLuong, noiNhap] = mainPart.split(/\s+/);

    const ghiChu = firstDotIndex !== -1 ? reqStr.slice(firstDotIndex + 1).trim() : ""; // Ghi chú có thể rỗng

    if (maSP && noiXuat && soLuong) {
        const resultObject = {
            maSP,
            noiXuat,
            soLuong: parseInt(soLuong), // Chuyển đổi chuỗi số thành số nguyên
            noiNhap: noiNhap || "", // Nơi nhập có thể rỗng
            ghiChu: ghiChu || "", // Ghi chú có thể rỗng
        };
        return handelContent(resultObject);
    } else {
        throw Error("Chuỗi không khớp với mẫu.");
    }
}

function handelContent(reqObj) {
    let contentObj = Common.cupStringAndNumber(reqObj.content);
    const lowerStr = contentObj.str.toLowerCase();
    const lowerTitle = reqObj.title.toLowerCase();


    if (Enum.multiplierUnit.hasOwnProperty(lowerTitle)) {
        contentObj.num *= Enum.multiplierUnit[lowerTitle];
        if (Enum.multiplier.hasOwnProperty(lowerStr)) {
            contentObj.num *= Enum.multiplier[lowerStr];
        }

        reqObj.content = contentObj.num;
    } else {
        throw Error('Cú pháp không đúng!');
    }

    return reqObj;
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