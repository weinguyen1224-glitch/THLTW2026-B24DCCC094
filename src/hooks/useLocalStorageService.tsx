import {
	find,
	findOne,
	findById,
	create,
	update,
	updateMany,
	remove,
	removeMany,
	getAll,
	wrapResponse,
	wrapPaginatedResponse,
} from '@/utils/localStorage';

/**
 * useLocalStorageService - replaces useInitService
 * Provides CRUD operations using localStorage instead of API calls
 */
const useLocalStorageService = (collection: string) => {
	const getService = (
		payload: { page?: number; limit?: number; condition?: any; sort?: any; filters?: any },
		path?: string,
	) => {
		if (path === 'one') {
			const condition = payload?.condition || {};
			const result = findOne(collection, condition);
			return Promise.resolve(wrapResponse(result));
		}

		// Default: paginated list
		const { result, total } = find(collection, {
			condition: payload?.condition,
			filters: payload?.filters,
			sort: payload?.sort,
			page: payload?.page,
			limit: payload?.limit,
		});
		return Promise.resolve(wrapPaginatedResponse(result, total));
	};

	const postService = (payload: any) => {
		const result = create(collection, payload);
		return Promise.resolve(wrapResponse(result));
	};

	const putService = (id: string | number, payload: any) => {
		const result = update(collection, String(id), payload);
		return Promise.resolve(wrapResponse(result));
	};

	const putManyService = (ids: (string | number)[], updatePayload: any) => {
		const result = updateMany(collection, ids.map(String), updatePayload);
		return Promise.resolve(wrapResponse(result));
	};

	const deleteService = (id: string | number) => {
		const result = remove(collection, String(id));
		return Promise.resolve(wrapResponse(result));
	};

	const deleteManyService = (ids: (string | number)[]) => {
		const result = removeMany(collection, ids.map(String));
		return Promise.resolve(wrapResponse(result));
	};

	const getAllService = (payload?: { condition?: any; sort?: any }, path?: string) => {
		const { result } = find(collection, {
			condition: payload?.condition,
			sort: payload?.sort,
		});
		return Promise.resolve(wrapResponse(result));
	};

	const getByIdService = (id: string | number) => {
		const result = findById(collection, String(id));
		return Promise.resolve(wrapResponse(result));
	};

	return {
		getService,
		getByIdService,
		postService,
		putService,
		putManyService,
		deleteService,
		deleteManyService,
		getAllService,
	};
};

export default useLocalStorageService;
