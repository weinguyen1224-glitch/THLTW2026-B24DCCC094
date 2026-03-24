import { find, findById, create, update, remove, wrapResponse, wrapPaginatedResponse } from '@/utils/localStorage';

const collection = 'cau-hinh-bien-mau';

export async function getDanhSachCauHinhBienMau(payload: any) {
	const { result, total } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
		page: payload?.page,
		limit: payload?.limit,
	});
	return wrapPaginatedResponse(result, total);
}

export async function getTatCaCauHinhBienMau(payload?: any) {
	const { result } = find(collection, {
		condition: payload?.condition,
		sort: payload?.sort,
	});
	return wrapResponse(result);
}

export async function getCauHinhBienMauById(id: string) {
	const result = findById(collection, id);
	return wrapResponse(result);
}

export async function createCauHinhBienMau(payload: any) {
	const result = create(collection, payload);
	return wrapResponse(result);
}

export async function updateCauHinhBienMau(id: string, payload: any) {
	const result = update(collection, id, payload);
	return wrapResponse(result);
}

export async function deleteCauHinhBienMau(id: string) {
	const result = remove(collection, id);
	return wrapResponse(result);
}
