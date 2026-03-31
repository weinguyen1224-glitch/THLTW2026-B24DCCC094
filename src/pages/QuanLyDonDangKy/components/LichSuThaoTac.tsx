import { Modal, Table, Tag, Space, Button } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';

interface LichSuThaoTacProps {
	visible: boolean;
	onClose: () => void;
	record: DonDangKy.IRecord | undefined;
}

const LichSuThaoTacModal = (props: LichSuThaoTacProps) => {
	const { visible, onClose, record } = props;

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: 60,
			align: 'center' as const,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Hành động',
			dataIndex: 'hanhDong',
			width: 120,
			render: (text: string) => {
				switch (text) {
					case 'Approved':
						return <Tag color='green'>Duyệt</Tag>;
					case 'Rejected':
						return <Tag color='red'>Từ chối</Tag>;
					default:
						return <Tag color='blue'>Cập nhật</Tag>;
				}
			},
		},
		{
			title: 'Thời gian',
			dataIndex: 'thoiGian',
			width: 160,
			render: (text: string) => moment(text).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Người thực hiện',
			dataIndex: 'nguoiThucHien',
			width: 120,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			ellipsis: true,
		},
	];

	const lichSuData = record?.lichSuThaoTac || [];

	return (
		<Modal
			title={
				<Space>
					<HistoryOutlined />
					Lịch sử thao tác - {record?.hoTen}
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
				dataSource={lichSuData.map((item: LichSuThaoTac.IRecord, index: number) => ({
					...item,
					key: item._id || index,
					index: index + 1,
				}))}
				pagination={false}
				locale={{ emptyText: 'Chưa có lịch sử thao tác' }}
				size='small'
			/>
			{lichSuData.length > 0 && (
				<div style={{ marginTop: 16, textAlign: 'right', color: '#888', fontSize: 12 }}>
					Tổng số thao tác: {lichSuData.length}
				</div>
			)}
		</Modal>
	);
};

export default LichSuThaoTacModal;
