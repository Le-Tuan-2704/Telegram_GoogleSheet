function formatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return month + '/' + day + '/' + year;
}
function formatTime(date) {
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    return hours + ':' + minutes + ':' + seconds;
}

function get_CurrentDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    return `${day}_${month}_${year}`;
}

function convertTimestampToDateTime(params) {
    var date = new Date(params * 1000);
    var dt = formatDate(date) + ' ' + formatTime(date);
    return dt;
}

function separateTextAndNumber(inputString) {
    const match = inputString.match(/^(-?\d+)([a-zA-Z]+)?$/);

    if (match) {
        const negativeNumber = match[1];
        const textPart = match[2] || '';

        return {
            str: textPart,
            num: parseInt(negativeNumber)
        };
    } else {
        throw Error("Không thể tách chữ và số từ chuỗi.");
    }
}

function convertMoney(amount) {
    // Kiểm tra xem amount có phải là số hay không
    if (typeof amount !== 'number') {
        return 'Invalid input';
    }

    // Sử dụng toLocaleString để định dạng số và thay thế ký hiệu đồng bằng "VND"
    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).replace(/₫/g, 'VND');
}

module.exports = {
    convertTimestampToDateTime,
    separateTextAndNumber,
    convertMoney,
    formatDate,
    formatTime,
    get_CurrentDate,
}
