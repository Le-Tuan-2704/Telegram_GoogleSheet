const Excel = require("./excel");
const TelegramBot = require('node-telegram-bot-api');
const Common = require("../common")
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
        let chatId = message.chat.id;
        let chatType = message.chat.type;
        let chatBotId = message.from.id;

        if (chatId.toString() == process.env.GROUP_ID_TELE_BALANCE_MASTER && chatType == "group") {
            var dateTime = Common.convertTimestampToDateTime(message.date);

            // xử lý text
            req = { ...handelMessage(message.text), time: dateTime };
            let res = await Excel.insert(req);

            bot.sendMessage(chatId, handelResponse(res));
        }
    })
}



function convertContent(reqObj) {
    const multiplier = {
        'k': 1000,
        'nghìn': 1000,
        'tr': 1000000,
        'triệu': 1000000
    };

    const multiplierUnit = {
        'chi': -1,
        'thu': 1,
        'cho_vay': -1,
        'tra_no': 1
    };

    let contentObj = Common.cupStringAndNumber(reqObj.content);
    const lowerStr = contentObj.str.toLowerCase();
    const lowerTitle = reqObj.title.toLowerCase();

    if (multiplier.hasOwnProperty(lowerStr)) {
        contentObj.num *= multiplier[lowerStr];
        if (multiplierUnit.hasOwnProperty(lowerTitle)) {
            contentObj.num *= multiplierUnit[lowerTitle];
        }

        reqObj.content = contentObj.num;
    }

    return reqObj;
}

function handelMessage(reqStr) {
    reqStr = reqStr.trim();

    // Sử dụng biểu thức chính quy để tìm tiêu đề, nội dung và mô tả
    const match = reqStr.match(/^\/([^ ]+) ([^\.]+)(?:\.(.+))?$/);

    if (match) {
        // match[1] chứa tiêu đề, match[2] chứa nội dung, match[3] chứa mô tả
        const reqObj = {
            title: match[1],
            content: match[2],
            describe: match[3] || ""
        };
        return convertContent(reqObj);
    } else {
        console.log("Không thể tìm thấy tiêu đề và nội dung.");
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