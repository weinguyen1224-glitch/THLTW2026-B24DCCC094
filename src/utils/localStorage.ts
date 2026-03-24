/**
 * LocalStorage CRUD Utility
 * Replaces API calls with localStorage operations
 */

const generateId = (): string => {
	return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getKey = (collection: string) => `ltw_${collection}`;

/**
 * Get all items from a collection
 */
export const getAll = <T = any>(collection: string): T[] => {
	try {
		const data = localStorage.getItem(getKey(collection));
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
};

/**
 * Save all items to a collection
 */
const saveAll = <T = any>(collection: string, items: T[]): void => {
	localStorage.setItem(getKey(collection), JSON.stringify(items));
};

/**
 * Find items with filtering, sorting, pagination
 */
export const find = <T = any>(
	collection: string,
	options: {
		condition?: Record<string, any>;
		filters?: { field: string; value: any; operator?: string }[];
		sort?: Record<string, 1 | -1>;
		page?: number;
		limit?: number;
	} = {},
): { result: T[]; total: number } => {
	let items = getAll<T>(collection);

	// Apply condition filter
	if (options.condition) {
		items = items.filter((item: any) => {
			return Object.entries(options.condition!).every(([key, value]) => {
				if (value === undefined || value === null || value === '') return true;
				const itemValue = item[key];
				if (Array.isArray(value)) {
					return value.includes(itemValue);
				}
				if (typeof value === 'object' && value !== null) {
					if (value.$regex) {
						const regex = new RegExp(value.$regex, value.$options || 'i');
						return regex.test(String(itemValue ?? ''));
					}
					if (value.$gte !== undefined && value.$lte !== undefined) {
						return itemValue >= value.$gte && itemValue <= value.$lte;
					}
					if (value.$gte !== undefined) {
						return itemValue >= value.$gte;
					}
					if (value.$lte !== undefined) {
						return itemValue <= value.$lte;
					}
					if (value.$ne !== undefined) {
						return itemValue !== value.$ne;
					}
					if (value.$in !== undefined) {
						return value.$in.includes(itemValue);
					}
				}
				return itemValue === value;
			});
		});
	}

	// Apply additional filters
	if (options.filters && options.filters.length > 0) {
		items = items.filter((item: any) => {
			return options.filters!.every((filter) => {
				const itemValue = item[filter.field];
				const operator = filter.operator || 'eq';
				switch (operator) {
					case 'eq':
						return itemValue === filter.value;
					case 'ne':
						return itemValue !== filter.value;
					case 'gt':
						return itemValue > filter.value;
					case 'gte':
						return itemValue >= filter.value;
					case 'lt':
						return itemValue < filter.value;
					case 'lte':
						return itemValue <= filter.value;
					case 'contains':
						return String(itemValue ?? '')
							.toLowerCase()
							.includes(String(filter.value ?? '').toLowerCase());
					default:
						return true;
				}
			});
		});
	}

	const total = items.length;

	// Apply sorting
	if (options.sort) {
		items.sort((a: any, b: any) => {
			for (const [key, order] of Object.entries(options.sort!)) {
				const aVal = a[key];
				const bVal = b[key];
				if (aVal < bVal) return -1 * order;
				if (aVal > bVal) return 1 * order;
			}
			return 0;
		});
	}

	// Apply pagination
	if (options.page && options.limit) {
		const start = (options.page - 1) * options.limit;
		const end = start + options.limit;
		items = items.slice(start, end);
	} else if (options.limit) {
		items = items.slice(0, options.limit);
	}

	return { result: items, total };
};

/**
 * Find one item by condition
 */
export const findOne = <T = any>(collection: string, condition: Record<string, any>): T | null => {
	const items = getAll<T>(collection);
	return (
		items.find((item: any) => {
			return Object.entries(condition).every(([key, value]) => {
				return item[key] === value;
			});
		}) ?? null
	);
};

/**
 * Find item by ID
 */
export const findById = <T = any>(collection: string, id: string): T | null => {
	const items = getAll<T>(collection);
	return items.find((item: any) => item._id === id) ?? null;
};

/**
 * Create a new item
 */
export const create = <T = any>(collection: string, payload: Partial<T>): T => {
	const items = getAll<T>(collection);
	const now = new Date().toISOString();
	const newItem: any = {
		...payload,
		_id: generateId(),
		createdAt: now,
		updatedAt: now,
	};
	items.push(newItem);
	saveAll(collection, items);
	return newItem;
};

/**
 * Update an item by ID
 */
export const update = <T = any>(collection: string, id: string, payload: Partial<T>): T | null => {
	const items = getAll<any>(collection);
	const index = items.findIndex((item: any) => item._id === id);
	if (index === -1) return null;

	const now = new Date().toISOString();
	items[index] = {
		...items[index],
		...payload,
		_id: id,
		updatedAt: now,
	};
	saveAll(collection, items);
	return items[index];
};

/**
 * Update many items by IDs
 */
export const updateMany = <T = any>(collection: string, ids: string[], payload: Partial<T>): T[] => {
	const items = getAll<any>(collection);
	const now = new Date().toISOString();
	const updated: T[] = [];

	ids.forEach((id) => {
		const index = items.findIndex((item: any) => item._id === id);
		if (index !== -1) {
			items[index] = {
				...items[index],
				...payload,
				_id: id,
				updatedAt: now,
			};
			updated.push(items[index]);
		}
	});

	saveAll(collection, items);
	return updated;
};

/**
 * Delete an item by ID
 */
export const remove = <T = any>(collection: string, id: string): T | null => {
	const items = getAll<any>(collection);
	const index = items.findIndex((item: any) => item._id === id);
	if (index === -1) return null;

	const removed = items.splice(index, 1)[0];
	saveAll(collection, items);
	return removed;
};

/**
 * Delete many items by IDs
 */
export const removeMany = <T = any>(collection: string, ids: string[]): T[] => {
	const items = getAll<any>(collection);
	const removed: T[] = [];

	const remaining = items.filter((item: any) => {
		if (ids.includes(item._id)) {
			removed.push(item);
			return false;
		}
		return true;
	});

	saveAll(collection, remaining);
	return removed;
};

/**
 * Count items in a collection
 */
export const count = (collection: string, condition?: Record<string, any>): number => {
	if (!condition) return getAll(collection).length;
	return find(collection, { condition }).total;
};

/**
 * Clear all items in a collection
 */
export const clear = (collection: string): void => {
	localStorage.removeItem(getKey(collection));
};

/**
 * Wrap result in API-like response format
 */
export const wrapResponse = <T = any>(data: T) => ({
	data: { data },
});

/**
 * Wrap paginated result in API-like response format
 */
export const wrapPaginatedResponse = <T = any>(result: T[], total: number) => ({
	data: {
		data: {
			result,
			total,
		},
	},
});
