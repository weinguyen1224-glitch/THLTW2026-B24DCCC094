import { useState, useEffect, useCallback } from 'react';
import { Table, Rate, Button, Modal, Input, message } from 'antd';
import moment from 'moment';
import { getListDanhGia, phanHoiDanhGia } from '@/services/QuanLySalon/DanhGia';

const DanhGiaPage = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [replyModal, setReplyModal] = useState<{ visible: boolean; record: any }>({ visible: false, record: null });
	const [replyContent, setReplyContent] = useState('');

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getListDanhGia({ page, limit: pageSize });
			const result = res?.data?.data?.result || [];
			setData(result);
			setTotal(res?.data?.data?.total || 0);
		} finally {
			setLoading(false);
		}
	}, [page, pageSize]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleReply = (record: any) => {
		setReplyModal({ visible: true, record });
		setReplyContent(record.phanHoi?.noiDung || '');
	};

	const handleSaveReply = async () => {
		try {
			await phanHoiDanhGia(replyModal.record._id, replyContent);
			message.success('Phản hồi thành công');
			setReplyModal({ visible: false, record: null });
			setReplyContent('');
			loadData();
		} catch (error) {
			message.error('Phản hồi thất bại');
		}
	};

	const columns = [
		{
			title: 'Khách hàng',
			dataIndex: 'khachHang',
			width: 150,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'nhanVienId',
			width: 150,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichVuId',
			width: 150,
		},
		{
			title: 'Số sao',
			dataIndex: 'soSao',
			width: 150,
			render: (val: number) => <Rate disabled value={val} />,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 250,
			ellipsis: true,
		},
		{
			title: 'Phản hồi',
			dataIndex: 'phanHoi',
			width: 250,
			render: (val: any, record: any) => (
				<div>
					{val?.noiDung ? (
						<div>
							<div>{val.noiDung}</div>
							<div style={{ fontSize: 11, color: '#888' }}>{moment(val.ngayPhanHoi).format('DD/MM/YYYY HH:mm')}</div>
						</div>
					) : (
						<Button size='small' type='link' onClick={() => handleReply(record)}>
							Phản hồi
						</Button>
					)}
				</div>
			),
		},
		{
			title: 'Ngày đánh giá',
			dataIndex: 'createdAt',
			width: 120,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
	];

	return (
		<>
			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				rowKey='_id'
				pagination={{
					current: page,
					pageSize: pageSize,
					total: total,
					onChange: (p, ps) => {
						setPage(p);
						setPageSize(ps);
					},
					showSizeChanger: true,
					showTotal: (t) => `Tổng ${t} bản ghi`,
				}}
				scroll={{ x: 1000 }}
				title={() => 'Quản lý đánh giá'}
			/>
			<Modal
				title='Phản hồi đánh giá'
				visible={replyModal.visible}
				onOk={handleSaveReply}
				onCancel={() => {
					setReplyModal({ visible: false, record: null });
					setReplyContent('');
				}}
			>
				<Input.TextArea
					rows={4}
					value={replyContent}
					onChange={(e) => setReplyContent(e.target.value)}
					placeholder='Nhập nội dung phản hồi...'
				/>
			</Modal>
		</>
	);
};

export default DanhGiaPage;
