export type LuaChon = 'keo' | 'bua' | 'bao';

export interface KetQuaVanDau {
	id: number;
	luaChonNguoiChoi: LuaChon;
	luaChonMayTinh: LuaChon;
	ketQua: 'thang' | 'thua' | 'hoa';
	thoiGian: string;
}

export interface ThongTinTroChoi {
	soVanThang: number;
	soVanThua: number;
	soVanHoa: number;
	tongSoVan: number;
}
