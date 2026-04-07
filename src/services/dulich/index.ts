import { DiemDen, LichTrinh, NganSach, ThongKe, LoaiDiemDen } from './typing';

const DIEM_DEN_KEY = 'dulich_diem_den';
const LICH_TRINH_KEY = 'dulich_lich_trinh';
const NGAN_SACH_KEY = 'dulich_ngan_sach';
const THONG_KE_KEY = 'dulich_thong_ke';

class LocalStorageService {
	private luuDuLieu<T>(key: string, duLieu: T[]): void {
		localStorage.setItem(key, JSON.stringify(duLieu));
	}

	private layDuLieu<T>(key: string): T[] {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : [];
	}

	private taoId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	layTatCaDiemDen(): DiemDen[] {
		return this.layDuLieu<DiemDen>(DIEM_DEN_KEY);
	}

	layDiemDenTheoId(id: string): DiemDen | undefined {
		const danhSach = this.layTatCaDiemDen();
		return danhSach.find((item) => item.id === id);
	}

	themDiemDen(diemDen: Omit<DiemDen, 'id'>): DiemDen {
		const danhSach = this.layTatCaDiemDen();
		const moi: DiemDen = { ...diemDen, id: this.taoId() };
		danhSach.push(moi);
		this.luuDuLieu(DIEM_DEN_KEY, danhSach);
		return moi;
	}

	capNhatDiemDen(id: string, diemDen: Partial<DiemDen>): DiemDen | null {
		const danhSach = this.layTatCaDiemDen();
		const index = danhSach.findIndex((item) => item.id === id);
		if (index === -1) return null;
		danhSach[index] = { ...danhSach[index], ...diemDen };
		this.luuDuLieu(DIEM_DEN_KEY, danhSach);
		return danhSach[index];
	}

	xoaDiemDen(id: string): boolean {
		const danhSach = this.layTatCaDiemDen();
		const moi = danhSach.filter((item) => item.id !== id);
		if (moi.length === danhSach.length) return false;
		this.luuDuLieu(DIEM_DEN_KEY, moi);
		return true;
	}

	locDiemDen(dieuKien: { loai?: string; giaMin?: number; giaMax?: number; ratingMin?: number }): DiemDen[] {
		let ketQua = this.layTatCaDiemDen();
		if (dieuKien.loai) {
			ketQua = ketQua.filter((item) => item.loai === dieuKien.loai);
		}
		if (dieuKien.giaMin !== undefined) {
			ketQua = ketQua.filter((item) => item.giaMin >= dieuKien.giaMin!);
		}
		if (dieuKien.giaMax !== undefined) {
			ketQua = ketQua.filter((item) => item.giaMax <= dieuKien.giaMax!);
		}
		if (dieuKien.ratingMin !== undefined) {
			ketQua = ketQua.filter((item) => item.rating >= dieuKien.ratingMin!);
		}
		return ketQua;
	}

	sapXepDiemDen(danhSach: DiemDen[], tieuChi: 'gia' | 'rating', thuTu: 'tang' | 'giam'): DiemDen[] {
		return [...danhSach].sort((a, b) => {
			const giaA = tieuChi === 'gia' ? a.giaMin : a.rating;
			const giaB = tieuChi === 'gia' ? b.giaMin : b.rating;
			return thuTu === 'tang' ? giaA - giaB : giaB - giaA;
		});
	}

	layTatCaLichTrinh(): LichTrinh[] {
		return this.layDuLieu<LichTrinh>(LICH_TRINH_KEY);
	}

	layLichTrinhTheoId(id: string): LichTrinh | undefined {
		const danhSach = this.layTatCaLichTrinh();
		return danhSach.find((item) => item.id === id);
	}

	themLichTrinh(lichTrinh: Omit<LichTrinh, 'id' | 'ngayTao'>): LichTrinh {
		const danhSach = this.layTatCaLichTrinh();
		const moi: LichTrinh = { ...lichTrinh, id: this.taoId(), ngayTao: new Date().toISOString() };
		danhSach.push(moi);
		this.luuDuLieu(LICH_TRINH_KEY, danhSach);
		this.capNhatThongKe();
		return moi;
	}

	capNhatLichTrinh(id: string, lichTrinh: Partial<LichTrinh>): LichTrinh | null {
		const danhSach = this.layTatCaLichTrinh();
		const index = danhSach.findIndex((item) => item.id === id);
		if (index === -1) return null;
		danhSach[index] = { ...danhSach[index], ...lichTrinh };
		this.luuDuLieu(LICH_TRINH_KEY, danhSach);
		return danhSach[index];
	}

