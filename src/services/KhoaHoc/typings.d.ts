declare module KhoaHoc {
	export type TrangThai = 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';

	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		giangVien: string;
		soLuongHocVien: number;
		moTa: string;
		trangThai: TrangThai;
		createdAt?: string;
		updatedAt?: string;
	}
}
