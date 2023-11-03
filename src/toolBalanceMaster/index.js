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
        let chatId = message.chat.id;
        let chatType = message.chat.type;
        let chatBotId = message.from.id;


        let messageSendTele = "";
        try {
            if (chatId.toString() == process.env.GROUP_ID_TELE_BALANCE_MASTER && chatType == "group") {
                var dateTime = Common.convertTimestampToDateTime(message.date);

                // xử lý text
                req = { ...handelMessage(message.text), time: dateTime };
                let res = await Excel.insert(req);
                messageSendTele = handelResponse(res);
            }
        } catch (error) {
            messageSendTele = error.message;
        } finally {
            console.log(messageSendTele);
            bot.sendMessage(chatId, messageSendTele);
        }
    })
}

function handelMessage(reqStr) {
    reqStr = reqStr.trim();
    console.log(reqStr);
    // Sử dụng biểu thức chính quy để tìm tiêu đề, nội dung và mô tả
    const match = reqStr.match(/^\/([^ ]+) ([^\.]+)(?:\.(.+))?$/);
    console.log(match);

    if (match) {
        // match[1] chứa tiêu đề, match[2] chứa nội dung, match[3] chứa mô tả
        const reqObj = {
            title: match[1],
            content: match[2],
            describe: match[3] || ""
        };
        return handelContent(reqObj);
    } else {
        throw Error("Sai cú pháp! Không thể tìm thấy tiêu đề và nội dung.");
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