	xoaLichTrinh(id: string): boolean {
		const danhSach = this.layTatCaLichTrinh();
		const moi = danhSach.filter((item) => item.id !== id);
		if (moi.length === danhSach.length) return false;
		this.luuDuLieu(LICH_TRINH_KEY, moi);
		this.xoaNganSach(id);
		this.capNhatThongKe();
		return true;
	}

	tinhTongChiPhiLichTrinh(lichTrinh: LichTrinh): number {
		let tong = 0;
		const diemDenList = this.layTatCaDiemDen();
		lichTrinh.cacNgay.forEach((ngay) => {
			ngay.cacDiemDen.forEach((diem) => {
				const diemDen = diemDenList.find((d) => d.id === diem.diemDenId);
				if (diemDen) {
					tong += diemDen.chiPhiAnUong + diemDen.chiPhiLuuTru + diemDen.chiPhiDiChuyen;
				}
			});
		});
		return tong;
	}

	layNganSach(lichTrinhId: string): NganSach | undefined {
		const danhSach = this.layDuLieu<NganSach>(NGAN_SACH_KEY);
		return danhSach.find((item) => item.lichTrinhId === lichTrinhId);
	}

	taoNganSach(lichTrinhId: string, tongNganSach: number): NganSach {
		const danhSach = this.layDuLieu<NganSach>(NGAN_SACH_KEY);
		const lichTrinh = this.layLichTrinhTheoId(lichTrinhId);
		const tongChi = lichTrinh ? this.tinhTongChiPhiLichTrinh(lichTrinh) : 0;
		const moi: NganSach = {
			lichTrinhId,
			tongNganSach,
			chiPhiTheoLoai: {
				an_uong: 0,
				di_chuyen: 0,
				luu_tru: 0,
				giai_tri: 0,
				khac: 0,
			},
			chiPhiTheoNgay: {},
			daChi: tongChi,
			conLai: tongNganSach - tongChi,
			vuotNganSach: tongChi > tongNganSach,
		};
		danhSach.push(moi);
		this.luuDuLieu(NGAN_SACH_KEY, danhSach);
		return moi;
	}

	capNhatNganSach(lichTrinhId: string, nganSach: Partial<NganSach>): NganSach | null {
		const danhSach = this.layDuLieu<NganSach>(NGAN_SACH_KEY);
		const index = danhSach.findIndex((item) => item.lichTrinhId === lichTrinhId);
		if (index === -1) return null;
		danhSach[index] = { ...danhSach[index], ...nganSach };
		this.luuDuLieu(NGAN_SACH_KEY, danhSach);
		return danhSach[index];
	}

	xoaNganSach(lichTrinhId: string): void {
		const danhSach = this.layDuLieu<NganSach>(NGAN_SACH_KEY);
		const moi = danhSach.filter((item) => item.lichTrinhId !== lichTrinhId);
		this.luuDuLieu(NGAN_SACH_KEY, moi);
	}

	layThongKe(): ThongKe {
		return (
			this.layDuLieu<ThongKe>(THONG_KE_KEY)[0] || {
				soLichTrinhTheoThang: {},
				diemDenPhoBien: [],
				tongTienThuVe: 0,
				tongTienTheoHangMuc: {
					an_uong: 0,
					di_chuyen: 0,
					luu_tru: 0,
					giai_tri: 0,
					khac: 0,
				},
			}
		);
	}

	capNhatThongKe(): void {
		const lichTrinhList = this.layTatCaLichTrinh();
		const diemDenList = this.layTatCaDiemDen();
		const thongKe: ThongKe = {
			soLichTrinhTheoThang: {},
			diemDenPhoBien: [],
			tongTienThuVe: 0,
			tongTienTheoHangMuc: {
				an_uong: 0,
				di_chuyen: 0,
				luu_tru: 0,
				giai_tri: 0,
				khac: 0,
			},
		};

		lichTrinhList.forEach((lichTrinh) => {
			const thang = new Date(lichTrinh.ngayTao).toISOString().slice(0, 7);
			thongKe.soLichTrinhTheoThang[thang] = (thongKe.soLichTrinhTheoThang[thang] || 0) + 1;
			thongKe.tongTienThuVe += lichTrinh.tongNganSach;

			lichTrinh.cacNgay.forEach((ngay) => {
				ngay.cacDiemDen.forEach((diem) => {
					const diemDen = diemDenList.find((d) => d.id === diem.diemDenId);
					if (diemDen) {
						thongKe.tongTienTheoHangMuc.an_uong += diemDen.chiPhiAnUong;
						thongKe.tongTienTheoHangMuc.di_chuyen += diemDen.chiPhiDiChuyen;
						thongKe.tongTienTheoHangMuc.luu_tru += diemDen.chiPhiLuuTru;
					}
				});
			});
		});

		const diemDenCount: Record<string, number> = {};
		lichTrinhList.forEach((lichTrinh) => {
			lichTrinh.cacNgay.forEach((ngay) => {
				ngay.cacDiemDen.forEach((diem) => {
					diemDenCount[diem.diemDenId] = (diemDenCount[diem.diemDenId] || 0) + 1;
				});
			});
		});

		thongKe.diemDenPhoBien = Object.entries(diemDenCount)
			.map(([id, soLan]) => {
				const diemDen = diemDenList.find((d) => d.id === id);
				return { diemDenId: id, ten: diemDen?.ten || '', soLan };
			})
			.sort((a, b) => b.soLan - a.soLan)
			.slice(0, 10);

		this.luuDuLieu(THONG_KE_KEY, [thongKe]);
	}

