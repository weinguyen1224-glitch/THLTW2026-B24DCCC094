export namespace NhanVien {
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

export namespace DichVu {
	export interface IRecord {
		_id?: string;
		ma: string;
		ten: string;
		moTa?: string;
		gia: number;
		thoiGianThucHien: number;
		anhDaiDien?: string;
		trangThai: 'hoatDong' | 'khongHoatDong';
		createdAt?: string;
		updatedAt?: string;
	}
}

export namespace LichHen {
	export type ETrangThai = 'choDuyet' | 'xacNhan' | 'hoanThanh' | 'huy';

	export interface IRecord {
		_id?: string;
		ma: string;
		khachHang: IKhachHang;
		nhanVienId: string;
		nhanVien?: NhanVien.IRecord;
		dichVuId: string;
		dichVu?: DichVu.IRecord;
		ngayHen: string;
		gioHen: string;
		trangThai: ETrangThai;
		ghiChu?: string;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface IKhachHang {
		ten: string;
		sdt: string;
		email?: string;
	}
}

export namespace DanhGia {
	export interface IRecord {
		_id?: string;
		lichHenId: string;
		nhanVienId: string;
		nhanVien?: NhanVien.IRecord;
		dichVuId: string;
		dichVu?: DichVu.IRecord;
		khachHang: string;
		soSao: number;
		noiDung?: string;
		phanHoi?: IPhanHoi;
		createdAt?: string;
	}

	export interface IPhanHoi {
		noiDung: string;
		ngayPhanHoi: string;
	}
}
