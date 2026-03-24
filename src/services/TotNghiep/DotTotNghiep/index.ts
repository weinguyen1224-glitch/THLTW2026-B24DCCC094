import { find, findById, create, update, remove, wrapResponse, wrapPaginatedResponse } from '@/utils/localStorage';
import { EDotTrangThai } from '@/services/TotNghiep/constant';

const collection = 'dot-tot-nghiep';

export async function getDanhSachDotTotNghiep(payload: any) {
	const { result, total } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
		page: payload?.page,
		limit: payload?.limit,
	});
	return wrapPaginatedResponse(result, total);
}

export async function getTatCaDotTotNghiep(payload?: any) {
	const { result } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
	});
	return wrapResponse(result);
}

export async function getDotTotNghiepById(id: string) {
	const result = findById(collection, id);
	return wrapResponse(result);
}

export async function createDotTotNghiep(payload: any) {
	const result = create(collection, payload);
	return wrapResponse(result);
}

export async function updateDotTotNghiep(id: string, payload: any) {
	const result = update(collection, id, payload);
	return wrapResponse(result);
}

export async function deleteDotTotNghiep(id: string) {
	const result = remove(collection, id);
	return wrapResponse(result);
}

export async function khoaDotTotNghiep(id: string) {
	const result = update(collection, id, { trangThai: EDotTrangThai.DA_KHOA });
	return wrapResponse(result);
}

export async function moKhoaDotTotNghiep(id: string) {
	const result = update(collection, id, { trangThai: EDotTrangThai.DANG_MO });
	return wrapResponse(result);
}
