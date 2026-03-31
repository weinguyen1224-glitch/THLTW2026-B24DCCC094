import { useState } from 'react';
import { message } from 'antd';

const STORAGE_KEY = 'dondangky';

const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export default () => {
	const [danhSach, setDanhSach] = useState<DonDangKy.IRecord[]>([]);
	const [record, setRecord] = useState<DonDangKy.IRecord | undefined>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);
	const [visibleLichSu, setVisibleLichSu] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [selectedIds, setSelectedIds] = useState<React.Key[]>([]);

	const getDataFromStorage = (): DonDangKy.IRecord[] => {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	};

	const saveDataToStorage = (data: DonDangKy.IRecord[]) => {
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

	const getAllModel = async (): Promise<DonDangKy.IRecord[]> => {
		setLoading(true);
		try {
			const data = getDataFromStorage();
			setDanhSach(data);
			return data;
		} finally {
			setLoading(false);
		}
	};

	const getByIdModel = async (id: string): Promise<DonDangKy.IRecord | undefined> => {
		const data = getDataFromStorage();
		const item = data.find((x) => x._id === id);
		if (item) setRecord(item);
		return item;
	};

	const postModel = async (payload: Partial<DonDangKy.IRecord>): Promise<DonDangKy.IRecord> => {
		const data = getDataFromStorage();
		const cauLacBoData = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		const cauLacBo = cauLacBoData.find((c: CauLacBo.IRecord) => c._id === payload.cauLacBoId);

		const newItem: DonDangKy.IRecord = {
			_id: generateId(),
			hoTen: payload.hoTen || '',
			email: payload.email || '',
			soDienThoai: payload.soDienThoai || '',
			gioiTinh: payload.gioiTinh || 'Nam',
			diaChi: payload.diaChi || '',
			soTruong: payload.soTruong || '',
			cauLacBoId: payload.cauLacBoId || '',
			cauLacBoTen: cauLacBo?.ten || '',
			lyDoDangKy: payload.lyDoDangKy || '',
			trangThai: 'Pending',
			ghiChu: payload.ghiChu,
			lichSuThaoTac: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		data.push(newItem);
		saveDataToStorage(data);
		message.success('Thêm mới đơn đăng ký thành công');
		setVisibleForm(false);
		getModel();
		return newItem;
	};

	const putModel = async (id: string, payload: Partial<DonDangKy.IRecord>): Promise<DonDangKy.IRecord | undefined> => {
		const data = getDataFromStorage();
		const index = data.findIndex((x) => x._id === id);
		if (index === -1) {
			message.error('Không tìm thấy đơn đăng ký');
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
		message.success('Cập nhật đơn đăng ký thành công');
		setVisibleForm(false);
		getModel();
		return data[index];
	};

	const deleteModel = async (id: string): Promise<void> => {
		const data = getDataFromStorage();
		const newData = data.filter((x) => x._id !== id);
		saveDataToStorage(newData);
		message.success('Xóa đơn đăng ký thành công');
		getModel();
	};

	const deleteManyModel = async (ids: React.Key[]): Promise<void> => {
		if (!ids.length) return;
		const data = getDataFromStorage();
		const newData = data.filter((x) => !ids.includes(x._id));
		saveDataToStorage(newData);
		message.success(`Xóa thành công ${ids.length} đơn đăng ký`);
		setSelectedIds([]);
		getModel();
	};

	const duyetDon = async (id: string): Promise<void> => {
		const data = getDataFromStorage();
		const index = data.findIndex((x) => x._id === id);
		if (index === -1) {
			message.error('Không tìm thấy đơn đăng ký');
			return;
		}

		const lichSuMoi: LichSuThaoTac.IRecord = {
			_id: generateId(),
			hanhDong: 'Approved',
			thoiGian: new Date().toISOString(),
			nguoiThucHien: 'Admin',
			ghiChu: 'Đơn đăng ký được duyệt',
		};

		data[index] = {
			...data[index],
			trangThai: 'Approved',
			lichSuThaoTac: [...(data[index].lichSuThaoTac || []), lichSuMoi],
			updatedAt: new Date().toISOString(),
		};
		saveDataToStorage(data);

		// Tự động thêm thành viên vào câu lạc bộ
		const thanhVienData = JSON.parse(localStorage.getItem('thanhvien') || '[]');
		const thanhVienMoi = {
			_id: generateId(),
			hoTen: data[index].hoTen,
			email: data[index].email,
			soDienThoai: data[index].soDienThoai,
			gioiTinh: data[index].gioiTinh,
			diaChi: data[index].diaChi,
			soTruong: data[index].soTruong,
			cauLacBoId: data[index].cauLacBoId,
			cauLacBoTen: data[index].cauLacBoTen,
			ngayThamGia: new Date().toISOString(),
			trangThai: 'Active' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		thanhVienData.push(thanhVienMoi);
		localStorage.setItem('thanhvien', JSON.stringify(thanhVienData));

		message.success('Duyệt đơn đăng ký thành công');
		getModel();
	};

	const tuChoiDon = async (id: string, lyDo: string): Promise<void> => {
		const data = getDataFromStorage();
		const index = data.findIndex((x) => x._id === id);
		if (index === -1) {
			message.error('Không tìm thấy đơn đăng ký');
			return;
		}

		const lichSuMoi: LichSuThaoTac.IRecord = {
			_id: generateId(),
			hanhDong: 'Rejected',
			thoiGian: new Date().toISOString(),
			nguoiThucHien: 'Admin',
			ghiChu: lyDo,
		};

		data[index] = {
			...data[index],
			trangThai: 'Rejected',
			ghiChu: lyDo,
			lichSuThaoTac: [...(data[index].lichSuThaoTac || []), lichSuMoi],
			updatedAt: new Date().toISOString(),
		};
		saveDataToStorage(data);
		message.success('Từ chối đơn đăng ký thành công');
		getModel();
	};

	const duyetNhieuDon = async (ids: React.Key[]): Promise<void> => {
		if (!ids.length) return;
		const data = getDataFromStorage();
		const thanhVienData = JSON.parse(localStorage.getItem('thanhvien') || '[]');

		for (const id of ids) {
			const index = data.findIndex((x) => x._id === id);
			if (index !== -1 && data[index].trangThai === 'Pending') {
				const lichSuMoi: LichSuThaoTac.IRecord = {
					_id: generateId(),
					hanhDong: 'Approved',
					thoiGian: new Date().toISOString(),
					nguoiThucHien: 'Admin',
					ghiChu: 'Đơn đăng ký được duyệt',
				};

				data[index] = {
					...data[index],
					trangThai: 'Approved',
					lichSuThaoTac: [...(data[index].lichSuThaoTac || []), lichSuMoi],
					updatedAt: new Date().toISOString(),
				};

				// Tự động thêm thành viên
				const thanhVienMoi = {
					_id: generateId(),
					hoTen: data[index].hoTen,
					email: data[index].email,
					soDienThoai: data[index].soDienThoai,
					gioiTinh: data[index].gioiTinh,
					diaChi: data[index].diaChi,
					soTruong: data[index].soTruong,
					cauLacBoId: data[index].cauLacBoId,
					cauLacBoTen: data[index].cauLacBoTen,
					ngayThamGia: new Date().toISOString(),
					trangThai: 'Active' as const,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				thanhVienData.push(thanhVienMoi);
			}
		}

		saveDataToStorage(data);
		localStorage.setItem('thanhvien', JSON.stringify(thanhVienData));
		message.success(`Duyệt thành công ${ids.length} đơn đăng ký`);
		setSelectedIds([]);
		getModel();
	};

	const tuChoiNhieuDon = async (ids: React.Key[], lyDo: string): Promise<void> => {
		if (!ids.length) return;
		const data = getDataFromStorage();

		for (const id of ids) {
			const index = data.findIndex((x) => x._id === id);
			if (index !== -1 && data[index].trangThai === 'Pending') {
				const lichSuMoi: LichSuThaoTac.IRecord = {
					_id: generateId(),
					hanhDong: 'Rejected',
					thoiGian: new Date().toISOString(),
					nguoiThucHien: 'Admin',
					ghiChu: lyDo,
				};

				data[index] = {
					...data[index],
					trangThai: 'Rejected',
					ghiChu: lyDo,
					lichSuThaoTac: [...(data[index].lichSuThaoTac || []), lichSuMoi],
					updatedAt: new Date().toISOString(),
				};
			}
		}

		saveDataToStorage(data);
		message.success(`Từ chối thành công ${ids.length} đơn đăng ký`);
		setSelectedIds([]);
		getModel();
	};

	const handleEdit = (rec: DonDangKy.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setVisibleForm(true);
	};

	const handleView = (rec: DonDangKy.IRecord) => {
		setRecord(rec);
		setVisibleChiTiet(true);
	};

	const handleViewLichSu = (rec: DonDangKy.IRecord) => {
		setRecord(rec);
		setVisibleLichSu(true);
	};

	const getSoLuongTheoTrangThai = (): { pending: number; approved: number; rejected: number } => {
		const data = getDataFromStorage();
		return {
			pending: data.filter((x) => x.trangThai === 'Pending').length,
			approved: data.filter((x) => x.trangThai === 'Approved').length,
			rejected: data.filter((x) => x.trangThai === 'Rejected').length,
		};
	};

	return {
		danhSach,
		setDanhSach,
		record,
		setRecord,
		visibleForm,
		setVisibleForm,
		visibleChiTiet,
		setVisibleChiTiet,
		visibleLichSu,
		setVisibleLichSu,
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
		duyetDon,
		tuChoiDon,
		duyetNhieuDon,
		tuChoiNhieuDon,
		handleEdit,
		handleView,
		handleViewLichSu,
		getSoLuongTheoTrangThai,
	};
};
