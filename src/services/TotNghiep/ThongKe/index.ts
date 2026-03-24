import { find, getAll, wrapResponse, wrapPaginatedResponse } from '@/utils/localStorage';

const collectionHoSo = 'ho-so-tot-nghiep';
const collectionVanBang = 'van-bang';
const collectionLuotTruyCap = 'van-bang/luot-truy-cap';

export async function getThongKeTotNghiep(payload?: { idDotTotNghiep?: string }) {
	const hoSoAll = getAll<any>(collectionHoSo).filter((item: any) => {
		if (!payload?.idDotTotNghiep) return true;
		return item.idDotTotNghiep === payload.idDotTotNghiep;
	});

	const vanBangAll = getAll<any>(collectionVanBang).filter((item: any) => {
		if (!payload?.idDotTotNghiep) return true;
		return item.idDotTotNghiep === payload.idDotTotNghiep;
	});

	const tongHoSo = hoSoAll.length;
	const hoSoChoDuyet = hoSoAll.filter((h: any) => h.trangThai === 'CHO_DUYET').length;
	const hoSoDaDuyet = hoSoAll.filter((h: any) => h.trangThai === 'DA_DUYET').length;
	const hoSoTuChoi = hoSoAll.filter((h: any) => h.trangThai === 'TU_CHOI').length;

	const tongVanBang = vanBangAll.length;
	const vanBangDaCap = vanBangAll.filter((v: any) => v.trangThai === 'DA_CAP').length;
	const vanBangChuaCap = vanBangAll.filter((v: any) => v.trangThai === 'CHUA_CAP').length;
	const vanBangDaTra = vanBangAll.filter((v: any) => v.trangThai === 'DA_TRA').length;

	const nganhMap: Record<string, number> = {};
	hoSoAll.forEach((h: any) => {
		const key = h.tenNganh || h.idNganh || 'Khác';
		nganhMap[key] = (nganhMap[key] || 0) + 1;
	});
	const theoNganh = Object.entries(nganhMap).map(([tenNganh, soLuong]) => ({ tenNganh, soLuong }));

	const khoaMap: Record<string, number> = {};
	hoSoAll.forEach((h: any) => {
		const key = h.tenKhoa || h.idKhoa || 'Khác';
		khoaMap[key] = (khoaMap[key] || 0) + 1;
	});
	const theoKhoa = Object.entries(khoaMap).map(([tenKhoa, soLuong]) => ({ tenKhoa, soLuong }));

	const xepLoaiMap: Record<string, number> = {};
	hoSoAll.forEach((h: any) => {
		const key = h.xepLoaiTotNghiep || 'Khác';
		xepLoaiMap[key] = (xepLoaiMap[key] || 0) + 1;
	});
	const theoXepLoai = Object.entries(xepLoaiMap).map(([xepLoai, soLuong]) => ({ xepLoai, soLuong }));

	const data: TotNghiep.IThongKe = {
		tongHoSo,
		hoSoChoDuyet,
		hoSoDaDuyet,
		hoSoTuChoi,
		tongVanBang,
		vanBangDaCap,
		vanBangChuaCap,
		vanBangDaTra,
		theoNganh,
		theoKhoa,
		theoXepLoai,
		theoDot: [],
	};

	return wrapResponse(data);
}

export async function getThongKeTheoDot(idDotTotNghiep: string) {
	return getThongKeTotNghiep({ idDotTotNghiep });
}

export async function getThongKeTheoNganh(payload?: { idDotTotNghiep?: string; idKhoa?: string }) {
	const hoSoAll = getAll<any>(collectionHoSo).filter((item: any) => {
		if (payload?.idDotTotNghiep && item.idDotTotNghiep !== payload.idDotTotNghiep) return false;
		if (payload?.idKhoa && item.idKhoa !== payload.idKhoa) return false;
		return true;
	});

	const nganhMap: Record<string, number> = {};
	hoSoAll.forEach((h: any) => {
		const key = h.tenNganh || h.idNganh || 'Khác';
		nganhMap[key] = (nganhMap[key] || 0) + 1;
	});
	const data = Object.entries(nganhMap).map(([tenNganh, soLuong]) => ({ tenNganh, soLuong }));
	return wrapResponse(data);
}

export async function getThongKeTheoKhoa(payload?: { idDotTotNghiep?: string }) {
	const hoSoAll = getAll<any>(collectionHoSo).filter((item: any) => {
		if (payload?.idDotTotNghiep && item.idDotTotNghiep !== payload.idDotTotNghiep) return false;
		return true;
	});

	const khoaMap: Record<string, number> = {};
	hoSoAll.forEach((h: any) => {
		const key = h.tenKhoa || h.idKhoa || 'Khác';
		khoaMap[key] = (khoaMap[key] || 0) + 1;
	});
	const data = Object.entries(khoaMap).map(([tenKhoa, soLuong]) => ({ tenKhoa, soLuong }));
	return wrapResponse(data);
}

export async function getThongKeTheoXepLoai(payload?: { idDotTotNghiep?: string }) {
	const hoSoAll = getAll<any>(collectionHoSo).filter((item: any) => {
		if (payload?.idDotTotNghiep && item.idDotTotNghiep !== payload.idDotTotNghiep) return false;
		return true;
	});

	const xepLoaiMap: Record<string, number> = {};
	hoSoAll.forEach((h: any) => {
		const key = h.xepLoaiTotNghiep || 'Khác';
		xepLoaiMap[key] = (xepLoaiMap[key] || 0) + 1;
	});
	const data = Object.entries(xepLoaiMap).map(([xepLoai, soLuong]) => ({ xepLoai, soLuong }));
	return wrapResponse(data);
}

export async function getLichSuTruyCap(payload: {
	page?: number;
	limit?: number;
	soQuyetDinh?: string;
	loaiTruyCap?: string;
	tuNgay?: string;
	denNgay?: string;
}) {
	const condition: Record<string, any> = {};
	if (payload.soQuyetDinh) condition.soQuyetDinh = payload.soQuyetDinh;
	if (payload.loaiTruyCap) condition.loaiTruyCap = payload.loaiTruyCap;

	const { result, total } = find(collectionLuotTruyCap, {
		condition,
		sort: { thoiGian: -1 },
		page: payload.page,
		limit: payload.limit,
	});
	return wrapPaginatedResponse(result, total);
}
