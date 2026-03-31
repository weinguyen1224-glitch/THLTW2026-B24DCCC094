declare module CauLacBo {
	export interface IRecord {
		_id: string;
		ten: string;
		anhDaiDien?: string;
		ngayThanhLap?: string;
		moTa?: string;
		chuNhiem: string;
		hoatDong: boolean;
		soThanhVien?: number;
		createdAt?: string;
		updatedAt?: string;
	}
}
