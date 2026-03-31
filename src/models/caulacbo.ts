import { useState } from 'react';
import { message } from 'antd';

const STORAGE_KEY = 'caulacbo';

const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export default () => {
	const [danhSach, setDanhSach] = useState<CauLacBo.IRecord[]>([]);
	const [record, setRecord] = useState<CauLacBo.IRecord | undefined>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [visibleThanhVien, setVisibleThanhVien] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const getDataFromStorage = (): CauLacBo.IRecord[] => {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	};

	const saveDataToStorage = (data: CauLacBo.IRecord[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	};

	const getModel = async () => {
		setLoading(true);
		try {
			const data = getDataFromStorage();
			setDanhSach(data);
			setTotal(data.length);
			return data;
		} finally {
			setLoading(false);
		}
	};

	const getAllModel = async (): Promise<CauLacBo.IRecord[]> => {
		setLoading(true);
		try {
			const data = getDataFromStorage();
			setDanhSach(data);
			return data;
		} finally {
			setLoading(false);
		}
	};

	const getByIdModel = async (id: string): Promise<CauLacBo.IRecord | undefined> => {
		const data = getDataFromStorage();
		const item = data.find((x) => x._id === id);
		if (item) setRecord(item);
		return item;
	};

	const postModel = async (payload: Partial<CauLacBo.IRecord>): Promise<CauLacBo.IRecord> => {
		const data = getDataFromStorage();
		const newItem: CauLacBo.IRecord = {
			_id: generateId(),
			ten: payload.ten || '',
			anhDaiDien: payload.anhDaiDien,
			ngayThanhLap: payload.ngayThanhLap,
			moTa: payload.moTa,
			chuNhiem: payload.chuNhiem || '',
			hoatDong: payload.hoatDong ?? true,
			soThanhVien: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		data.push(newItem);
		saveDataToStorage(data);
		message.success('Thêm mới câu lạc bộ thành công');
		setVisibleForm(false);
		getModel();
		return newItem;
	};

	const putModel = async (id: string, payload: Partial<CauLacBo.IRecord>): Promise<CauLacBo.IRecord | undefined> => {
		const data = getDataFromStorage();
		const index = data.findIndex((x) => x._id === id);
		if (index === -1) {
			message.error('Không tìm thấy câu lạc bộ');
			return undefined;
		}
		data[index] = {
			...data[index],
			...payload,
			updatedAt: new Date().toISOString(),
		};
		saveDataToStorage(data);
		message.success('Cập nhật câu lạc bộ thành công');
		setVisibleForm(false);
		getModel();
		return data[index];
	};

	const deleteModel = async (id: string): Promise<void> => {
		const data = getDataFromStorage();
		const newData = data.filter((x) => x._id !== id);
		saveDataToStorage(newData);
		message.success('Xóa câu lạc bộ thành công');
		getModel();
	};

	const deleteManyModel = async (ids: string[]): Promise<void> => {
		if (!ids.length) return;
		const data = getDataFromStorage();
		const newData = data.filter((x) => !ids.includes(x._id));
		saveDataToStorage(newData);
		message.success(`Xóa thành công ${ids.length} câu lạc bộ`);
		setSelectedIds([]);
		getModel();
	};

	const handleEdit = (rec: CauLacBo.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleView = (rec: CauLacBo.IRecord) => {
		setRecord(rec);
		setEdit(false);
		setVisibleForm(true);
	};

	const capNhatSoThanhVien = (cauLacBoId: string, soLuong: number) => {
		const data = getDataFromStorage();
		const index = data.findIndex((x) => x._id === cauLacBoId);
		if (index !== -1) {
			data[index].soThanhVien = soLuong;
			saveDataToStorage(data);
			getModel();
		}
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		visibleForm,
		setVisibleForm,
		visibleThanhVien,
		setVisibleThanhVien,
		edit,
		setEdit,
		loading,
		setLoading,
		page,
		setPage,
		limit,
		setLimit,
		total,
		setTotal,
		selectedIds,
		setSelectedIds,
		getModel,
		getAllModel,
		getByIdModel,
		postModel,
		putModel,
		deleteModel,
		deleteManyModel,
		handleEdit,
		handleView,
		capNhatSoThanhVien,
	};
};
