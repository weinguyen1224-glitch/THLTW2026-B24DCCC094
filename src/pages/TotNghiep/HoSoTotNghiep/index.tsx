import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { TenHoSoTrangThai, ColorHoSoTrangThai, TenXepLoai } from '@/services/TotNghiep/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const HoSoTotNghiepPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('totnghiep.hosototnghiep');

	const columns: IColumn<TotNghiep.IHoSoTotNghiep>[] = [
		{ title: 'Mã SV', dataIndex: 'maSinhVien', width: 100, filterType: 'string', sortable: true },
		{ title: 'Họ tên', dataIndex: 'hoTen', width: 180, filterType: 'string', sortable: true },
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 110,
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{ title: 'Giới tính', dataIndex: 'gioiTinh', align: 'center', width: 80 },
		{ title: 'Số CMND', dataIndex: 'soCMND', width: 120 },
		{ title: 'Ngành', dataIndex: 'tenNganh', width: 180, filterType: 'string' },
		{ title: 'Khoa', dataIndex: 'tenKhoa', width: 150, filterType: 'string' },
		{
			title: 'Xếp loại',
			dataIndex: 'xepLoaiTotNghiep',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.entries(TenXepLoai).map(([value, label]) => ({ value, label })),
			render: (val: keyof typeof TenXepLoai) => (val ? TenXepLoai[val] : ''),
		},
		{ title: 'Số QĐ', dataIndex: 'soQuyetDinh', width: 120 },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 110,
			filterType: 'select',
			filterData: Object.entries(TenHoSoTrangThai).map(([value, label]) => ({ value, label })),
			render: (val: keyof typeof TenHoSoTrangThai) =>
				val ? <Tag color={ColorHoSoTrangThai[val]}>{TenHoSoTrangThai[val]}</Tag> : '',
		},
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
			render: (record: TotNghiep.IHoSoTotNghiep) => (
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
			modelName='totnghiep.hosototnghiep'
			title='Hồ sơ tốt nghiệp'
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default HoSoTotNghiepPage;
