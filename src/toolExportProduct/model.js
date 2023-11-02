class ProductList {
    constructor(maSanPham, tenSanPham, maSanPhamQT, soLuongKho, soLuongNha, soLuongChuyenKho, soLuongXuatNgoai, soLuongConLai, soLuongTong) {
        this.maSanPham = maSanPham || "";
        this.tenSanPham = tenSanPham || "";
        this.maSanPhamQT = maSanPhamQT || "";
        this.soLuongKho = soLuongKho || 0;
        this.soLuongNha = soLuongNha || 0;
        this.soLuongChuyenKho = soLuongChuyenKho || 0;
        this.soLuongXuatNgoai = soLuongXuatNgoai || 0;
        this.soLuongConLai = soLuongConLai || 0;
        this.soLuongTong = soLuongTong || 0;
    }
}

class ProductHist {
    constructor(diaChi1, soLuong, diaChi2, ghiChu, idNguoiNhap, nguoiNhap, thoiGian) {
        this.diaChi1 = diaChi1 || "";
        this.soLuong = soLuong || 0;
        this.diaChi2 = diaChi2 || "";
        this.ghiChu = ghiChu || "";
        this.idNguoiNhap = idNguoiNhap || "";
        this.nguoiNhap = nguoiNhap || "";
        this.thoiGian = thoiGian || "";
    }
}

module.exports = {
    ProductList,
    ProductHist
}