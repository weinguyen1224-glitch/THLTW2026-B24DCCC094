export type MucDoKho = 'de' | 'trung_binh' | 'kho' | 'rat_kho';

export interface KhoiKienThuc {
	id: string;
	ten: string;
	moTa?: string;
}

export interface MonHoc {
	id: string;
	maMon: string;
	tenMon: string;
	soTinChi: number;
	khoiKienThucIds?: string[];
}

export interface CauHoi {
	id: string;
	maCauHoi: string;
	monHocId: string;
	nộiDung: string;
	mucDoKho: MucDoKho;
	khoiKienThucId: string;
	ngayTao?: string;
}

export interface CauTrucDeThi {
	id: string;
	ten: string;
	monHocId: string;
	soCauDe: number;
	soCauTrungBinh: number;
	soCauKho: number;
	soCauRatKho: number;
	khoiKienThucIds: string[];
}

export interface DeThi {
	id: string;
	maDeThi: string;
	ten: string;
	monHocId: string;
	cauHoiIds: string[];
	ngayTao: string;
	nguoiTao?: string;
}

export interface ThongTinCauTruc {
	soCauDe: number;
	soCauTrungBinh: number;
	soCauKho: number;
	soCauRatKho: number;
}
