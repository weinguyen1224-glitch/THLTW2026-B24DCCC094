import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Tag, Popconfirm, Modal, Form, Input, Select, Row, Col, message, DatePicker, Rate } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	CheckOutlined,
	CloseOutlined,
	StarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
	getListLichHen,
	createLichHen,
	updateLichHen,
	updateTrangThaiLichHen,
	deleteLichHen,
} from '@/services/QuanLySalon/LichHen';
import { getAll as getAllNhanVien } from '@/services/QuanLySalon/NhanVien';
import { getAll as getAllDichVu } from '@/services/QuanLySalon/DichVu';
import { create as createDanhGia } from '@/services/QuanLySalon/DanhGia';

const STORAGE_KEY_NHAN_VIEN = 'salon_nhanvien';
const STORAGE_KEY_DICH_VU = 'salon_dichvu';

const getStoredData = (key: string) => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

const trangThaiColors: Record<string, string> = {
	choDuyet: 'orange',
	xacNhan: 'blue',
	hoanThanh: 'green',
	huy: 'red',
};

const trangThaiLabels: Record<string, string> = {
	choDuyet: 'Chờ duyệt',
	xacNhan: 'Xác nhận',
	hoanThanh: 'Hoàn thành',
	huy: 'Hủy',
};

const LichHenPage = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<any>(null);
	const [form] = Form.useForm();
	const [dsNhanVien, setDsNhanVien] = useState<any[]>([]);
	const [dsDichVu, setDsDichVu] = useState<any[]>([]);
	const [ratingModalVisible, setRatingModalVisible] = useState(false);
	const [ratingRecord, setRatingRecord] = useState<any>(null);
	const [ratingForm] = Form.useForm();

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getListLichHen({ page, limit: pageSize });
			const result = res?.data?.data?.result || [];
			setData(result);
			setTotal(res?.data?.data?.total || 0);
		} finally {
			setLoading(false);
		}
	}, [page, pageSize]);

	const loadOptions = useCallback(async () => {
		const [nvRes, dvRes] = await Promise.all([
			getAllNhanVien({ condition: { trangThai: 'hoatDong' } }),
			getAllDichVu({ condition: { trangThai: 'hoatDong' } }),
		]);
		setDsNhanVien(nvRes?.data?.data || []);
		setDsDichVu(dvRes?.data?.data || []);
	}, []);

	useEffect(() => {
		loadData();
		loadOptions();
	}, [loadData, loadOptions]);

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		form.setFieldsValue({ trangThai: 'choDuyet' });
		setModalVisible(true);
	};

	const handleEdit = (record: any) => {
		setEditingRecord(record);
		form.setFieldsValue({
			...record,
			ngayHen: record.ngayHen ? moment(record.ngayHen) : null,
		});
		setModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteLichHen(id);
			message.success('Xóa thành công');
			loadData();
		} catch (error) {
			message.error('Xóa thất bại');
		}
	};

	const handleUpdateStatus = async (id: string, trangThai: string) => {
		try {
			await updateTrangThaiLichHen(id, trangThai);
			message.success('Cập nhật trạng thái thành công');
			loadData();
		} catch (error) {
			message.error('Cập nhật thất bại');
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const payload = {
				...values,
				ngayHen: values.ngayHen.format('YYYY-MM-DD'),
			};

			if (editingRecord?._id) {
				await updateLichHen(editingRecord._id, payload);
				message.success('Cập nhật thành công');
			} else {
				await createLichHen(payload);
				message.success('Thêm mới thành công');
			}

			setModalVisible(false);
			loadData();
		} catch (error: any) {
			if (error?.errorFields) {
				return;
			}
			message.error(error?.message || 'Thêm mới thất bại');
		}
	};

	const handleOpenRating = (record: any) => {
		setRatingRecord(record);
		ratingForm.resetFields();
		setRatingModalVisible(true);
	};

	const handleSubmitRating = async () => {
		try {
			const values = await ratingForm.validateFields();
			await createDanhGia({
				lichHenId: ratingRecord._id,
				nhanVienId: ratingRecord.nhanVienId,
				dichVuId: ratingRecord.dichVuId,
				khachHang: ratingRecord.khachHang?.ten,
				soSao: values.soSao,
				noiDung: values.noiDung,
			});
			message.success('Đánh giá thành công!');
			setRatingModalVisible(false);
			loadData();
		} catch (error) {
			message.error('Đánh giá thất bại');
		}
	};

	const getNhanVienName = (id: string) => {
		const nhanVien = getStoredData(STORAGE_KEY_NHAN_VIEN).find((nv: any) => nv._id === id);
		return nhanVien?.ten || id;
	};

	const getDichVuName = (id: string) => {
		const dichVu = getStoredData(STORAGE_KEY_DICH_VU).find((dv: any) => dv._id === id);
		return dichVu?.ten || id;
	};

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 100,
		},
		{
			title: 'Khách hàng',
			dataIndex: 'khachHang',
			width: 150,
			render: (val: any) => (
				<div>
					<div>{val?.ten}</div>
					<div style={{ fontSize: 12, color: '#888' }}>{val?.sdt}</div>
				</div>
			),
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'dichVuId',
			width: 150,
			render: (val: string) => getDichVuName(val),
		},
		{
			title: 'Nhân viên',
			dataIndex: 'nhanVienId',
			width: 150,
			render: (val: string) => getNhanVienName(val),
		},
		{
			title: 'Ngày - Giờ',
			dataIndex: 'ngayHen',
			width: 150,
			render: (val: string, record: any) => (
				<div>
					<div>{moment(val).format('DD/MM/YYYY')}</div>
					<div style={{ fontSize: 12, color: '#888' }}>{record?.gioHen}</div>
				</div>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 110,
			render: (val: string) => <Tag color={trangThaiColors[val]}>{trangThaiLabels[val]}</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center' as const,
			width: 160,
			fixed: 'right' as const,
			render: (_: any, record: any) => (
				<>
					{record.trangThai === 'choDuyet' && (
						<Button
							type='link'
							icon={<CheckOutlined />}
							onClick={() => handleUpdateStatus(record._id, 'xacNhan')}
							style={{ color: 'green' }}
						/>
					)}
					{record.trangThai === 'xacNhan' && (
						<Button
							type='link'
							icon={<CheckOutlined />}
							onClick={() => handleUpdateStatus(record._id, 'hoanThanh')}
							style={{ color: 'blue' }}
						/>
					)}
					{(record.trangThai === 'choDuyet' || record.trangThai === 'xacNhan') && (
						<Popconfirm
							onConfirm={() => handleUpdateStatus(record._id, 'huy')}
							title='Bạn có chắc chắn muốn hủy lịch hẹn này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<CloseOutlined />} />
						</Popconfirm>
					)}
					<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					{record.trangThai === 'hoanThanh' && (
						<Button
							onClick={() => handleOpenRating(record)}
							type='link'
							icon={<StarOutlined />}
							style={{ color: 'gold' }}
						/>
					)}
					{record.trangThai !== 'hoanThanh' && record.trangThai !== 'huy' && (
						<Popconfirm
							onConfirm={() => handleDelete(record._id)}
							title='Bạn có chắc chắn muốn xóa lịch hẹn này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					)}
				</>
			),
		},
	];

	return (
		<>
			<div style={{ marginBottom: 16 }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm mới
				</Button>
			</div>
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
				title={() => 'Quản lý lịch hẹn'}
			/>
			<Modal
				title={editingRecord ? 'Cập nhật lịch hẹn' : 'Thêm lịch hẹn'}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={handleSubmit}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name={['khachHang', 'ten']}
								label='Tên khách hàng'
								rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
							>
								<Input placeholder='Nguyễn Văn Khách' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name={['khachHang', 'sdt']}
								label='Số điện thoại'
								rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
							>
								<Input placeholder='0912345678' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='dichVuId' label='Dịch vụ' rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}>
								<Select placeholder='Chọn dịch vụ'>
									{dsDichVu.map((dv: any) => (
										<Select.Option key={dv._id} value={dv._id}>
											{dv.ten} - {new Intl.NumberFormat('vi-VN').format(dv.gia)}đ ({dv.thoiGianThucHien}p)
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='nhanVienId'
								label='Nhân viên phục vụ'
								rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
							>
								<Select placeholder='Chọn nhân viên'>
									{dsNhanVien.map((nv: any) => (
										<Select.Option key={nv._id} value={nv._id}>
											{nv.ten}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='ngayHen' label='Ngày hẹn' rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='gioHen' label='Giờ hẹn' rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
								<Select placeholder='Chọn giờ'>
									{Array.from({ length: 16 }, (_, i) => i + 8).map((hour) => (
										<Select.Option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
											{`${hour.toString().padStart(2, '0')}:00`}
										</Select.Option>
									))}
									{Array.from({ length: 16 }, (_, i) => i + 8).map((hour) => (
										<Select.Option key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
											{`${hour.toString().padStart(2, '0')}:30`}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input.TextArea rows={2} placeholder='Ghi chú thêm...' />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Đánh giá dịch vụ'
				visible={ratingModalVisible}
				onCancel={() => setRatingModalVisible(false)}
				onOk={handleSubmitRating}
				okText='Gửi đánh giá'
			>
				<Form form={ratingForm} layout='vertical'>
					<Form.Item name='soSao' label='Số sao' rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
						<Rate />
					</Form.Item>
					<Form.Item name='noiDung' label='Nội dung đánh giá'>
						<Input.TextArea rows={3} placeholder='Chia sẻ trải nghiệm của bạn...' />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default LichHenPage;
