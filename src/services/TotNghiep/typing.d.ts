declare module TotNghiep {
	export interface IDotTotNghiep {
		_id: string;
		ma: string;
		ten: string;
		namHoc: string;
		hocKy: number;
		ngayBatDau: string;
		ngayKetThuc: string;
		trangThai: EDotTrangThai;
		ghiChu?: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IHoSoTotNghiep {
		_id: string;
		maSinhVien: string;
		hoTen: string;
		ngaySinh: string;
		gioiTinh: string;
		soCMND: string;
		noiSinh: string;
		danToc: string;
		queQuan: string;
		idDotTotNghiep: string;
		tenDotTotNghiep?: string;
		idNganh: string;
		tenNganh?: string;
		idKhoa: string;
		tenKhoa?: string;
		idHeDaoTao: string;
		tenHeDaoTao?: string;
		idKhoaSinhVien: string;
		tenKhoaSinhVien?: string;
		xepLoaiTotNghiep: EXepLoai;
		soQuyetDinh: string;
		ngayQuyetDinh: string;
		ngayCapBang?: string;
		trangThai: EHoSoTrangThai;
		ghiChu?: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IVanBang {
		_id: string;
		soVaoSo: number;
		soHieuVanBang: string;
		quyenSo: string;
		idHoSoTotNghiep: string;
		maSinhVien?: string;
		hoTen?: string;
		tenNganh?: string;
		idDotTotNghiep: string;
		tenDotTotNghiep?: string;
		ngayCap?: string;
		nguoiKy?: string;
		chucVuNguoiKy?: string;
		trangThai: EVanBangTrangThai;
		ngayTra?: string;
		nguoiNhan?: string;
		ghiChu?: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ICauHinhBienMau {
		_id: string;
		ten: string;
		mauSac: string;
		kichThuoc: string;
		fontChu: string;
		hinhDang: string;
		viTriDau: string;
		viTriChuKy: string;
		nguoiKyMacDinh?: string;
		chucVuKyMacDinh?: string;
		mauSacChu: string;
		kieuChu: string;
		moTa?: string;
		trangThai: boolean;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IThongKe {
		tongHoSo: number;
		hoSoChoDuyet: number;
		hoSoDaDuyet: number;
		hoSoTuChoi: number;
		tongVanBang: number;
		vanBangDaCap: number;
		vanBangChuaCap: number;
		vanBangDaTra: number;
		theoNganh: { tenNganh: string; soLuong: number }[];
		theoKhoa: { tenKhoa: string; soLuong: number }[];
		theoXepLoai: { xepLoai: string; soLuong: number }[];
		theoDot: { tenDot: string; soLuong: number }[];
	}

	export interface ILuotTruyCap {
		_id: string;
		soQuyetDinh: string;
		loaiTruyCap: ELoaiTruyCap;
		ipAddress: string;
		userAgent: string;
		thoiGian: string;
		ketQua: boolean;
		ghiChu?: string;
	}
}

declare enum EDotTrangThai {
	DANG_MO = 'DANG_MO',
	DA_KHOA = 'DA_KHOA',
	HUY = 'HUY',
}

declare enum EHoSoTrangThai {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
}

declare enum EVanBangTrangThai {
	CHUA_CAP = 'CHUA_CAP',
	DA_CAP = 'DA_CAP',
	DA_TRA = 'DA_TRA',
}

declare enum EXepLoai {
	XUAT_SAC = 'XUAT_SAC',
	GIOI = 'GIOI',
	KHA = 'KHA',
	TRUNG_BINH_KHA = 'TRUNG_BINH_KHA',
	TRUNG_BINH = 'TRUNG_BINH',
}

declare enum ELoaiTruyCap {
	TRA_VAN_BANG = 'TRA_VAN_BANG',
	XEM_THONG_KE = 'XEM_THONG_KE',
}
