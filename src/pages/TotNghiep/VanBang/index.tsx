import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { TenVanBangTrangThai, ColorVanBangTrangThai } from '@/services/TotNghiep/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const VanBangPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('totnghiep.vanbang');

	const columns: IColumn<TotNghiep.IVanBang>[] = [
		{ title: 'Số vào sổ', dataIndex: 'soVaoSo', width: 80, align: 'center', sortable: true },
		{ title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', width: 120, filterType: 'string', sortable: true },
		{ title: 'Quyển số', dataIndex: 'quyenSo', width: 100 },
		{ title: 'Mã SV', dataIndex: 'maSinhVien', width: 100, filterType: 'string' },
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 180, filterType: 'string' },
		{ title: 'Ngành', dataIndex: 'tenNganh', width: 180, filterType: 'string' },
		{ title: 'Đợt TN', dataIndex: 'tenDotTotNghiep', width: 180, filterType: 'string' },
		{
			title: 'Ngày cấp',
			dataIndex: 'ngayCap',
			align: 'center',
			width: 110,
			filterType: 'date',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{ title: 'Người ký', dataIndex: 'nguoiKy', width: 150 },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 100,
			filterType: 'select',
			filterData: Object.entries(TenVanBangTrangThai).map(([value, label]) => ({ value, label })),
			render: (val: keyof typeof TenVanBangTrangThai) =>
				val ? <Tag color={ColorVanBangTrangThai[val]}>{TenVanBangTrangThai[val]}</Tag> : '',
		},
		{
			title: 'Ngày trả',
			dataIndex: 'ngayTra',
			align: 'center',
			width: 110,
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{ title: 'Người nhận', dataIndex: 'nguoiNhan', width: 150 },
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 130,
			sortable: true,
			render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: TotNghiep.IVanBang) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='totnghiep.vanbang'
			title='Văn bằng'
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default VanBangPage;
