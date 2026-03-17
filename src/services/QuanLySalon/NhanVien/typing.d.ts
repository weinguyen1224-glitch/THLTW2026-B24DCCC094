declare module NhanVien {
	export interface IRecord {
		_id?: string;
		ma: string;
		ten: string;
		sdt: string;
		email?: string;
		diaChi?: string;
		ngaySinh?: string;
		chucVu?: string;
		anhDaiDien?: string;
		soKhachGioiHan: number;
		soKhachDaPhucVu?: number;
		lichLamViec: ILichLamViec[];
		trangThai: 'hoatDong' | 'nghiViec';
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ILichLamViec {
		thu: number;
		gioBatDau: string;
		gioKetThuc: string;
	}
}
