import { Descriptions, Modal, Tag, Button, Space, Divider } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

interface XemChiTietProps {
	visible: boolean;
	onClose: () => void;
	record: DonDangKy.IRecord | undefined;
	onEdit?: () => void;
}

const XemChiTietModal = (props: XemChiTietProps) => {
	const { visible, onClose, record, onEdit } = props;

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

	const getGioiTinhTag = (gioiTinh: string) => {
		switch (gioiTinh) {
			case 'Nam':
				return <Tag color='blue'>Nam</Tag>;
			case 'Nữ':
				return <Tag color='pink'>Nữ</Tag>;
			default:
				return <Tag color='default'>Khác</Tag>;
		}
	};

	return (
		<Modal
			title={
				<Space>
					<EyeOutlined />
					Chi tiết đơn đăng ký
				</Space>
			}
			visible={visible}
			onCancel={onClose}
			width={700}
			footer={[
				<Button key='close' onClick={onClose}>
					Đóng
				</Button>,
				onEdit && (
					<Button key='edit' type='primary' icon={<EditOutlined />} onClick={onEdit}>
						Chỉnh sửa
					</Button>
				),
			]}
		>
			{record && (
				<>
					<Descriptions column={2} bordered size='small'>
						<Descriptions.Item label='Họ tên'>{record.hoTen}</Descriptions.Item>
						<Descriptions.Item label='Email'>{record.email}</Descriptions.Item>
						<Descriptions.Item label='Số điện thoại'>{record.soDienThoai}</Descriptions.Item>
						<Descriptions.Item label='Giới tính'>{getGioiTinhTag(record.gioiTinh)}</Descriptions.Item>
						<Descriptions.Item label='Địa chỉ' span={2}>
							{record.diaChi || '-'}
						</Descriptions.Item>
						<Descriptions.Item label='Sở trường' span={2}>
							{record.soTruong || '-'}
						</Descriptions.Item>
						<Descriptions.Item label='Câu lạc bộ'>{record.cauLacBoTen || '-'}</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>{getTrangThaiTag(record.trangThai)}</Descriptions.Item>
						<Descriptions.Item label='Lý do đăng ký' span={2}>
							{record.lyDoDangKy || '-'}
						</Descriptions.Item>
						{record.ghiChu && (
							<Descriptions.Item label='Ghi chú (lý do từ chối)' span={2}>
								{record.ghiChu}
							</Descriptions.Item>
						)}
						<Descriptions.Item label='Ngày tạo'>
							{record.createdAt ? moment(record.createdAt).format('HH:mm DD/MM/YYYY') : '-'}
						</Descriptions.Item>
						<Descriptions.Item label='Cập nhật lần cuối'>
							{record.updatedAt ? moment(record.updatedAt).format('HH:mm DD/MM/YYYY') : '-'}
						</Descriptions.Item>
					</Descriptions>

					{record.lichSuThaoTac && record.lichSuThaoTac.length > 0 && (
						<>
							<Divider>Lịch sử thao tác</Divider>
							<Descriptions column={1} bordered size='small'>
								{record.lichSuThaoTac.map((item: LichSuThaoTac.IRecord, index: number) => (
									<Descriptions.Item
										key={item._id || index}
										label={
											<Space>
												{item.hanhDong === 'Approved' ? (
													<Tag color='green'>Duyệt</Tag>
												) : item.hanhDong === 'Rejected' ? (
													<Tag color='red'>Từ chối</Tag>
												) : (
													<Tag color='blue'>Cập nhật</Tag>
												)}
												<span style={{ fontSize: 12, color: '#888' }}>
													{moment(item.thoiGian).format('HH:mm DD/MM/YYYY')}
												</span>
											</Space>
										}
									>
										<div>
											<div>Người thực hiện: {item.nguoiThucHien}</div>
											{item.ghiChu && <div>Ghi chú: {item.ghiChu}</div>}
										</div>
									</Descriptions.Item>
								))}
							</Descriptions>
						</>
					)}
				</>
			)}
		</Modal>
	);
};

export default XemChiTietModal;
