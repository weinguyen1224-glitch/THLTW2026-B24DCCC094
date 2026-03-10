import { useState } from 'react';
import {
	Card,
	Table,
	Button,
	Input,
	Select,
	Form,
	Modal,
	InputNumber,
	Tag,
	Space,
	Tabs,
	Typography,
	message,
	Popconfirm,
	List,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	SearchOutlined,
	FileTextOutlined,
	BookOutlined,
	AppstoreOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import type { KhoiKienThuc, MonHoc, CauHoi, CauTrucDeThi, DeThi, MucDoKho } from '@/services/QuanLyCauHoi/typing';

const { Title, Text } = Typography;
const { TextArea } = Input;

const { Option } = Select;

const khoiKienThucData: KhoiKienThuc[] = [
	{ id: '1', ten: 'Tổng quan', moTa: 'Kiến thức cơ bản tổng quan về môn học' },
	{ id: '2', ten: 'Chuyên sâu', moTa: 'Kiến thức chuyên sâu, nâng cao' },
	{ id: '3', ten: 'Thực hành', moTa: 'Bài tập thực hành' },
	{ id: '4', ten: 'Ứng dụng', moTa: 'Kiến thức ứng dụng thực tế' },
];

const monHocData: MonHoc[] = [
	{ id: '1', maMon: 'INT1004', tenMon: 'Lập trình web', soTinChi: 3, khoiKienThucIds: ['1', '2', '3', '4'] },
	{ id: '2', maMon: 'INT1005', tenMon: 'Cấu trúc dữ liệu', soTinChi: 3, khoiKienThucIds: ['1', '2'] },
	{ id: '3', maMon: 'INT1006', tenMon: 'Cơ sở dữ liệu', soTinChi: 4, khoiKienThucIds: ['1', '2', '4'] },
];

const cauHoiData: CauHoi[] = [
	// ===== DỄ =====
	{
		id: '1',
		maCauHoi: 'CH001',
		monHocId: '1',
		nộiDung: 'Trình bày các thẻ HTML cơ bản và cách sử dụng?',
		mucDoKho: 'de',
		khoiKienThucId: '1',
		ngayTao: '2024-01-15',
	},
	{
		id: '2',
		maCauHoi: 'CH002',
		monHocId: '1',
		nộiDung: 'CSS là gì và vai trò của CSS trong phát triển web?',
		mucDoKho: 'de',
		khoiKienThucId: '1',
		ngayTao: '2024-01-16',
	},
	{
		id: '3',
		maCauHoi: 'CH003',
		monHocId: '1',
		nộiDung: 'Phân biệt giữa thẻ block và inline trong HTML?',
		mucDoKho: 'de',
		khoiKienThucId: '1',
		ngayTao: '2024-01-17',
	},
	{
		id: '4',
		maCauHoi: 'CH004',
		monHocId: '2',
		nộiDung: 'Trình bày thuật toán sắp xếp nổi bọt (Bubble Sort)?',
		mucDoKho: 'de',
		khoiKienThucId: '1',
		ngayTao: '2024-01-18',
	},
	{
		id: '5',
		maCauHoi: 'CH005',
		monHocId: '2',
		nộiDung: 'Biến và kiểu dữ liệu trong JavaScript là gì?',
		mucDoKho: 'de',
		khoiKienThucId: '1',
		ngayTao: '2024-01-19',
	},

	// ===== TRUNG BÌNH =====
	{
		id: '6',
		maCauHoi: 'CH006',
		monHocId: '1',
		nộiDung: 'So sánh giữa RESTful API và GraphQL?',
		mucDoKho: 'trung_binh',
		khoiKienThucId: '2',
		ngayTao: '2024-01-20',
	},
	{
		id: '7',
		maCauHoi: 'CH007',
		monHocId: '1',
		nộiDung: 'Giải thích cách hoạt động của Flexbox trong CSS?',
		mucDoKho: 'trung_binh',
		khoiKienThucId: '2',
		ngayTao: '2024-01-21',
	},
	{
		id: '8',
		maCauHoi: 'CH008',
		monHocId: '2',
		nộiDung: 'Giải thích khái niệm đệ quy và đưa ra ví dụ minh họa?',
		mucDoKho: 'trung_binh',
		khoiKienThucId: '2',
		ngayTao: '2024-01-22',
	},
	{
		id: '9',
		maCauHoi: 'CH009',
		monHocId: '2',
		nộiDung: 'Phân biệt Stack và Queue trong cấu trúc dữ liệu?',
		mucDoKho: 'trung_binh',
		khoiKienThucId: '2',
		ngayTao: '2024-01-23',
	},
	{
		id: '10',
		maCauHoi: 'CH010',
		monHocId: '1',
		nộiDung: 'Giải thích cơ chế hoạt động của Promise trong JavaScript?',
		mucDoKho: 'trung_binh',
		khoiKienThucId: '2',
		ngayTao: '2024-01-24',
	},

	// ===== KHÓ =====
	{
		id: '11',
		maCauHoi: 'CH011',
		monHocId: '2',
		nộiDung: 'Phân tích độ phức tạp thời gian của thuật toán Merge Sort?',
		mucDoKho: 'kho',
		khoiKienThucId: '3',
		ngayTao: '2024-01-25',
	},
	{
		id: '12',
		maCauHoi: 'CH012',
		monHocId: '2',
		nộiDung: 'Giải thích cách hoạt động của cây nhị phân tìm kiếm (BST)?',
		mucDoKho: 'kho',
		khoiKienThucId: '3',
		ngayTao: '2024-01-26',
	},
	{
		id: '13',
		maCauHoi: 'CH013',
		monHocId: '1',
		nộiDung: 'Phân tích Virtual DOM trong React và lợi ích của nó?',
		mucDoKho: 'kho',
		khoiKienThucId: '3',
		ngayTao: '2024-01-27',
	},
	{
		id: '14',
		maCauHoi: 'CH014',
		monHocId: '1',
		nộiDung: 'Giải thích cơ chế event loop trong JavaScript?',
		mucDoKho: 'kho',
		khoiKienThucId: '3',
		ngayTao: '2024-01-28',
	},
	{
		id: '15',
		maCauHoi: 'CH015',
		monHocId: '2',
		nộiDung: 'Phân tích độ phức tạp của thuật toán Quick Sort?',
		mucDoKho: 'kho',
		khoiKienThucId: '3',
		ngayTao: '2024-01-29',
	},

	{
		id: '16',
		maCauHoi: 'CH016',
		monHocId: '2',
		nộiDung: 'So sánh các thuật toán tìm kiếm BFS và DFS trong đồ thị?',
		mucDoKho: 'rat_kho',
		khoiKienThucId: '4',
		ngayTao: '2024-01-30',
	},
	{
		id: '17',
		maCauHoi: 'CH017',
		monHocId: '2',
		nộiDung: 'Phân tích thuật toán Dijkstra và ứng dụng của nó?',
		mucDoKho: 'rat_kho',
		khoiKienThucId: '4',
		ngayTao: '2024-01-31',
	},
	{
		id: '18',
		maCauHoi: 'CH018',
		monHocId: '1',
		nộiDung: 'Giải thích cơ chế hoạt động của JWT trong xác thực API?',
		mucDoKho: 'rat_kho',
		khoiKienThucId: '4',
		ngayTao: '2024-02-01',
	},
	{
		id: '19',
		maCauHoi: 'CH019',
		monHocId: '1',
		nộiDung: 'Phân tích sự khác biệt giữa SSR, CSR và SSG trong web development?',
		mucDoKho: 'rat_kho',
		khoiKienThucId: '4',
		ngayTao: '2024-02-02',
	},
	{
		id: '20',
		maCauHoi: 'CH020',
		monHocId: '2',
		nộiDung: 'Giải thích cách hoạt động của thuật toán A* trong tìm đường?',
		mucDoKho: 'rat_kho',
		khoiKienThucId: '4',
		ngayTao: '2024-02-03',
	},
];

const cauTrucDeThiData: CauTrucDeThi[] = [
	{
		id: '1',
		ten: 'Đề thi giữa kỳ',
		monHocId: '1',
		soCauDe: 2,
		soCauTrungBinh: 2,
		soCauKho: 1,
		soCauRatKho: 0,
		khoiKienThucIds: ['1', '2', '3', '4'],
	},
	{
		id: '2',
		ten: 'Đề thi cuối kỳ',
		monHocId: '1',
		soCauDe: 3,
		soCauTrungBinh: 4,
		soCauKho: 2,
		soCauRatKho: 1,
		khoiKienThucIds: ['1', '2', '3', '4'],
	},
];

const deThiData: DeThi[] = [
	{
		id: '1',
		maDeThi: 'DT001',
		ten: 'Đề thi giữa kỳ - Lập trình web',
		monHocId: '1',
		cauHoiIds: ['1', '2', '3'],
		ngayTao: '2024-01-20',
		nguoiTao: 'Admin',
	},
];

const getMucDoLabel = (mucDo: MucDoKho): string => {
	switch (mucDo) {
		case 'de':
			return 'Dễ';
		case 'trung_binh':
			return 'Trung bình';
		case 'kho':
			return 'Khó';
		case 'rat_kho':
			return 'Rất khó';
		default:
			return mucDo;
	}
};

const getMucDoColor = (mucDo: MucDoKho): string => {
	switch (mucDo) {
		case 'de':
			return 'green';
		case 'trung_binh':
			return 'blue';
		case 'kho':
			return 'orange';
		case 'rat_kho':
			return 'red';
		default:
			return 'default';
	}
};

const QuanLyCauHoi: React.FC = () => {
	const [activeTab, setActiveTab] = useState<string>('khoiKienThuc');
	const [dsKhoiKienThuc, setDsKhoiKienThuc] = useState<KhoiKienThuc[]>(khoiKienThucData);
	const [dsMonHoc, setDsMonHoc] = useState<MonHoc[]>(monHocData);
	const [dsCauHoi, setDsCauHoi] = useState<CauHoi[]>(cauHoiData);
	const [dsCauTrucDeThi, setDsCauTrucDeThi] = useState<CauTrucDeThi[]>(cauTrucDeThiData);
	const [dsDeThi, setDsDeThi] = useState<DeThi[]>(deThiData);

	const [modalKhoiKienThuc, setModalKhoiKienThuc] = useState<boolean>(false);
	const [modalMonHoc, setModalMonHoc] = useState<boolean>(false);
	const [modalCauHoi, setModalCauHoi] = useState<boolean>(false);
	const [modalCauTruc, setModalCauTruc] = useState<boolean>(false);
	const [modalDeThi, setModalDeThi] = useState<boolean>(false);
	const [modalChiTietDeThi, setModalChiTietDeThi] = useState<boolean>(false);
	const [deThiChon, setDeThiChon] = useState<DeThi | null>(null);

	const [formKhoiKienThuc] = Form.useForm();
	const [formMonHoc] = Form.useForm();
	const [formCauHoi] = Form.useForm();
	const [formCauTruc] = Form.useForm();
	const [formDeThi] = Form.useForm();

	const [timKiemCauHoi, setTimKiemCauHoi] = useState<{ monHoc?: string; mucDo?: string; khoiKienThuc?: string }>({});
	const [editRecord, setEditRecord] = useState<any>(null);

	const handleSaveKhoiKienThuc = () => {
		formKhoiKienThuc.validateFields().then((values) => {
			if (editRecord) {
				setDsKhoiKienThuc((prev) => prev.map((item) => (item.id === editRecord.id ? { ...item, ...values } : item)));
				message.success('Cập nhật khối kiến thức thành công');
			} else {
				const newItem: KhoiKienThuc = { ...values, id: Date.now().toString() };
				setDsKhoiKienThuc((prev) => [...prev, newItem]);
				message.success('Thêm khối kiến thức thành công');
			}
			setModalKhoiKienThuc(false);
			formKhoiKienThuc.resetFields();
			setEditRecord(null);
		});
	};

	const handleSaveMonHoc = () => {
		formMonHoc.validateFields().then((values) => {
			if (editRecord) {
				setDsMonHoc((prev) => prev.map((item) => (item.id === editRecord.id ? { ...item, ...values } : item)));
				message.success('Cập nhật môn học thành công');
			} else {
				const newItem: MonHoc = { ...values, id: Date.now().toString() };
				setDsMonHoc((prev) => [...prev, newItem]);
				message.success('Thêm môn học thành công');
			}
			setModalMonHoc(false);
			formMonHoc.resetFields();
			setEditRecord(null);
		});
	};

	const handleSaveCauHoi = () => {
		formCauHoi.validateFields().then((values) => {
			if (editRecord) {
				setDsCauHoi((prev) => prev.map((item) => (item.id === editRecord.id ? { ...item, ...values } : item)));
				message.success('Cập nhật câu hỏi thành công');
			} else {
				const newItem: CauHoi = {
					...values,
					id: Date.now().toString(),
					maCauHoi: `CH${String(dsCauHoi.length + 1).padStart(3, '0')}`,
					ngayTao: new Date().toISOString().split('T')[0],
				};
				setDsCauHoi((prev) => [...prev, newItem]);
				message.success('Thêm câu hỏi thành công');
			}
			setModalCauHoi(false);
			formCauHoi.resetFields();
			setEditRecord(null);
		});
	};

	const handleSaveCauTruc = () => {
		formCauTruc.validateFields().then((values) => {
			if (editRecord) {
				setDsCauTrucDeThi((prev) => prev.map((item) => (item.id === editRecord.id ? { ...item, ...values } : item)));
				message.success('Cập nhật cấu trúc đề thi thành công');
			} else {
				const newItem: CauTrucDeThi = { ...values, id: Date.now().toString() };
				setDsCauTrucDeThi((prev) => [...prev, newItem]);
				message.success('Thêm cấu trúc đề thi thành công');
			}
			setModalCauTruc(false);
			formCauTruc.resetFields();
			setEditRecord(null);
		});
	};

	const handleTaoDeThi = () => {
		formDeThi.validateFields().then((values) => {
			const cauTruc = dsCauTrucDeThi.find((ct) => ct.id === values.cauTrucId);
			if (!cauTruc) {
				message.error('Vui lòng chọn cấu trúc đề thi');
				return;
			}

			const cauHoiLoc = dsCauHoi.filter(
				(ch) => ch.monHocId === values.monHocId && cauTruc.khoiKienThucIds.includes(ch.khoiKienThucId),
			);
			console.log(cauTruc);
			console.log('cau hoi loc', cauHoiLoc);
			const cauDe = cauHoiLoc.filter((ch) => ch.mucDoKho === 'de').slice(0, cauTruc.soCauDe);
			const cauTrungBinh = cauHoiLoc.filter((ch) => ch.mucDoKho === 'trung_binh').slice(0, cauTruc.soCauTrungBinh);
			const cauKho = cauHoiLoc.filter((ch) => ch.mucDoKho === 'kho').slice(0, cauTruc.soCauKho);
			const cauRatKho = cauHoiLoc.filter((ch) => ch.mucDoKho === 'rat_kho').slice(0, cauTruc.soCauRatKho);
			const tongCau = cauDe.length + cauTrungBinh.length + cauKho.length + cauRatKho.length;
			const tongYeuCau = cauTruc.soCauDe + cauTruc.soCauTrungBinh + cauTruc.soCauKho + cauTruc.soCauRatKho;

			if (tongCau < tongYeuCau) {
				message.error(`Không đủ câu hỏi phù hợp! Cần ${tongYeuCau} câu nhưng chỉ có ${tongCau} câu phù hợp.`);
				return;
			}

			const newDeThi: DeThi = {
				id: Date.now().toString(),
				maDeThi: `DT${String(dsDeThi.length + 1).padStart(3, '0')}`,
				ten: values.ten,
				monHocId: values.monHocId,
				cauHoiIds: [...cauDe, ...cauTrungBinh, ...cauKho, ...cauRatKho].map((ch) => ch.id),
				ngayTao: new Date().toISOString().split('T')[0],
				nguoiTao: 'Admin',
			};

			setDsDeThi((prev) => [...prev, newDeThi]);
			message.success('Tạo đề thi thành công!');
			setModalDeThi(false);
			formDeThi.resetFields();
		});
	};

	const handleDeleteKhoiKienThuc = (id: string) => {
		setDsKhoiKienThuc((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa khối kiến thức thành công');
	};

	const handleDeleteMonHoc = (id: string) => {
		setDsMonHoc((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa môn học thành công');
	};

	const handleDeleteCauHoi = (id: string) => {
		setDsCauHoi((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa câu hỏi thành công');
	};

	const handleDeleteCauTruc = (id: string) => {
		setDsCauTrucDeThi((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa cấu trúc đề thi thành công');
	};

	const handleDeleteDeThi = (id: string) => {
		setDsDeThi((prev) => prev.filter((item) => item.id !== id));
		message.success('Xóa đề thi thành công');
	};

	const handleXemChiTietDeThi = (record: DeThi) => {
		setDeThiChon(record);
		setModalChiTietDeThi(true);
	};

	const openEditKhoiKienThuc = (record: KhoiKienThuc) => {
		setEditRecord(record);
		formKhoiKienThuc.setFieldsValue(record);
		setModalKhoiKienThuc(true);
	};

	const openEditMonHoc = (record: MonHoc) => {
		setEditRecord(record);
		formMonHoc.setFieldsValue(record);
		setModalMonHoc(true);
	};

	const openEditCauHoi = (record: CauHoi) => {
		setEditRecord(record);
		formCauHoi.setFieldsValue(record);
		setModalCauHoi(true);
	};

	const openEditCauTruc = (record: CauTrucDeThi) => {
		setEditRecord(record);
		formCauTruc.setFieldsValue(record);
		setModalCauTruc(true);
	};

	const getFilteredCauHoi = () => {
		return dsCauHoi.filter((ch) => {
			if (timKiemCauHoi.monHoc && ch.monHocId !== timKiemCauHoi.monHoc) return false;
			if (timKiemCauHoi.mucDo && ch.mucDoKho !== timKiemCauHoi.mucDo) return false;
			if (timKiemCauHoi.khoiKienThuc && ch.khoiKienThucId !== timKiemCauHoi.khoiKienThuc) return false;
			return true;
		});
	};

	const columnsKhoiKienThuc = [
		{ title: 'Mã', dataIndex: 'id', key: 'id', width: 80 },
		{ title: 'Tên khối kiến thức', dataIndex: 'ten', key: 'ten' },
		{ title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: KhoiKienThuc) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEditKhoiKienThuc(record)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => handleDeleteKhoiKienThuc(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const columnsMonHoc = [
		{ title: 'Mã môn', dataIndex: 'maMon', key: 'maMon', width: 100 },
		{ title: 'Tên môn học', dataIndex: 'tenMon', key: 'tenMon' },
		{ title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi', width: 100 },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: MonHoc) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEditMonHoc(record)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => handleDeleteMonHoc(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const columnsCauHoi = [
		{ title: 'Mã câu hỏi', dataIndex: 'maCauHoi', key: 'maCauHoi', width: 100 },
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			render: (id: string) => dsMonHoc.find((m) => m.id === id)?.tenMon || id,
		},
		{ title: 'Nội dung', dataIndex: 'nộiDung', key: 'nộiDung', ellipsis: true },
		{
			title: 'Khối kiến thức',
			dataIndex: 'khoiKienThucId',
			key: 'khoiKienThucId',
			render: (id: string) => dsKhoiKienThuc.find((k) => k.id === id)?.ten || id,
		},
		{
			title: 'Mức độ',
			dataIndex: 'mucDoKho',
			key: 'mucDoKho',
			render: (mucDo: MucDoKho) => <Tag color={getMucDoColor(mucDo)}>{getMucDoLabel(mucDo)}</Tag>,
		},
		{ title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', width: 120 },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: CauHoi) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEditCauHoi(record)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => handleDeleteCauHoi(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const columnsCauTruc = [
		{ title: 'Tên cấu trúc', dataIndex: 'ten', key: 'ten' },
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			render: (id: string) => dsMonHoc.find((m) => m.id === id)?.tenMon || id,
		},
		{ title: 'Dễ', dataIndex: 'soCauDe', key: 'soCauDe', width: 60 },
		{ title: 'Trung bình', dataIndex: 'soCauTrungBinh', key: 'soCauTrungBinh', width: 90 },
		{ title: 'Khó', dataIndex: 'soCauKho', key: 'soCauKho', width: 60 },
		{ title: 'Rất khó', dataIndex: 'soCauRatKho', key: 'soCauRatKho', width: 80 },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: CauTrucDeThi) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => openEditCauTruc(record)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => handleDeleteCauTruc(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const columnsDeThi = [
		{ title: 'Mã đề thi', dataIndex: 'maDeThi', key: 'maDeThi', width: 100 },
		{ title: 'Tên đề thi', dataIndex: 'ten', key: 'ten' },
		{
			title: 'Môn học',
			dataIndex: 'monHocId',
			key: 'monHocId',
			render: (id: string) => dsMonHoc.find((m) => m.id === id)?.tenMon || id,
		},
		{ title: 'Số câu hỏi', key: 'soCau', render: (_: any, record: DeThi) => record.cauHoiIds.length },
		{ title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', width: 120 },
		{ title: 'Người tạo', dataIndex: 'nguoiTao', key: 'nguoiTao', width: 120 },
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: DeThi) => (
				<Space>
					<Button type='link' icon={<EyeOutlined />} onClick={() => handleXemChiTietDeThi(record)}>
						Xem
					</Button>
					<Popconfirm title='Bạn có chắc chắn xóa?' onConfirm={() => handleDeleteDeThi(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />}>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const TabPane = Tabs.TabPane;

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2}>Quản lý ngân hàng câu hỏi tự luận</Title>
			<Tabs activeKey={activeTab} onChange={setActiveTab}>
				<TabPane
					tab={
						<span>
							<AppstoreOutlined /> Khối kiến thức
						</span>
					}
					key='khoiKienThuc'
				>
					<Card
						extra={
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditRecord(null);
									formKhoiKienThuc.resetFields();
									setModalKhoiKienThuc(true);
								}}
							>
								Thêm mới
							</Button>
						}
					>
						<Table dataSource={dsKhoiKienThuc} columns={columnsKhoiKienThuc} rowKey='id' pagination={false} />
					</Card>
				</TabPane>
				<TabPane
					tab={
						<span>
							<BookOutlined /> Môn học
						</span>
					}
					key='monHoc'
				>
					<Card
						extra={
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditRecord(null);
									formMonHoc.resetFields();
									setModalMonHoc(true);
								}}
							>
								Thêm mới
							</Button>
						}
					>
						<Table dataSource={dsMonHoc} columns={columnsMonHoc} rowKey='id' pagination={false} />
					</Card>
				</TabPane>
				<TabPane
					tab={
						<span>
							<SearchOutlined /> Quản lý câu hỏi
						</span>
					}
					key='cauHoi'
				>
					<Card>
						<Space style={{ marginBottom: 16 }} wrap>
							<Select
								placeholder='Chọn môn học'
								allowClear
								style={{ width: 200 }}
								onChange={(val) => setTimKiemCauHoi((prev) => ({ ...prev, monHoc: val }))}
							>
								{dsMonHoc.map((m) => (
									<Option key={m.id} value={m.id}>
										{m.tenMon}
									</Option>
								))}
							</Select>
							<Select
								placeholder='Mức độ'
								allowClear
								style={{ width: 150 }}
								onChange={(val) => setTimKiemCauHoi((prev) => ({ ...prev, mucDo: val }))}
							>
								<Option value='de'>Dễ</Option>
								<Option value='trung_binh'>Trung bình</Option>
								<Option value='kho'>Khó</Option>
								<Option value='rat_kho'>Rất khó</Option>
							</Select>
							<Select
								placeholder='Khối kiến thức'
								allowClear
								style={{ width: 200 }}
								onChange={(val) => setTimKiemCauHoi((prev) => ({ ...prev, khoiKienThuc: val }))}
							>
								{dsKhoiKienThuc.map((k) => (
									<Option key={k.id} value={k.id}>
										{k.ten}
									</Option>
								))}
							</Select>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditRecord(null);
									formCauHoi.resetFields();
									setModalCauHoi(true);
								}}
							>
								Thêm câu hỏi
							</Button>
						</Space>
						<Table dataSource={getFilteredCauHoi()} columns={columnsCauHoi} rowKey='id' />
					</Card>
				</TabPane>
				<TabPane
					tab={
						<span>
							<FileTextOutlined /> Cấu trúc đề thi
						</span>
					}
					key='cauTrucDeThi'
				>
					<Card
						extra={
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									setEditRecord(null);
									formCauTruc.resetFields();
									setModalCauTruc(true);
								}}
							>
								Thêm cấu trúc
							</Button>
						}
					>
						<Table dataSource={dsCauTrucDeThi} columns={columnsCauTruc} rowKey='id' />
					</Card>
				</TabPane>
				<TabPane
					tab={
						<span>
							<FileTextOutlined /> Đề thi
						</span>
					}
					key='deThi'
				>
					<Card
						extra={
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={() => {
									formDeThi.resetFields();
									setModalDeThi(true);
								}}
							>
								Tạo đề thi
							</Button>
						}
					>
						<Table dataSource={dsDeThi} columns={columnsDeThi} rowKey='id' />
					</Card>
				</TabPane>
			</Tabs>

			<Modal
				title={editRecord ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
				visible={modalKhoiKienThuc}
				onOk={handleSaveKhoiKienThuc}
				onCancel={() => {
					setModalKhoiKienThuc(false);
					formKhoiKienThuc.resetFields();
				}}
			>
				<Form form={formKhoiKienThuc} layout='vertical'>
					<Form.Item
						name='ten'
						label='Tên khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức' }]}
					>
						<Input placeholder='Nhập tên khối kiến thức' />
					</Form.Item>
					<Form.Item name='moTa' label='Mô tả'>
						<TextArea placeholder='Nhập mô tả' rows={3} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editRecord ? 'Sửa môn học' : 'Thêm môn học'}
				visible={modalMonHoc}
				onOk={handleSaveMonHoc}
				onCancel={() => {
					setModalMonHoc(false);
					formMonHoc.resetFields();
				}}
			>
				<Form form={formMonHoc} layout='vertical'>
					<Form.Item name='maMon' label='Mã môn' rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}>
						<Input placeholder='Nhập mã môn' />
					</Form.Item>
					<Form.Item
						name='tenMon'
						label='Tên môn học'
						rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
					>
						<Input placeholder='Nhập tên môn học' />
					</Form.Item>
					<Form.Item
						name='soTinChi'
						label='Số tín chỉ'
						rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
					>
						<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder='Nhập số tín chỉ' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editRecord ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
				visible={modalCauHoi}
				onOk={handleSaveCauHoi}
				onCancel={() => {
					setModalCauHoi(false);
					formCauHoi.resetFields();
				}}
				width={700}
			>
				<Form form={formCauHoi} layout='vertical'>
					<Form.Item name='monHocId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{dsMonHoc.map((m) => (
								<Option key={m.id} value={m.id}>
									{m.tenMon}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='khoiKienThucId'
						label='Khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
					>
						<Select placeholder='Chọn khối kiến thức'>
							{dsKhoiKienThuc.map((k) => (
								<Option key={k.id} value={k.id}>
									{k.ten}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='nộiDung'
						label='Nội dung câu hỏi'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
					>
						<TextArea placeholder='Nhập nội dung câu hỏi' rows={4} />
					</Form.Item>
					<Form.Item
						name='mucDoKho'
						label='Mức độ khó'
						rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
					>
						<Select placeholder='Chọn mức độ khó'>
							<Option value='de'>Dễ</Option>
							<Option value='trung_binh'>Trung bình</Option>
							<Option value='kho'>Khó</Option>
							<Option value='rat_kho'>Rất khó</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={editRecord ? 'Sửa cấu trúc đề thi' : 'Thêm cấu trúc đề thi'}
				visible={modalCauTruc}
				onOk={handleSaveCauTruc}
				onCancel={() => {
					setModalCauTruc(false);
					formCauTruc.resetFields();
				}}
				width={600}
			>
				<Form form={formCauTruc} layout='vertical'>
					<Form.Item
						name='ten'
						label='Tên cấu trúc'
						rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc' }]}
					>
						<Input placeholder='Nhập tên cấu trúc' />
					</Form.Item>
					<Form.Item name='monHocId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{dsMonHoc.map((m) => (
								<Option key={m.id} value={m.id}>
									{m.tenMon}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='khoiKienThucIds'
						label='Khối kiến thức'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
					>
						<Select mode='multiple' placeholder='Chọn khối kiến thức'>
							{dsKhoiKienThuc.map((k) => (
								<Option key={k.id} value={k.id}>
									{k.ten}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Space style={{ width: '100%' }} split='-'>
						<Form.Item name='soCauDe' label='Số câu Dễ'>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item name='soCauTrungBinh' label='Số câu TB'>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item name='soCauKho' label='Số câu Khó'>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item name='soCauRatKho' label='Số câu Rất khó'>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					</Space>
				</Form>
			</Modal>

			<Modal
				title='Tạo đề thi'
				visible={modalDeThi}
				onOk={handleTaoDeThi}
				onCancel={() => {
					setModalDeThi(false);
					formDeThi.resetFields();
				}}
				width={600}
			>
				<Form form={formDeThi} layout='vertical'>
					<Form.Item name='ten' label='Tên đề thi' rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}>
						<Input placeholder='Nhập tên đề thi' />
					</Form.Item>
					<Form.Item name='monHocId' label='Môn học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select placeholder='Chọn môn học'>
							{dsMonHoc.map((m) => (
								<Option key={m.id} value={m.id}>
									{m.tenMon}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='cauTrucId'
						label='Cấu trúc đề thi'
						rules={[{ required: true, message: 'Vui lòng chọn cấu trúc đề thi' }]}
					>
						<Select placeholder='Chọn cấu trúc đề thi'>
							{dsCauTrucDeThi.map((ct) => (
								<Option key={ct.id} value={ct.id}>
									{ct.ten} ({ct.soCauDe} Dễ, {ct.soCauTrungBinh} TB, {ct.soCauKho} Khó)
								</Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={`Chi tiết đề thi: ${deThiChon?.ten || ''}`}
				visible={modalChiTietDeThi}
				onCancel={() => {
					setModalChiTietDeThi(false);
					setDeThiChon(null);
				}}
				width={800}
				footer={[
					<Button key='dong' onClick={() => setModalChiTietDeThi(false)}>
						Đóng
					</Button>,
				]}
			>
				{deThiChon && (
					<div>
						<p>
							<strong>Mã đề thi:</strong> {deThiChon.maDeThi}
						</p>
						<p>
							<strong>Môn học:</strong> {dsMonHoc.find((m) => m.id === deThiChon.monHocId)?.tenMon}
						</p>
						<p>
							<strong>Ngày tạo:</strong> {deThiChon.ngayTao}
						</p>
						<p>
							<strong>Người tạo:</strong> {deThiChon.nguoiTao}
						</p>
						<p>
							<strong>Số câu hỏi:</strong> {deThiChon.cauHoiIds.length}
						</p>
						<Title level={4}>Danh sách câu hỏi</Title>
						<List
							size='small'
							dataSource={
								deThiChon.cauHoiIds.map((id) => dsCauHoi.find((ch) => ch.id === id)).filter(Boolean) as CauHoi[]
							}
							renderItem={(item, index) => (
								<List.Item>
									<Card size='small' style={{ width: '100%' }}>
										<p>
											<strong>Câu {index + 1}:</strong> {item.maCauHoi}
										</p>
										<p>{item.nộiDung}</p>
										<Space>
											<Tag color={getMucDoColor(item.mucDoKho)}>{getMucDoLabel(item.mucDoKho)}</Tag>
											<Text type='secondary'>
												Khối kiến thức: {dsKhoiKienThuc.find((k) => k.id === item.khoiKienThucId)?.ten}
											</Text>
										</Space>
									</Card>
								</List.Item>
							)}
						/>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default QuanLyCauHoi;
