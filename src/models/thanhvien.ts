import { useState } from 'react';
import { message } from 'antd';

const STORAGE_KEY = 'thanhvien';

const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export default () => {
	const [danhSach, setDanhSach] = useState<ThanhVien.IRecord[]>([]);
	const [record, setRecord] = useState<ThanhVien.IRecord | undefined>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [visibleDoiCLB, setVisibleDoiCLB] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);

	const getDataFromStorage = (): ThanhVien.IRecord[] => {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	};

	const saveDataToStorage = (data: ThanhVien.IRecord[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	};

	const getModel = async () => {
		setLoading(true);
		try {
			const data = getDataFromStorage().filter((x) => x.trangThai === 'Active');
			setDanhSach(data);
			setTotal(data.length);
			return data;
		} finally {
			setLoading(false);
		}
	};

	const getAllModel = async (): Promise<ThanhVien.IRecord[]> => {
		setLoading(true);
		try {
			const data = getDataFromStorage();
			setDanhSach(data);
			return data;
		} finally {
			setLoading(false);
		}
	};

	const getModelByCLB = async (cauLacBoId: string): Promise<ThanhVien.IRecord[]> => {
		setLoading(true);
		try {
			const data = getDataFromStorage().filter((x) => x.cauLacBoId === cauLacBoId && x.trangThai === 'Active');
			setDanhSach(data);
			setTotal(data.length);
			return data;
		} finally {
			setLoading(false);
		}
	};

	const getByIdModel = async (id: string): Promise<ThanhVien.IRecord | undefined> => {
		const data = getDataFromStorage();
		const item = data.find((x) => x._id === id);
		if (item) setRecord(item);
		return item;
	};

	const postModel = async (payload: Partial<ThanhVien.IRecord>): Promise<ThanhVien.IRecord> => {
		const data = getDataFromStorage();
		const cauLacBoData = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		const cauLacBo = cauLacBoData.find((c: CauLacBo.IRecord) => c._id === payload.cauLacBoId);

		const newItem: ThanhVien.IRecord = {
			_id: generateId(),
			hoTen: payload.hoTen || '',
			email: payload.email || '',
			soDienThoai: payload.soDienThoai || '',
			gioiTinh: payload.gioiTinh || 'Nam',
			diaChi: payload.diaChi || '',
			soTruong: payload.soTruong || '',
			cauLacBoId: payload.cauLacBoId || '',
			cauLacBoTen: cauLacBo?.ten || '',
			ngayThamGia: new Date().toISOString(),
			trangThai: 'Active',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		data.push(newItem);
		saveDataToStorage(data);
		message.success('Thêm mới thành viên thành công');
		setVisibleForm(false);
		getModel();
		return newItem;
	};

	const putModel = async (id: string, payload: Partial<ThanhVien.IRecord>): Promise<ThanhVien.IRecord | undefined> => {
		const data = getDataFromStorage();
		const index = data.findIndex((x) => x._id === id);
		if (index === -1) {
			message.error('Không tìm thấy thành viên');
			return undefined;
		}

		const cauLacBoData = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		const cauLacBo = cauLacBoData.find((c: CauLacBo.IRecord) => c._id === payload.cauLacBoId);

		data[index] = {
			...data[index],
			...payload,
			cauLacBoTen: cauLacBo?.ten || data[index].cauLacBoTen,
			updatedAt: new Date().toISOString(),
		};
		saveDataToStorage(data);
		message.success('Cập nhật thành viên thành công');
		setVisibleForm(false);
		getModel();
		return data[index];
	};

	const deleteModel = async (id: string): Promise<void> => {
		const data = getDataFromStorage();
		const newData = data.filter((x) => x._id !== id);
		saveDataToStorage(newData);
		message.success('Xóa thành viên thành công');
		getModel();
	};

	const deleteManyModel = async (ids: React.Key[]): Promise<void> => {
		if (!ids.length) return;
		const data = getDataFromStorage();
		const newData = data.filter((x) => !ids.includes(x._id));
		saveDataToStorage(newData);
		message.success(`Xóa thành công ${ids.length} thành viên`);
		setSelectedIds([]);
		getModel();
	};

	const doiCLB = async (ids: React.Key[], cauLacBoMoiId: string): Promise<void> => {
		if (!ids.length) return;
		const data = getDataFromStorage();
		const cauLacBoData = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		const cauLacBoMoi = cauLacBoData.find((c: CauLacBo.IRecord) => c._id === cauLacBoMoiId);

		if (!cauLacBoMoi) {
			message.error('Không tìm thấy câu lạc bộ');
			return;
		}

		for (const id of ids) {
			const index = data.findIndex((x) => x._id === id);
			if (index !== -1) {
				data[index] = {
					...data[index],
					cauLacBoId: cauLacBoMoiId,
					cauLacBoTen: cauLacBoMoi.ten,
					updatedAt: new Date().toISOString(),
				};
			}
		}

		saveDataToStorage(data);
		message.success(`Chuyển ${ids.length} thành viên sang "${cauLacBoMoi.ten}" thành công`);
		setSelectedIds([]);
		setVisibleDoiCLB(false);
		getModel();
	};

	const getSoLuongThanhVienTheoCLB = (): { [key: string]: number } => {
		const data = getDataFromStorage().filter((x) => x.trangThai === 'Active');
		const result: { [key: string]: number } = {};
		data.forEach((x) => {
			if (x.cauLacBoId) {
				result[x.cauLacBoId] = (result[x.cauLacBoId] || 0) + 1;
			}
		});
		return result;
	};

	const handleEdit = (rec: ThanhVien.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleView = (rec: ThanhVien.IRecord) => {
		setRecord(rec);
		setEdit(false);
		setVisibleForm(true);
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		visibleForm,
		setVisibleForm,
		visibleDoiCLB,
		setVisibleDoiCLB,
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
		getModelByCLB,
		getByIdModel,
		postModel,
		putModel,
		deleteModel,
		deleteManyModel,
		doiCLB,
		getSoLuongThanhVienTheoCLB,
		handleEdit,
		handleView,
	};
};
