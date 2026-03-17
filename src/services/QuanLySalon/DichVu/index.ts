const STORAGE_KEY = 'salon_dichvu';

const getStoredData = (): any[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const setStoredData = (data: any[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => `dv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getListDichVu = async (payload: any) => {
	const data = getStoredData();
	const page = payload?.page || 1;
	const limit = payload?.limit || 10;
	const start = (page - 1) * limit;
	const end = start + limit;

	return {
		data: {
			data: {
				result: data.slice(start, end),
				total: data.length,
			},
		},
	};
};

export const getAllDichVu = async (payload?: any) => {
	let data = getStoredData();

	if (payload?.condition) {
		const { trangThai } = payload.condition;
		if (trangThai) {
			data = data.filter((item: any) => item.trangThai === trangThai);
		}
	}

	return { data: { data } };
};

export const getAll = getAllDichVu;

export const getDichVuById = async (id: string) => {
	const data = getStoredData();
	const item = data.find((x: any) => x._id === id);
	return { data: { data: item } };
};

export const createDichVu = async (payload: any) => {
	const data = getStoredData();
	const newItem = {
		...payload,
		_id: generateId(),
		createdAt: new Date().toISOString(),
	};
	data.push(newItem);
	setStoredData(data);
	return { data: { data: newItem } };
};

export const updateDichVu = async (id: string, payload: any) => {
	const data = getStoredData();
	const index = data.findIndex((x: any) => x._id === id);
	if (index !== -1) {
		data[index] = { ...data[index], ...payload, updatedAt: new Date().toISOString() };
		setStoredData(data);
	}
	return { data: { data: data[index] } };
};

export const deleteDichVu = async (id: string) => {
	const data = getStoredData();
	const newData = data.filter((x: any) => x._id !== id);
	setStoredData(newData);
	return { data: { data: true } };
};
