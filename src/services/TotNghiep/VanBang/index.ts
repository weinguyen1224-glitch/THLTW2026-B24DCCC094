import {
	find,
	findById,
	create,
	update,
	remove,
	getAll,
	wrapResponse,
	wrapPaginatedResponse,
} from '@/utils/localStorage';
import { EVanBangTrangThai } from '@/services/TotNghiep/constant';

const collection = 'van-bang';
const collectionLuotTruyCap = 'van-bang/luot-truy-cap';

export async function getDanhSachVanBang(payload: any) {
	const { result, total } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
		page: payload?.page,
		limit: payload?.limit,
	});
	return wrapPaginatedResponse(result, total);
}

export async function getTatCaVanBang(payload?: any) {
	const { result } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
	});
	return wrapResponse(result);
}

export async function getVanBangById(id: string) {
	const result = findById(collection, id);
	return wrapResponse(result);
}

export async function createVanBang(payload: any) {
	const result = create(collection, payload);
	return wrapResponse(result);
}

export async function updateVanBang(id: string, payload: any) {
	const result = update(collection, id, payload);
	return wrapResponse(result);
}

export async function deleteVanBang(id: string) {
	const result = remove(collection, id);
	return wrapResponse(result);
}

export async function capVanBangNhieu(ids: string[]) {
	const now = new Date().toISOString();
	const results: any[] = [];
	ids.forEach((id) => {
		const updated = update(collection, id, {
			trangThai: EVanBangTrangThai.DA_CAP,
			ngayCap: now,
			updatedAt: now,
		});
		if (updated) results.push(updated);
	});
	return wrapResponse(results);
}

export async function traVanBang(id: string, payload: { ngayTra: string; nguoiNhan: string; ghiChu?: string }) {
	const result = update(collection, id, {
		trangThai: EVanBangTrangThai.DA_TRA,
		ngayTra: payload.ngayTra,
		nguoiNhan: payload.nguoiNhan,
		ghiChu: payload.ghiChu,
	});
	return wrapResponse(result);
}

export async function traNhieuVanBang(ids: string[], payload: { ngayTra: string; ghiChu?: string }) {
	const results: any[] = [];
	ids.forEach((id) => {
		const updated = update(collection, id, {
			trangThai: EVanBangTrangThai.DA_TRA,
			ngayTra: payload.ngayTra,
			ghiChu: payload.ghiChu,
		});
		if (updated) results.push(updated);
	});
	return wrapResponse(results);
}

export async function traCuuVanBang(payload: {
	soHieuVanBang?: string;
	soQuyetDinh?: string;
	maSinhVien?: string;
	hoTen?: string;
}) {
	const items = getAll<any>(collection);
	const result = items.filter((item) => {
		if (payload.soHieuVanBang && item.soHieuVanBang !== payload.soHieuVanBang) return false;
		if (payload.soQuyetDinh && item.soQuyetDinh !== payload.soQuyetDinh) return false;
		if (payload.maSinhVien && item.maSinhVien !== payload.maSinhVien) return false;
		if (payload.hoTen && !item.hoTen?.toLowerCase().includes(payload.hoTen.toLowerCase())) return false;
		return true;
	});
	return wrapResponse(result);
}

export async function ghiNhanLuotTruyCap(payload: {
	soQuyetDinh: string;
	loaiTruyCap: string;
	ipAddress: string;
	userAgent: string;
	ketQua: boolean;
	ghiChu?: string;
}) {
	const record = create(collectionLuotTruyCap, {
		...payload,
		thoiGian: new Date().toISOString(),
	});
	return wrapResponse(record);
}
