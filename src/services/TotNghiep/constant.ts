export enum EDotTrangThai {
	DANG_MO = 'DANG_MO',
	DA_KHOA = 'DA_KHOA',
	HUY = 'HUY',
}

export const TenDotTrangThai: Record<EDotTrangThai, string> = {
	[EDotTrangThai.DANG_MO]: 'Đang mở',
	[EDotTrangThai.DA_KHOA]: 'Đã khóa',
	[EDotTrangThai.HUY]: 'Hủy',
};

export const ColorDotTrangThai: Record<EDotTrangThai, string> = {
	[EDotTrangThai.DANG_MO]: 'green',
	[EDotTrangThai.DA_KHOA]: 'orange',
	[EDotTrangThai.HUY]: 'red',
};

export enum EHoSoTrangThai {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
}

export const TenHoSoTrangThai: Record<EHoSoTrangThai, string> = {
	[EHoSoTrangThai.CHO_DUYET]: 'Chờ duyệt',
	[EHoSoTrangThai.DA_DUYET]: 'Đã duyệt',
	[EHoSoTrangThai.TU_CHOI]: 'Từ chối',
};

export const ColorHoSoTrangThai: Record<EHoSoTrangThai, string> = {
	[EHoSoTrangThai.CHO_DUYET]: 'orange',
	[EHoSoTrangThai.DA_DUYET]: 'green',
	[EHoSoTrangThai.TU_CHOI]: 'red',
};

export enum EVanBangTrangThai {
	CHUA_CAP = 'CHUA_CAP',
	DA_CAP = 'DA_CAP',
	DA_TRA = 'DA_TRA',
}

export const TenVanBangTrangThai: Record<EVanBangTrangThai, string> = {
	[EVanBangTrangThai.CHUA_CAP]: 'Chưa cấp',
	[EVanBangTrangThai.DA_CAP]: 'Đã cấp',
	[EVanBangTrangThai.DA_TRA]: 'Đã trả',
};

export const ColorVanBangTrangThai: Record<EVanBangTrangThai, string> = {
	[EVanBangTrangThai.CHUA_CAP]: 'orange',
	[EVanBangTrangThai.DA_CAP]: 'blue',
	[EVanBangTrangThai.DA_TRA]: 'green',
};

export enum EXepLoai {
	XUAT_SAC = 'XUAT_SAC',
	GIOI = 'GIOI',
	KHA = 'KHA',
	TRUNG_BINH_KHA = 'TRUNG_BINH_KHA',
	TRUNG_BINH = 'TRUNG_BINH',
}

export const TenXepLoai: Record<EXepLoai, string> = {
	[EXepLoai.XUAT_SAC]: 'Xuất sắc',
	[EXepLoai.GIOI]: 'Giỏi',
	[EXepLoai.KHA]: 'Khá',
	[EXepLoai.TRUNG_BINH_KHA]: 'Trung bình khá',
	[EXepLoai.TRUNG_BINH]: 'Trung bình',
};

export enum ELoaiTruyCap {
	TRA_VAN_BANG = 'TRA_VAN_BANG',
	XEM_THONG_KE = 'XEM_THONG_KE',
}

export const TenLoaiTruyCap: Record<ELoaiTruyCap, string> = {
	[ELoaiTruyCap.TRA_VAN_BANG]: 'Tra cứu văn bằng',
	[ELoaiTruyCap.XEM_THONG_KE]: 'Xem thống kê',
};
