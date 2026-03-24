import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const CauHinhBienMauPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('totnghiep.cauhinhbienmau');

	const columns: IColumn<TotNghiep.ICauHinhBienMau>[] = [
		{ title: 'Tên cấu hình', dataIndex: 'ten', width: 200, filterType: 'string', sortable: true },
		{
			title: 'Màu sắc',
			dataIndex: 'mauSac',
			width: 100,
			render: (val) =>
				val ? (
					<span style={{ background: val, padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9' }}>
						{val}
					</span>
				) : (
					''
				),
		},
		{ title: 'Kích thước', dataIndex: 'kichThuoc', width: 100 },
		{ title: 'Font chữ', dataIndex: 'fontChu', width: 130 },
		{ title: 'Hình dạng', dataIndex: 'hinhDang', width: 120 },
		{
			title: 'Màu chữ',
			dataIndex: 'mauSacChu',
			width: 100,
			render: (val) => (val ? <span style={{ color: val, fontWeight: 'bold' }}>{val}</span> : ''),
		},
		{ title: 'Kiểu chữ', dataIndex: 'kieuChu', width: 100 },
		{ title: 'Người ký', dataIndex: 'nguoiKyMacDinh', width: 150 },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 100,
			render: (val) => (val ? <Tag color='green'>Kích hoạt</Tag> : <Tag color='red'>Vô hiệu hóa</Tag>),
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
			render: (record: TotNghiep.ICauHinhBienMau) => (
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
			modelName='totnghiep.cauhinhbienmau'
			title='Cấu hình biên mẫu'
			Form={Form}
		/>
	);
};

export default CauHinhBienMauPage;
