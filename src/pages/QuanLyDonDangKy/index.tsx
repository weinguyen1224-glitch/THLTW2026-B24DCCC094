import { type IColumn } from '@/components/Table/typing';
import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	HistoryOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Modal, Popconfirm, Space, Table, Tooltip, Tag, Select, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDonDangKy from './components/Form';
import XemChiTietModal from './components/XemChiTiet';
import LichSuThaoTacModal from './components/LichSuThaoTac';

const { Option } = Select;

const QuanLyDonDangKyPage = () => {
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
		visibleChiTiet,
		setVisibleChiTiet,
		visibleLichSu,
		setVisibleLichSu,
		getModel,
		deleteModel,
		duyetDon,
		tuChoiDon,
		duyetNhieuDon,
		tuChoiNhieuDon,
		handleEdit,
	} = useModel('dondangky' as any);

	const [searchText, setSearchText] = useState<string>('');
	const [filterTrangThai, setFilterTrangThai] = useState<string>('');
	const [filteredData, setFilteredData] = useState<DonDangKy.IRecord[]>([]);

	useEffect(() => {
		(getModel as any)();
	}, []);

	useEffect(() => {
		let filtered = danhSach;

		if (searchText) {
			filtered = filtered.filter(
				(item: DonDangKy.IRecord) =>
					item.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
					item.email.toLowerCase().includes(searchText.toLowerCase()) ||
					item.soDienThoai.includes(searchText),
			);
		}

		if (filterTrangThai) {
			filtered = filtered.filter((item: DonDangKy.IRecord) => item.trangThai === filterTrangThai);
		}

		setFilteredData(filtered);
	}, [searchText, filterTrangThai, danhSach]);

	const handleAddNew = () => {
		setRecord({} as DonDangKy.IRecord);
		setEdit(false);
		setVisibleForm(true);
	};

	const handleViewDetail = (donRecord: DonDangKy.IRecord) => {
		setRecord(donRecord);
		setVisibleChiTiet(true);
	};

	const handleViewHistory = (donRecord: DonDangKy.IRecord) => {
		setRecord(donRecord);
		setVisibleLichSu(true);
	};

	const handleDuyet = (donRecord: DonDangKy.IRecord) => {
		Modal.confirm({
			title: 'Xác nhận duyệt đơn đăng ký?',
			content: `Duyệt đơn đăng ký của ${donRecord.hoTen} vào câu lạc bộ ${donRecord.cauLacBoTen}?`,
			okText: 'Duyệt',
			cancelText: 'Hủy',
			onOk: () => duyetDon(donRecord._id),
		});
	};

	const handleTuChoi = (donRecord: DonDangKy.IRecord) => {
		Modal.confirm({
			title: 'Xác nhận từ chối đơn đăng ký?',
			content: (
				<div>
					<p>Từ chối đơn đăng ký của {donRecord.hoTen}</p>
					<Input.TextArea id='lyDoTuChoi' placeholder='Nhập lý do từ chối (bắt buộc)' rows={3} />
				</div>
			),
			okText: 'Từ chối',
			cancelText: 'Hủy',
			onOk: () => {
				const textarea = document.getElementById('lyDoTuChoi') as HTMLTextAreaElement;
				const lyDo = textarea?.value?.trim();
				if (!lyDo) {
					message.error('Vui lòng nhập lý do từ chối');
					return Promise.reject('Missing reason');
				}
				return tuChoiDon(donRecord._id, lyDo);
			},
		});
	};

	const handleBulkDuyet = () => {
		if (!selectedIds.length) return;
		Modal.confirm({
			title: `Xác nhận duyệt ${selectedIds.length} đơn đăng ký?`,
			content: 'Tất cả đơn được chọn sẽ được duyệt và thành viên sẽ tự động được thêm vào câu lạc bộ.',
			okText: 'Duyệt tất cả',
			cancelText: 'Hủy',
			onOk: () => duyetNhieuDon(selectedIds),
		});
	};

	const handleBulkTuChoi = () => {
		if (!selectedIds.length) return;
		Modal.confirm({
			title: `Xác nhận từ chối ${selectedIds.length} đơn đăng ký?`,
			content: (
				<div>
					<p>Tất cả đơn được chọn sẽ bị từ chối.</p>
					<Input.TextArea id='lyDoTuChoiNhieu' placeholder='Nhập lý do từ chối (bắt buộc)' rows={3} />
				</div>
			),
			okText: 'Từ chối tất cả',
			cancelText: 'Hủy',
			onOk: () => {
				const textarea = document.getElementById('lyDoTuChoiNhieu') as HTMLTextAreaElement;
				const lyDo = textarea?.value?.trim();
				if (!lyDo) {
					message.error('Vui lòng nhập lý do từ chối');
					return Promise.reject('Missing reason');
				}
				return tuChoiNhieuDon(selectedIds, lyDo);
			},
		});
	};

	const getTrangThaiTag = (trangThai: string) => {
		switch (trangThai) {
			case 'Approved':
				return <Tag color='green'>Đã duyệt</Tag>;
			case 'Rejected':
				return <Tag color='red'>Từ chối</Tag>;
			default:
				return <Tag color='orange'>Đang chờ</Tag>;
		}
	};

	const columns: IColumn<DonDangKy.IRecord>[] = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			sortable: true,
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 110,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 80,
			align: 'center',
			filterType: 'select',
			filterData: ['Nam', 'Nữ', 'Khác'],
			render: (text: string) => <Tag color={text === 'Nam' ? 'blue' : 'pink'}>{text}</Tag>,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoTen',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: ['Pending', 'Approved', 'Rejected'],
			render: (text: string) => getTrangThaiTag(text),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 130,
			align: 'center',
			sortable: true,
			render: (text: string) => (text ? moment(text).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 200,
			fixed: 'right',
			render: (donRecord: DonDangKy.IRecord) => (
				<Space size={0}>
					<Tooltip title='Xem chi tiết'>
						<Button onClick={() => handleViewDetail(donRecord)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip title='Lịch sử thao tác'>
						<Button onClick={() => handleViewHistory(donRecord)} type='link' icon={<HistoryOutlined />} />
					</Tooltip>
					{donRecord.trangThai === 'Pending' && (
						<>
							<Tooltip title='Chỉnh sửa'>
								<Button onClick={() => handleEdit(donRecord)} type='link' icon={<EditOutlined />} />
							</Tooltip>
							<Tooltip title='Duyệt'>
								<Button
									onClick={() => handleDuyet(donRecord)}
									type='link'
									icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
								/>
							</Tooltip>
							<Tooltip title='Từ chối'>
								<Button
									onClick={() => handleTuChoi(donRecord)}
									type='link'
									icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
								/>
							</Tooltip>
						</>
					)}
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(donRecord._id)}
							title='Bạn có chắc chắn muốn xóa đơn này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	const pendingSelected = selectedIds.filter((id: React.Key) => {
		const item = danhSach.find((x: DonDangKy.IRecord) => x._id === id);
		return item?.trangThai === 'Pending';
	});

	const rowSelection = {
		selectedRowKeys: selectedIds,
		onChange: (selectedRowKeys: React.Key[]) => {
			setSelectedIds(selectedRowKeys);
		},
		getCheckboxProps: (donRecord: DonDangKy.IRecord) => ({
			disabled: donRecord.trangThai !== 'Pending',
		}),
	};

	return (
		<Card
			title='Quản lý đơn đăng ký'
			extra={
				<Space>
					<Input.Search
						placeholder='Tìm kiếm theo tên, email, SĐT...'
						allowClear
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 220 }}
					/>
					<Select
						placeholder='Lọc theo trạng thái'
						allowClear
						style={{ width: 140 }}
						value={filterTrangThai || undefined}
						onChange={(value) => setFilterTrangThai(value || '')}
					>
						<Option value='Pending'>Đang chờ</Option>
						<Option value='Approved'>Đã duyệt</Option>
						<Option value='Rejected'>Từ chối</Option>
					</Select>
					<Button type='primary' onClick={handleAddNew}>
						Thêm mới
					</Button>
				</Space>
			}
		>
			{pendingSelected.length > 0 && (
				<div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 8 }}>
					<Space>
						<span>Đã chọn: {pendingSelected.length} đơn đang chờ</span>
						<Button type='primary' size='small' icon={<CheckCircleOutlined />} onClick={handleBulkDuyet}>
							Duyệt {pendingSelected.length} đơn đã chọn
						</Button>
						<Button danger size='small' icon={<CloseCircleOutlined />} onClick={handleBulkTuChoi}>
							Từ chối {pendingSelected.length} đơn đã chọn
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
					showTotal: (total) => `Tổng số: ${total} đơn đăng ký`,
				}}
				scroll={{ x: 1400 }}
				locale={{ emptyText: 'Không có dữ liệu' }}
			/>

			<Modal
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={600}
				destroyOnClose
				title={edit ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
			>
				<FormDonDangKy />
			</Modal>

			<XemChiTietModal
				visible={visibleChiTiet}
				onClose={() => setVisibleChiTiet(false)}
				record={record}
				onEdit={() => {
					setVisibleChiTiet(false);
					if (record) handleEdit(record);
				}}
			/>

			<LichSuThaoTacModal visible={visibleLichSu} onClose={() => setVisibleLichSu(false)} record={record} />
		</Card>
	);
};

export default QuanLyDonDangKyPage;
