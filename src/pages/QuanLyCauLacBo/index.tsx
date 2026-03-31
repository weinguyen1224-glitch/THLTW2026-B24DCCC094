import { type IColumn } from '@/components/Table/typing';
import {
	DeleteOutlined,
	EditOutlined,
	TeamOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCauLacBo from './components/Form';
import ThanhVienCLBModal from './components/ThanhVienCLB';

const QuanLyCauLacBoPage = () => {
	const {
		danhSach,
		loading,
		selectedIds,
		setSelectedIds,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		record,
		setRecord,
		visibleThanhVien,
		setVisibleThanhVien,
		getModel,
		deleteModel,
		deleteManyModel,
		handleEdit,
	} = useModel('caulacbo' as any);

	const [searchText, setSearchText] = useState<string>('');
	const [filteredData, setFilteredData] = useState<CauLacBo.IRecord[]>([]);

	useEffect(() => {
		(getModel as any)();
	}, []);

	useEffect(() => {
		if (searchText) {
			const filtered = danhSach.filter(
				(item: CauLacBo.IRecord) =>
					item.ten.toLowerCase().includes(searchText.toLowerCase()) ||
					item.chuNhiem.toLowerCase().includes(searchText.toLowerCase()),
			);
			setFilteredData(filtered);
		} else {
			setFilteredData(danhSach);
		}
	}, [searchText, danhSach]);

	const handleViewThanhVien = (clubRecord: CauLacBo.IRecord) => {
		setRecord(clubRecord);
		setVisibleThanhVien(true);
	};

	const handleAddNew = () => {
		setRecord({} as CauLacBo.IRecord);
		setEdit(false);
		setVisibleForm(true);
	};

	const columns: IColumn<CauLacBo.IRecord>[] = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			width: 100,
			align: 'center',
			render: (text: string) =>
				text ? (
					<Avatar size={50} src={text} />
				) : (
					<Avatar size={50} icon={<TeamOutlined />} style={{ backgroundColor: '#1890ff' }} />
				),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 140,
			align: 'center',
			sortable: true,
			render: (text: string) => (text ? moment(text).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 200,
			ellipsis: true,
			render: (text: string) => {
				if (!text) return '-';
				// Loại bỏ HTML tags để hiển thị text ngắn gọn trong table
				const plainText = text.replace(/<[^>]*>/g, '').substring(0, 50);
				return (
					<Tooltip title={<div dangerouslySetInnerHTML={{ __html: text }} />}>
						<span>
							{plainText}
							{text.length > 50 ? '...' : ''}
						</span>
					</Tooltip>
				);
			},
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiem',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Số thành viên',
			dataIndex: 'soThanhVien',
			width: 120,
			align: 'center',
			sortable: true,
			render: (text: number) => <Tag color='blue'>{text || 0}</Tag>,
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: ['Có', 'Không'],
			render: (text: boolean) =>
				text ? (
					<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
				) : (
					<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
				),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (clubRecord: CauLacBo.IRecord) => (
				<Space>
					<Tooltip title='Xem danh sách thành viên'>
						<Button
							onClick={() => handleViewThanhVien(clubRecord)}
							type='link'
							icon={<TeamOutlined />}
							style={{ color: '#1890ff' }}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(clubRecord)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(clubRecord._id)}
							title='Bạn có chắc chắn muốn xóa câu lạc bộ này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	const rowSelection = {
		selectedRowKeys: selectedIds,
		onChange: (selectedRowKeys: React.Key[]) => {
			setSelectedIds(selectedRowKeys);
		},
	};

	const handleDeleteMany = () => {
		if (selectedIds.length > 0) {
			Modal.confirm({
				title: `Xác nhận xóa ${selectedIds.length} câu lạc bộ?`,
				content: 'Hành động này không thể hoàn tác.',
				onOk: () => deleteManyModel(selectedIds as string[]),
			});
		}
	};

	return (
		<Card
			title='Quản lý câu lạc bộ'
			extra={
				<Space>
					<Input.Search
						placeholder='Tìm kiếm câu lạc bộ...'
						allowClear
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 250 }}
					/>
					<Button type='primary' onClick={handleAddNew}>
						Thêm mới
					</Button>
				</Space>
			}
		>
			{selectedIds.length > 0 && (
				<div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 8 }}>
					<Space>
						<span>Đã chọn: {selectedIds.length} câu lạc bộ</span>
						<Button danger size='small' onClick={handleDeleteMany}>
							Xóa đã chọn
						</Button>
						<Button size='small' onClick={() => setSelectedIds([])}>
							Bỏ chọn
						</Button>
					</Space>
				</div>
			)}

			<Table
				rowSelection={rowSelection}
				columns={columns}
				dataSource={filteredData.map((item, index) => ({
					...item,
					key: item._id,
					index: index + 1,
				}))}
				loading={loading}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total) => `Tổng số: ${total} câu lạc bộ`,
				}}
				scroll={{ x: 1200 }}
				locale={{ emptyText: 'Không có dữ liệu' }}
			/>

			<Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={600}
				destroyOnClose
				title={edit ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
			>
				<FormCauLacBo />
			</Modal>

			<ThanhVienCLBModal
				visible={visibleThanhVien}
				onClose={() => setVisibleThanhVien(false)}
				cauLacBoId={record?._id || ''}
				cauLacBoTen={record?.ten || ''}
			/>
		</Card>
	);
};

export default QuanLyCauLacBoPage;
