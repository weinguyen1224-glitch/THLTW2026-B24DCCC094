import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ColorDotTrangThai, TenDotTrangThai } from '@/services/TotNghiep/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const DotTotNghiepPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('totnghiep.dottotnghiep');

	const columns: IColumn<TotNghiep.IDotTotNghiep>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Năm học',
			dataIndex: 'namHoc',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Học kỳ',
			dataIndex: 'hocKy',
			align: 'center',
			width: 80,
			filterType: 'select',
			filterData: ['1', '2', '3'],
			sortable: true,
		},
		{
			title: 'Ngày bắt đầu',
			dataIndex: 'ngayBatDau',
			align: 'center',
			width: 120,
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Ngày kết thúc',
			dataIndex: 'ngayKetThuc',
			align: 'center',
			width: 120,
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 110,
			filterType: 'select',
			filterData: Object.entries(TenDotTrangThai).map(([value, label]) => ({ value, label })),
			render: (val: keyof typeof TenDotTrangThai) =>
				val ? <Tag color={ColorDotTrangThai[val]}>{TenDotTrangThai[val]}</Tag> : '',
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 200,
			ellipsis: true,
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
			render: (record: TotNghiep.IDotTotNghiep) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa đợt tốt nghiệp này?'
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
			modelName='totnghiep.dottotnghiep'
			title='Đợt tốt nghiệp'
			Form={Form}
			buttons={{ import: true, export: true }}
		/>
	);
};

export default DotTotNghiepPage;
