import { Button, Card, Descriptions, Modal } from 'antd';
import { useModel } from 'umi';

const ViewKhoaHoc = () => {
	const { record, visibleForm, isView, handleClose } = useModel('khoahoc');

	if (!isView || !record) return null;

	return (
		<Modal
			visible={visibleForm}
			title='Chi tiết khóa học'
			onCancel={handleClose}
			footer={
				<Button type='primary' onClick={handleClose}>
					Đóng
				</Button>
			}
			width={700}
		>
			<Card>
				<Descriptions column={1} bordered>
					<Descriptions.Item label='Mã khóa học'>{record.ma}</Descriptions.Item>
					<Descriptions.Item label='Tên khóa học'>{record.ten}</Descriptions.Item>
					<Descriptions.Item label='Giảng viên'>{record.giangVien}</Descriptions.Item>
					<Descriptions.Item label='Số lượng học viên'>{record.soLuongHocVien}</Descriptions.Item>
					<Descriptions.Item label='Trạng thái'>
						<span
							style={{
								color: record.trangThai === 'Đang mở' ? 'green' : record.trangThai === 'Đã kết thúc' ? 'red' : 'orange',
							}}
						>
							{record.trangThai}
						</span>
					</Descriptions.Item>
					<Descriptions.Item label='Mô tả'>
						<div dangerouslySetInnerHTML={{ __html: record.moTa || '' }} />
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</Modal>
	);
};

export default ViewKhoaHoc;
