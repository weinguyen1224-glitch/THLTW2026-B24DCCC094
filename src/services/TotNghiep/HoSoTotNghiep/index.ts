import { find, findById, create, update, remove, wrapResponse, wrapPaginatedResponse } from '@/utils/localStorage';
import { EHoSoTrangThai } from '@/services/TotNghiep/constant';

const collection = 'ho-so-tot-nghiep';

export async function getDanhSachHoSoTotNghiep(payload: any) {
	const { result, total } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
		page: payload?.page,
		limit: payload?.limit,
	});
	return wrapPaginatedResponse(result, total);
}

export async function getTatCaHoSoTotNghiep(payload?: any) {
	const { result } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
	});
	return wrapResponse(result);
}

export async function getHoSoTotNghiepById(id: string) {
	const result = findById(collection, id);
	return wrapResponse(result);
}

export async function createHoSoTotNghiep(payload: any) {
	const result = create(collection, payload);
	return wrapResponse(result);
}

export async function updateHoSoTotNghiep(id: string, payload: any) {
	const result = update(collection, id, payload);
	return wrapResponse(result);
}

export async function deleteHoSoTotNghiep(id: string) {
	const result = remove(collection, id);
	return wrapResponse(result);
}

export async function duyetHoSoTotNghiep(id: string) {
	const result = update(collection, id, { trangThai: EHoSoTrangThai.DA_DUYET });
	return wrapResponse(result);
}

export async function tuChoiHoSoTotNghiep(id: string, lyDo: string) {
	const result = update(collection, id, { trangThai: EHoSoTrangThai.TU_CHOI, ghiChu: lyDo });
	return wrapResponse(result);
}

export async function duyetNhieuHoSo(ids: string[]) {
	const now = new Date().toISOString();
	const results: any[] = [];
	ids.forEach((id) => {
		const updated = update(collection, id, { trangThai: EHoSoTrangThai.DA_DUYET, updatedAt: now });
		if (updated) results.push(updated);
	});
	return wrapResponse(results);
}

export async function timKiemHoSoTotNghiep(payload: {
	maSinhVien?: string;
	hoTen?: string;
	soQuyetDinh?: string;
	idDotTotNghiep?: string;
	idNganh?: string;
	idKhoa?: string;
	trangThai?: string;
	page?: number;
	limit?: number;
}) {
	const condition: Record<string, any> = {};
	if (payload.maSinhVien) {
		condition.maSinhVien = { $regex: payload.maSinhVien, $options: 'i' };
	}
	if (payload.hoTen) {
		condition.hoTen = { $regex: payload.hoTen, $options: 'i' };
	}
	if (payload.soQuyetDinh) {
		condition.soQuyetDinh = { $regex: payload.soQuyetDinh, $options: 'i' };
	}
	if (payload.idDotTotNghiep) condition.idDotTotNghiep = payload.idDotTotNghiep;
	if (payload.idNganh) condition.idNganh = payload.idNganh;
	if (payload.idKhoa) condition.idKhoa = payload.idKhoa;
	if (payload.trangThai) condition.trangThai = payload.trangThai;

	const { result, total } = find(collection, {
		condition,
		page: payload.page,
		limit: payload.limit,
	});
	return wrapPaginatedResponse(result, total);
}
