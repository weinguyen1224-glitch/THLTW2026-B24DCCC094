export enum LoaiDiemDen {
	BIEN = 'bien',
	NUI = 'nui',
	THANH_PHO = 'thanh_pho',
}

export enum LoaiChiPhi {
	AN_UONG = 'an_uong',
	DI_CHUYEN = 'di_chuyen',
	LUU_TRU = 'luu_tru',
	GIAI_TRI = 'giai_tri',
	KHAC = 'khac',
}

export interface ChiPhi {
	loai: LoaiChiPhi;
	soTien: number;
	moTa?: string;
}

export interface DiemDen {
	id: string;
	ten: string;
	diaChi: string;
	loai: LoaiDiemDen;
	hinhAnh: string;
	moTa: string;
	thoiGianThamQuan: number;
	chiPhiAnUong: number;
	chiPhiLuuTru: number;
	chiPhiDiChuyen: number;
	rating: number;
	giaMin: number;
	giaMax: number;
}

export interface DiemDenTrongLichTrinh {
	diemDenId: string;
	thuTu: number;
	thoiGianBatDau?: string;
	thoiGianKetThuc?: string;
}

export interface NgayLichTrinh {
	ngay: string;
	cacDiemDen: DiemDenTrongLichTrinh[];
}

export interface LichTrinh {
	id: string;
	ten: string;
	ngayBatDau: string;
	ngayKetThuc: string;
	cacNgay: NgayLichTrinh[];
	tongNganSach: number;
	tongChiPhiThucTe: number;
	trangThai: 'dang_lap' | 'da_hoan_thanh' | 'da_huy';
	ngayTao: string;
}

export interface NganSach {
	lichTrinhId: string;
	tongNganSach: number;
	chiPhiTheoLoai: Record<LoaiChiPhi, number>;
	chiPhiTheoNgay: Record<string, number>;
	daChi: number;
	conLai: number;
	vuotNganSach: boolean;
}

export interface ThongKe {
	soLichTrinhTheoThang: Record<string, number>;
	diemDenPhoBien: Array<{ diemDenId: string; ten: string; soLan: number }>;
	tongTienThuVe: number;
	tongTienTheoHangMuc: Record<LoaiChiPhi, number>;
}
