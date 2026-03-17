const STORAGE_KEY = 'salon_lichhen';

const getStoredData = (): any[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

const setStoredData = (data: any[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => `lh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getListLichHen = async (payload: any) => {
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

export const getAllLichHen = async (payload?: any) => {
	const data = getStoredData();
	return { data: { data } };
};

export const getAll = getAllLichHen;

export const getLichHenById = async (id: string) => {
	const data = getStoredData();
	const item = data.find((x: any) => x._id === id);
	return { data: { data: item } };
};

export const createLichHen = async (payload: any) => {
	const data = getStoredData();

	const isTrung = data.some(
		(lich: any) =>
			lich.nhanVienId === payload.nhanVienId &&
			lich.ngayHen === payload.ngayHen &&
			lich.gioHen === payload.gioHen &&
			lich.trangThai !== 'huy',
	);

	if (isTrung) {
		throw new Error('Lịch hẹn bị trùng!');
	}

	const newItem = {
		...payload,
		ma: `LH${Date.now()}`,
		_id: generateId(),
		trangThai: 'choDuyet',
		createdAt: new Date().toISOString(),
	};
	data.push(newItem);
	setStoredData(data);
	return { data: { data: newItem } };
};

export const updateLichHen = async (id: string, payload: any) => {
	const data = getStoredData();
	const index = data.findIndex((x: any) => x._id === id);
	if (index !== -1) {
		data[index] = { ...data[index], ...payload, updatedAt: new Date().toISOString() };
		setStoredData(data);
	}
	return { data: { data: data[index] } };
};

export const updateTrangThaiLichHen = async (id: string, trangThai: string) => {
	return updateLichHen(id, { trangThai });
};

export const deleteLichHen = async (id: string) => {
	const data = getStoredData();
	const newData = data.filter((x: any) => x._id !== id);
	setStoredData(newData);
	return { data: { data: true } };
};

export const kiemTraTrungLich = async (nhanVienId: string, ngay: string, gio: string, excludeId?: string) => {
	const data = getStoredData();
	const isTrung = data.some(
		(lich: any) =>
			lich.nhanVienId === nhanVienId &&
			lich.ngayHen === ngay &&
			lich.gioHen === gio &&
			lich.trangThai !== 'huy' &&
			lich._id !== excludeId,
	);
	return { data: { data: isTrung } };
};

export const getThongKeLichHen = async (ngayBatDau: string, ngayKetThuc: string) => {
	const data = getStoredData();

	const filtered = data.filter((lich: any) => {
		return lich.ngayHen >= ngayBatDau && lich.ngayHen <= ngayKetThuc;
	});

	const tongLichHen = filtered.length;
	const lichHoanThanh = filtered.filter((l: any) => l.trangThai === 'hoanThanh').length;
	const lichHuy = filtered.filter((l: any) => l.trangThai === 'huy').length;

	return {
		data: {
			data: {
				tongLichHen,
				lichHoanThanh,
				lichHuy,
			},
		},
	};
};
