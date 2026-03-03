interface MonHoc {
	id: string;
	ten: string;
}

interface LichHoc {
	id: string;
	monHocId: string;
	ngay: string;
	khoangThoiGian: number;
	noiDung: string;
	ghiChu: string;
}

interface MucTieu {
	id: string;
	monHocId: string | null;
	thang: string;
	mucTieuGios: number;
}
