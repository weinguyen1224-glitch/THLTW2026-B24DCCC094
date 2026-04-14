import { message } from 'antd';
import { useState } from 'react';

const generateId = () => Math.random().toString(36).substring(2, 15);

const seedData: KhoaHoc.IRecord[] = [
	{
		_id: 'seed1',
		ma: 'KH001',
		ten: 'Lập trình React cơ bản',
		giangVien: 'ThS. Nguyễn Văn A',
		soLuongHocVien: 25,
		moTa: '<p>Khóa học React cơ bản dành cho người mới bắt đầu</p>',
		trangThai: 'Đang mở',
		createdAt: new Date().toISOString(),
	},
	{
		_id: 'seed2',
		ma: 'KH002',
		ten: 'Python for Data Science',
		giangVien: 'TS. Lê Văn C',
		soLuongHocVien: 40,
		moTa: '<p>Khóa học Python ứng dụng trong Khoa học dữ liệu</p>',
		trangThai: 'Đang mở',
		createdAt: new Date().toISOString(),
	},
	{
		_id: 'seed3',
		ma: 'KH003',
		ten: 'Web Development Full Stack',
		giangVien: 'PGS.TS. Phạm Thị D',
		soLuongHocVien: 0,
		moTa: '<p>Khóa học lập trình web toàn diện từ frontend đến backend</p>',
		trangThai: 'Tạm dừng',
		createdAt: new Date().toISOString(),
	},
	{
		_id: 'seed4',
		ma: 'KH004',
		ten: 'Machine Learning Fundamentals',
		giangVien: 'TS. Lê Văn C',
		soLuongHocVien: 15,
		moTa: '<p>Khóa học cơ bản về Machine Learning</p>',
		trangThai: 'Đã kết thúc',
		createdAt: new Date().toISOString(),
	},
];

const getLocalStorageData = (): KhoaHoc.IRecord[] => {
	const data = localStorage.getItem('khoahoc');
	if (data) {
		return JSON.parse(data);
	}
	localStorage.setItem('khoahoc', JSON.stringify(seedData));
	return seedData;
};

const setLocalStorageData = (data: KhoaHoc.IRecord[]) => {
	localStorage.setItem('khoahoc', JSON.stringify(data));
};

export default () => {
	const [danhSach, setDanhSach] = useState<KhoaHoc.IRecord[]>(getLocalStorageData());
	const [record, setRecord] = useState<KhoaHoc.IRecord>();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>(false);
	const [edit, setEdit] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(danhSach.length);
	const [filters, setFilters] = useState<any[]>([]);
	const [condition, setCondition] = useState<any>({});
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const getModel = () => {
		setLoading(true);
		const data = getLocalStorageData();
		setDanhSach(data);
		setTotal(data.length);
		setLoading(false);
		return Promise.resolve(data);
	};

	const postModel = async (payload: Partial<KhoaHoc.IRecord>): Promise<KhoaHoc.IRecord> => {
		setFormSubmiting(true);
		try {
			const newRecord: KhoaHoc.IRecord = {
				...payload,
				_id: generateId(),
				createdAt: new Date().toISOString(),
			} as KhoaHoc.IRecord;
			const data = getLocalStorageData();
			data.push(newRecord);
			setLocalStorageData(data);
			setDanhSach(data);
			setTotal(data.length);
			message.success('Thêm mới thành công');
			setVisibleForm(false);
			setRecord(undefined);
			setIsView(false);
			return newRecord;
		} finally {
			setFormSubmiting(false);
		}
	};

	const putModel = async (id: string, payload: Partial<KhoaHoc.IRecord>): Promise<KhoaHoc.IRecord> => {
		setFormSubmiting(true);
		try {
			const data = getLocalStorageData();
			const index = data.findIndex((item) => item._id === id);
			if (index !== -1) {
				data[index] = { ...data[index], ...payload, updatedAt: new Date().toISOString() };
				setLocalStorageData(data);
				setDanhSach(data);
				message.success('Lưu thành công');
				setVisibleForm(false);
				setRecord(undefined);
				setIsView(false);
				return data[index];
			}
			throw new Error('Không tìm thấy khóa học');
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string, getData?: () => void): Promise<any> => {
		setLoading(true);
		try {
			const data = getLocalStorageData();
			const recordToDelete = data.find((item) => item._id === id);
			if (recordToDelete && recordToDelete.soLuongHocVien > 0) {
				message.error('Không thể xóa khóa học đã có học viên');
				return Promise.reject('Khóa học đã có học viên');
			}
			const newData = data.filter((item) => item._id !== id);
			setLocalStorageData(newData);
			setDanhSach(newData);
			setTotal(newData.length);
			message.success('Xóa thành công');
			if (getData) getData();
			return Promise.resolve();
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (rec?: KhoaHoc.IRecord) => {
		setRecord(rec);
		setEdit(true);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleView = (rec?: KhoaHoc.IRecord) => {
		setRecord(rec);
		setEdit(false);
		setIsView(true);
		setVisibleForm(true);
	};

	const handleAdd = () => {
		setRecord(undefined);
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleClose = () => {
		setVisibleForm(false);
		setRecord(undefined);
		setEdit(false);
		setIsView(false);
	};

	const getAllModel = () => Promise.resolve(danhSach);

	return {
		danhSach,
		setDanhSach,
		getModel,
		getAllModel,
		postModel,
		putModel,
		deleteModel,
		page,
		setPage,
		limit,
		setLimit,
		loading,
		setLoading,
		edit,
		setEdit,
		isView,
		setIsView,
		visibleForm,
		setVisibleForm,
		total,
		setTotal,
		filters,
		setFilters,
		condition,
		setCondition,
		selectedIds,
		setSelectedIds,
		formSubmiting,
		setFormSubmiting,
		record,
		setRecord,
		handleEdit,
		handleView,
		handleAdd,
		handleClose,
	};
};
