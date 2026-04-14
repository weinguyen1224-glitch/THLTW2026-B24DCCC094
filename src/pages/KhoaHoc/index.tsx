import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';
import View from './components/View';

const KhoaHocPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit, handleView, danhSach, isView } = useModel('khoahoc');

	const columns: IColumn<KhoaHoc.IRecord>[] = [
		{
			title: 'Mã KH',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên khóa học',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Giảng viên',
			dataIndex: 'giangVien',
			width: 150,
			filterType: 'select',
			filterData: danhSach?.map((item) => item.giangVien).filter((v, i, a) => a.indexOf(v) === i) || [],
			sortable: true,
		},
		{
			title: 'Số lượng học viên',
			dataIndex: 'soLuongHocVien',
			width: 150,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 130,
			filterType: 'select',
			filterData: ['Đang mở', 'Đã kết thúc', 'Tạm dừng'],
			render: (val: string) => {
				let color = 'green';
				if (val === 'Đã kết thúc') color = 'red';
				else if (val === 'Tạm dừng') color = 'orange';
				return <Tag color={color}>{val}</Tag>;
			},
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 150,
			filterType: 'datetime',
			sortable: true,
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: KhoaHoc.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								handleEdit(record);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
					<Popconfirm
						onConfirm={(e?: any) => {
							e?.stopPropagation();
							deleteModel(record._id, getModel);
						}}
						title={
							record.soLuongHocVien > 0
								? 'Không thể xóa khóa học đã có học viên!'
								: 'Bạn có chắc chắn muốn xóa khóa học này?'
						}
						placement='topLeft'
						okText='Xóa'
						cancelText='Hủy'
						okButtonProps={{ danger: true, disabled: record.soLuongHocVien > 0 }}
					>
						<Tooltip title={record.soLuongHocVien > 0 ? 'Khóa học đã có học viên' : 'Xóa'}>
							<Button
								onClick={(e) => e.stopPropagation()}
								danger
								type='link'
								icon={<DeleteOutlined />}
								disabled={record.soLuongHocVien > 0}
							/>
						</Tooltip>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='khoahoc'
				title='Quản lý Khóa học'
				Form={!isView ? Form : undefined}
				otherProps={{
					onRow: (rec: any) => ({
						onClick: () => {
							if (!isView) {
								handleView(rec);
							}
						},
						style: { cursor: !isView ? 'pointer' : 'default' },
					}),
				}}
			/>
			{isView && <View />}
		</>
	);
};

export default KhoaHocPage;
