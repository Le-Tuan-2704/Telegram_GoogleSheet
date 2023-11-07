class BalanceList {
    constructor(key, title, money, note, datetime) {
        this.key = key;
        this.title = title;
        this.money = money;
        this.note = note || "";
        this.datetime = datetime;
    }
}

module.exports = {
    BalanceList,
}