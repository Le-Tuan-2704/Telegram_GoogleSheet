const multiplier = {
    'k': 1000,
    'nghìn': 1000,
    'tr': 1000000,
    'triệu': 1000000
};

const enumAddress = {
    'k': 'Kho',
    'n': 'Nhà'
}

const formatMessProduct = '(Mã sản phẩm) (nơi xuất) (số lượng) (nơi nhập). (ghi chú)\
                        \ntrong đó "nơi xuất" và "nơi nhập": "k hoặc n"\
                        \n"số lượng": - xuất, + nhập\
                        \n"nơi nhập" và "ghi chú" có thể rổng\
                        \n ví dụ: M01 k -3 n. Ghi chú';

const formatMessBalence = '(Mã sản phẩm) (nơi xuất) (số lượng) (nơi nhập). (ghi chú)\
                        \ntrong đó "nơi xuất" và "nơi nhập": "k hoặc n"\
                        \n"số lượng": - xuất, + nhập\
                        \n"nơi nhập" và "ghi chú" có thể rổng\
                        \n ví dụ: M01 k -3 n. Ghi chú';

module.exports = {
    multiplier,
    enumAddress,
    formatMessProduct,
    formatMessBalence
}