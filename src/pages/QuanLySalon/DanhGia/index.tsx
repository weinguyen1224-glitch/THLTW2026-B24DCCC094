import { useState, useEffect, useCallback } from 'react';
import { Table, Rate, Button, Modal, Input, message, Card } from 'antd';
import moment from 'moment';
import { getListDanhGia, phanHoiDanhGia } from '@/services/QuanLySalon/DanhGia';
import { getAll as getAllNhanVien } from '@/services/QuanLySalon/NhanVien';
import { getAll as getAllDichVu } from '@/services/QuanLySalon/DichVu';

const DanhGiaPage = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [replyModal, setReplyModal] = useState<{ visible: boolean; record: any }>({ visible: false, record: null });
	const [replyContent, setReplyContent] = useState('');
	const [dsNhanVien, setDsNhanVien] = useState<any[]>([]);
	const [dsDichVu, setDsDichVu] = useState<any[]>([]);

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const [danhGiaRes, nvRes, dvRes] = await Promise.all([
				getListDanhGia({ page, limit: pageSize }),
				getAllNhanVien({}),
				getAllDichVu({}),
			]);
			const result = danhGiaRes?.data?.data?.result || [];
			setData(result);
			setTotal(danhGiaRes?.data?.data?.total || 0);
			setDsNhanVien(nvRes?.data?.data || []);
			setDsDichVu(dvRes?.data?.data || []);
		} finally {
			setLoading(false);
		}
	}, [page, pageSize]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const getNhanVienName = (id: string) => {
		const nv = dsNhanVien.find((item) => item._id === id);
		return nv ? `${nv.ma} - ${nv.ten}` : id;
	};

	const getDichVuName = (id: string) => {
		const dv = dsDichVu.find((item) => item._id === id);
		return dv ? `${dv.ma} - ${dv.ten}` : id;
	};

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
			title: 'STT',
			width: 60,
			align: 'center' as const,
			render: (_: any, __: any, index: number) => (page - 1) * pageSize + index + 1,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'khachHang',
			width: 130,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'nhanVienId',
			width: 140,
			render: (val: string) => getNhanVienName(val),
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichVuId',
			width: 140,
			render: (val: string) => getDichVuName(val),
		},
		{
			title: 'Số sao',
			dataIndex: 'soSao',
			width: 120,
			align: 'center' as const,
			render: (val: number) => <Rate disabled value={val} style={{ fontSize: 14 }} />,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 180,
			ellipsis: true,
		},
		{
			title: 'Phản hồi',
			dataIndex: 'phanHoi',
			width: 180,
			render: (val: any, record: any) => (
				<div>
					{val?.noiDung ? (
						<div>
							<div style={{ fontSize: 12 }}>{val.noiDung}</div>
							<div style={{ fontSize: 10, color: '#888' }}>{moment(val.ngayPhanHoi).format('DD/MM/YYYY HH:mm')}</div>
						</div>
					) : (
						<Button size='small' type='link' onClick={() => handleReply(record)} style={{ padding: 0 }}>
							Phản hồi
						</Button>
					)}
				</div>
			),
		},
		{
			title: 'Ngày',
			dataIndex: 'createdAt',
			width: 100,
			render: (val: string) => moment(val).format('DD/MM/YYYY'),
		},
	];

	return (
		<Card title='Quản lý đánh giá'>
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
					pageSizeOptions: ['5', '10', '20'],
				}}
				scroll={{ x: 900 }}
				size='small'
			/>
			<Modal
				title='Phản hồi đánh giá'
				visible={replyModal.visible}
				onOk={handleSaveReply}
				onCancel={() => {
					setReplyModal({ visible: false, record: null });
					setReplyContent('');
				}}
				okText='Gửi phản hồi'
			>
				<Input.TextArea
					rows={4}
					value={replyContent}
					onChange={(e) => setReplyContent(e.target.value)}
					placeholder='Nhập nội dung phản hồi...'
				/>
			</Modal>
		</Card>
	);
};

export default DanhGiaPage;
