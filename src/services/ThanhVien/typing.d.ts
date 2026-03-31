declare module ThanhVien {
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
		ngayThamGia?: string;
		trangThai: 'Active' | 'Inactive';
		createdAt?: string;
		updatedAt?: string;
	}
}
