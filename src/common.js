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

function convertTimestampToDateTime(params) {
    var date = new Date(params * 1000);
    var dt = formatDate(date) + ' ' + formatTime(date);
    return dt;
}

function cupStringAndNumber(chuoi) {
    // Loại bỏ dấu cách
    chuoi = chuoi.replace(/\s/g, '');

    // Tách chữ và số
    var phanChu = chuoi.replace(/[0-9]/g, '');
    var phanSo = parseInt(chuoi.replace(/\D/g, ''), 10);

    return { str: phanChu, num: phanSo };
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
    cupStringAndNumber,
    convertMoney,
}
