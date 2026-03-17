const STORAGE_KEY = 'salon_danhgia';

const getStoredData = (): any[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const setStoredData = (data: any[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => `dg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getListDanhGia = async (payload: any) => {
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

export const getDanhGiaByNhanVien = async (nhanVienId: string) => {
	const data = getStoredData();
	const filtered = data.filter((item: any) => item.nhanVienId === nhanVienId);
	return { data: { data: filtered } };
};

export const getDanhGiaById = async (id: string) => {
	const data = getStoredData();
	const item = data.find((x: any) => x._id === id);
	return { data: { data: item } };
};

export const createDanhGia = async (payload: any) => {
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

export const create = createDanhGia;

export const phanHoiDanhGia = async (id: string, noiDung: string) => {
	const data = getStoredData();
	const index = data.findIndex((x: any) => x._id === id);
	if (index !== -1) {
		data[index].phanHoi = {
			noiDung,
			ngayPhanHoi: new Date().toISOString(),
		};
		setStoredData(data);
	}
	return { data: { data: data[index] } };
};

export const getTrungBinhSaoNhanVien = async (nhanVienId: string) => {
	const data = getStoredData();
	const filtered = data.filter((item: any) => item.nhanVienId === nhanVienId);

	if (filtered.length === 0) {
		return { data: { data: { trungBinhSao: 0, soLuong: 0 } } };
	}

	const tongSao = filtered.reduce((sum: number, item: any) => sum + item.soSao, 0);
	const trungBinhSao = tongSao / filtered.length;

	return {
		data: {
			data: {
				trungBinhSao: Math.round(trungBinhSao * 10) / 10,
				soLuong: filtered.length,
			},
		},
	};
};

export const getAll = async () => {
	const data = getStoredData();
	return { data: { data } };
};
