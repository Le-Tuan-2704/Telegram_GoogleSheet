class ProductList {
    constructor(maSanPham, tenSanPham, maSanPhamQT, soLuongKho, soLuongNha, soLuongChuyenKho, soLuongXuatNgoai, soLuongConLai, soLuongTong) {
        this.maSanPham = maSanPham || "";
        this.tenSanPham = tenSanPham || "";
        this.maSanPhamQT = maSanPhamQT || "";
        this.soLuongKho = parseInt(soLuongKho) || 0;
        this.soLuongNha = parseInt(soLuongNha) || 0;
        this.soLuongChuyenKho = parseInt(soLuongChuyenKho) || 0;
        this.soLuongXuatNgoai = parseInt(soLuongXuatNgoai) || 0;
        this.soLuongConLai = parseInt(soLuongConLai) || 0;
        this.soLuongTong = parseInt(soLuongTong) || 0;
    }
}

class ProductHist {
    constructor(maSanPham, diaChi1, soLuong, diaChi2, ghiChu, idNguoiNhap, nguoiNhap, thoiGian) {
        this.maSanPham = maSanPham || "";
        this.diaChi1 = diaChi1 || "";
        this.soLuong = parseInt(soLuong) || 0;
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