	khoiTaoDuLieuMau(): void {
		if (this.layTatCaDiemDen().length === 0) {
			const diemDenMau: Omit<DiemDen, 'id'>[] = [
				{
					ten: 'Vịnh Hạ Long',
					diaChi: 'Quảng Ninh',
					loai: LoaiDiemDen.BIEN,
					hinhAnh: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
					moTa: 'Di sản thiên nhiên thế giới với hàng ngàn đảo đá vôi',
					thoiGianThamQuan: 480,
					chiPhiAnUong: 500000,
					chiPhiLuuTru: 1500000,
					chiPhiDiChuyen: 300000,
					rating: 4.8,
					giaMin: 2000000,
					giaMax: 5000000,
				},
				{
					ten: 'Phố cổ Hội An',
					diaChi: 'Quảng Nam',
					loai: LoaiDiemDen.THANH_PHO,
					hinhAnh: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
					moTa: 'Thành phố cổ với kiến trúc đặc sắc và đèn lồng',
					thoiGianThamQuan: 360,
					chiPhiAnUong: 300000,
					chiPhiLuuTru: 800000,
					chiPhiDiChuyen: 200000,
					rating: 4.7,
					giaMin: 1000000,
					giaMax: 3000000,
				},
				{
					ten: 'Đà Lạt',
					diaChi: 'Lâm Đồng',
					loai: LoaiDiemDen.NUI,
					hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
					moTa: 'Thành phố sương mù với khí hậu mát mẻ quanh năm',
					thoiGianThamQuan: 720,
					chiPhiAnUong: 400000,
					chiPhiLuuTru: 1000000,
					chiPhiDiChuyen: 250000,
					rating: 4.6,
					giaMin: 1500000,
					giaMax: 4000000,
				},
				{
					ten: 'Nha Trang',
					diaChi: 'Khánh Hòa',
					loai: LoaiDiemDen.BIEN,
					hinhAnh: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
					moTa: 'Thành phố biển với bãi cát trắng và nước xanh',
					thoiGianThamQuan: 480,
					chiPhiAnUong: 600000,
					chiPhiLuuTru: 2000000,
					chiPhiDiChuyen: 400000,
					rating: 4.5,
					giaMin: 2500000,
					giaMax: 6000000,
				},
				{
					ten: 'Sapa',
					diaChi: 'Lào Cai',
					loai: LoaiDiemDen.NUI,
					hinhAnh: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
					moTa: 'Thị trấn mây với ruộng bậc thang tuyệt đẹp',
					thoiGianThamQuan: 600,
					chiPhiAnUong: 350000,
					chiPhiLuuTru: 900000,
					chiPhiDiChuyen: 300000,
					rating: 4.7,
					giaMin: 1200000,
					giaMax: 3500000,
				},
				{
					ten: 'Hồ Chí Minh',
					diaChi: 'TP. Hồ Chí Minh',
					loai: LoaiDiemDen.THANH_PHO,
					hinhAnh: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
					moTa: 'Thành phố năng động với nhiều điểm tham quan',
					thoiGianThamQuan: 720,
					chiPhiAnUong: 500000,
					chiPhiLuuTru: 1200000,
					chiPhiDiChuyen: 300000,
					rating: 4.4,
					giaMin: 1800000,
					giaMax: 4500000,
				},
			];

			diemDenMau.forEach((item) => this.themDiemDen(item));
		}
	}
}

export const localStorageService = new LocalStorageService();
