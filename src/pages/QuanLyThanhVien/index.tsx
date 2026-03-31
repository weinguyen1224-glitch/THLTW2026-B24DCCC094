import { type IColumn } from '@/components/Table/typing';
import { SwapOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, Space, Table, Tooltip, Tag, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DoiCLBModal from './components/DoiCLBModal';

const { Option } = Select;

const QuanLyThanhVienPage = () => {
	const { danhSach, loading, selectedIds, setSelectedIds, visibleDoiCLB, setVisibleDoiCLB, getModel, doiCLB } =
		useModel('thanhvien' as any);

	const [searchText, setSearchText] = useState<string>('');
	const [filterCLB, setFilterCLB] = useState<string>('');
	const [filteredData, setFilteredData] = useState<ThanhVien.IRecord[]>([]);
	const [danhSachCLB, setDanhSachCLB] = useState<CauLacBo.IRecord[]>([]);

	const loadCauLacBo = () => {
		const data = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		setDanhSachCLB(data);
	};

	useEffect(() => {
		(getModel as any)();
		loadCauLacBo();
	}, []);

	useEffect(() => {
		let filtered = danhSach;

		if (searchText) {
			filtered = filtered.filter(
				(item: ThanhVien.IRecord) =>
					item.hoTen.toLowerCase().includes(searchText.toLowerCase()) ||
					item.email.toLowerCase().includes(searchText.toLowerCase()) ||
					item.soDienThoai.includes(searchText),
			);
		}

		if (filterCLB) {
			filtered = filtered.filter((item: ThanhVien.IRecord) => item.cauLacBoId === filterCLB);
		}

		setFilteredData(filtered);
	}, [searchText, filterCLB, danhSach]);

	const handleDoiCLB = () => {
		if (!selectedIds.length) return;
		setVisibleDoiCLB(true);
	};

	const handleConfirmDoiCLB = (cauLacBoId: string) => {
		doiCLB(selectedIds, cauLacBoId);
	};

	const columns: IColumn<ThanhVien.IRecord>[] = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
			sortable: true,
			render: (text: string, record: ThanhVien.IRecord) => (
				<Space>
					<Avatar
						size='small'
						icon={<UserOutlined />}
						style={{ backgroundColor: record.gioiTinh === 'Nam' ? '#1890ff' : '#eb2f96' }}
					/>
					<strong>{text}</strong>
				</Space>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
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
			width: 180,
			filterType: 'customselect',
			filterCustomSelect: (
				<Select placeholder='Chọn CLB' allowClear>
					{danhSachCLB.map((clb) => (
						<Option key={clb._id} value={clb._id}>
							{clb.ten}
						</Option>
					))}
				</Select>
			),
			render: (text: string) => <Tag color='blue'>{text || '-'}</Tag>,
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'ngayThamGia',
			width: 130,
			align: 'center',
			sortable: true,
			render: (text: string) => (text ? moment(text).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: ['Active', 'Inactive'],
			render: (text: string) => (
				<Tag color={text === 'Active' ? 'green' : 'red'}>{text === 'Active' ? 'Hoạt động' : 'Không hoạt động'}</Tag>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: ThanhVien.IRecord) => (
				<Space>
					<Tooltip title='Chuyển CLB'>
						<Button
							onClick={() => {
								setSelectedIds([record._id]);
								setVisibleDoiCLB(true);
							}}
							type='link'
							icon={<SwapOutlined />}
						/>
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

	return (
		<Card
			title='Quản lý thành viên'
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
						placeholder='Lọc theo câu lạc bộ'
						allowClear
						style={{ width: 180 }}
						value={filterCLB || undefined}
						onChange={(value) => setFilterCLB(value || '')}
					>
						{danhSachCLB.map((clb) => (
							<Option key={clb._id} value={clb._id}>
								{clb.ten}
							</Option>
						))}
					</Select>
				</Space>
			}
		>
			{selectedIds.length > 0 && (
				<div style={{ marginBottom: 16, padding: 12, background: '#f0f0f0', borderRadius: 8 }}>
					<Space>
						<span>Đã chọn: {selectedIds.length} thành viên</span>
						<Button type='primary' size='small' icon={<SwapOutlined />} onClick={handleDoiCLB}>
							Chuyển {selectedIds.length} thành viên sang CLB khác
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
					showTotal: (total) => `Tổng số: ${total} thành viên`,
				}}
				scroll={{ x: 1400 }}
				locale={{ emptyText: 'Không có dữ liệu' }}
			/>

			<DoiCLBModal
				visible={visibleDoiCLB}
				onClose={() => setVisibleDoiCLB(false)}
				onConfirm={handleConfirmDoiCLB}
				soLuongThanhVien={selectedIds.length}
				loading={loading}
			/>
		</Card>
	);
};

export default QuanLyThanhVienPage;
