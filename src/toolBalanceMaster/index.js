const Excel = require("./excel");
const TelegramBot = require('node-telegram-bot-api');
const Common = require("../common");
const Enum = require("../enum");
const SendFile = require("./sendFile");
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
        // console.log(message);
        let req;
        chatId = message.chat.id;
        let chatType = message.chat.type;
        let dataSend = message.date;
        let textSend = message.text.trim();
        let chatBotId = message.from.id;


        let messageSendTele = "";
        try {
            if (chatId.toString() == process.env.GROUP_ID_TELE_BALANCE_MASTER && chatType == "supergroup") {
                let res = null;
                if (textSend == ".") {
                    messageSendTele = Enum.formatMessBalence;
                    bot.sendMessage(chatId, messageSendTele);
                } else if (textSend.includes('thongke')) {
                    res = await getBalance(textSend);
                } else {
                    var dateTime = Common.convertTimestampToDateTime(dataSend);
                    // xử lý text
                    let req = { ...handelMessage(textSend), dateTime };

                    res = await insertBalace(req);

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

async function getBalance(req) {

}

async function insertBalace(req) {
    await Excel.insert(req);
    let rowTotalList = await Excel.get(2);
    if (rowTotalList.length == 1) {
        let rowTotal = rowTotalList[0];
        let totalRow = rowTotal.key;
        let amountMoney = Common.convertMoney(rowTotal.money);
        return `totalRow = ${totalRow} \n amountMoney = ${amountMoney}`
    }

}

function handelMessage(reqStr) {
    reqStr = reqStr.trim();
    const firstDotIndex = reqStr.indexOf('.');
    const mainPart = firstDotIndex !== -1 ? reqStr.slice(0, firstDotIndex) : reqStr;

    let [key, money] = mainPart.split(/\s+/);
    key = key.trim().toUpperCase();

    money = convertUnitMoney(money.trim());

    const note = firstDotIndex !== -1 ? reqStr.slice(firstDotIndex + 1).trim() : ""; // Ghi chú có thể rỗng
    let title;
    [key, title] = convertTitle(key, money);

    if (money) {
        const reqObj = {
            key: key,
            title: title,
            money: money,
            note: note || ""
        };
        return reqObj;
    } else {
        throw Error("Sai cú pháp! Không thể tìm thấy tiêu đề và nội dung.");
    }
}

function convertTitle(key, money) {
    let title;
    if (key == 'T' || key == "") {
        if (money < 0) {
            throw Error("Lỗi! Thu không thể nhỏ hơn 0");
        }
        key = 'T';
        title = "Thu";
    }
    if (key == 'CĐ' || key == 'CD') {
        if (money > 0) {
            throw Error("Lỗi! Chi không thể lớn hơn 0");
        }
        key = 'CD';
        title = 'Chi cố định';
    }
    if (key == 'KCĐ' || key == 'KCD') {
        if (money > 0) {
            throw Error("Lỗi! Chi không thể lớn hơn 0");
        }
        key = 'KCD';
        title = 'Chi biến động';
    }
    if (key == "V" && money > 0) {
        key = "V+";
        title = "Đi vay";
    }
    if (key == "V" && money < 0) {
        key = "V-";
        title = "Cho vay";
    }
    if (key == "TN" && money > 0) {
        key = "TN+";
        title = "Được trả nợ";
    }
    if (key == "TN" && money < 0) {
        key = "TN-";
        title = "Đi trả nợ";
    }
    return [key, title];
}

function convertUnitMoney(money) {
    let moneyObj = Common.separateTextAndNumber(money);
    const moneyStr = moneyObj.str.toLowerCase();
    let moneyNumber;
    if (Enum.multiplier.hasOwnProperty(moneyStr) && moneyObj.num !== 0) {
        moneyNumber = moneyObj.num * Enum.multiplier[moneyStr];
    } else {
        throw Error('Cú pháp không đúng!');
    }
    return moneyNumber;
}


module.exports = {
    start,
}