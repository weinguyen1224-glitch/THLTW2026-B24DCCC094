import { Avatar, Button, Modal, Space, Table, Tag } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface ThanhVienCLBProps {
	visible: boolean;
	onClose: () => void;
	cauLacBoId: string;
	cauLacBoTen: string;
}

const ThanhVienCLBModal = (props: ThanhVienCLBProps) => {
	const { visible, onClose, cauLacBoId, cauLacBoTen } = props;
	const [danhSach, setDanhSach] = useState<ThanhVien.IRecord[]>([]);

	const loadThanhVien = () => {
		const data = JSON.parse(localStorage.getItem('thanhvien') || '[]');
		const filtered = data.filter((x: ThanhVien.IRecord) => x.cauLacBoId === cauLacBoId && x.trangThai === 'Active');
		setDanhSach(filtered);
	};

	useEffect(() => {
		if (visible && cauLacBoId) {
			loadThanhVien();
		}
	}, [visible, cauLacBoId]);

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			render: (text: string) => (
				<Space>
					<Avatar size='small' icon={<TeamOutlined />} />
					{text}
				</Space>
			),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
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
			render: (text: string) => <Tag color={text === 'Nam' ? 'blue' : 'pink'}>{text}</Tag>,
		},
		{
			title: 'Ngày tham gia',
			dataIndex: 'ngayThamGia',
			width: 140,
			render: (text: string) => (text ? moment(text).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			render: (text: string) => (
				<Tag color={text === 'Active' ? 'green' : 'red'}>{text === 'Active' ? 'Hoạt động' : 'Không hoạt động'}</Tag>
			),
		},
	];

	return (
		<Modal
			title={
				<Space>
					<TeamOutlined />
					Danh sách thành viên CLB: {cauLacBoTen}
				</Space>
			}
			visible={visible}
			onCancel={onClose}
			width={800}
			footer={[
				<Button key='close' onClick={onClose}>
					Đóng
				</Button>,
			]}
		>
			<Table
				columns={columns}
				dataSource={danhSach}
				rowKey='_id'
				pagination={{ pageSize: 10 }}
				locale={{ emptyText: 'Chưa có thành viên nào' }}
			/>
			<div style={{ marginTop: 16, textAlign: 'right', color: '#888' }}>
				Tổng số thành viên: <strong>{danhSach.length}</strong>
			</div>
		</Modal>
	);
};

export default ThanhVienCLBModal;
