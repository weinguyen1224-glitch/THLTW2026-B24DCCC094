declare module DonDangKy {
	export interface IRecord {
		_id: string;
		hoTen: string;
		email: string;
		soDienThoai: string;
		gioiTinh: 'Nam' | 'Nữ' | 'Khác';
		diaChi: string;
		soTruong: string;
		cauLacBoId: string;
		cauLacBoTen?: string;
		lyDoDangKy: string;
		trangThai: 'Pending' | 'Approved' | 'Rejected';
		ghiChu?: string;
		lichSuThaoTac?: LichSuThaoTac.IRecord[];
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IFilter {
		trangThai?: 'Pending' | 'Approved' | 'Rejected';
		cauLacBoId?: string;
	}
}

declare module LichSuThaoTac {
	export interface IRecord {
		_id: string;
		hanhDong: 'Approved' | 'Rejected' | 'Updated';
		thoiGian: string;
		nguoiThucHien: string;
		ghiChu?: string;
	}
}
