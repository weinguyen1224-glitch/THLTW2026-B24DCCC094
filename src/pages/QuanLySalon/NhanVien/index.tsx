import { useState, useEffect, useCallback } from 'react';
import {
	Table,
	Button,
	Tag,
	Popconfirm,
	Modal,
	Form,
	Input,
	InputNumber,
	Select,
	TimePicker,
	Row,
	Col,
	message,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getListNhanVien, createNhanVien, updateNhanVien, deleteNhanVien } from '@/services/QuanLySalon/NhanVien';

const NhanVienPage = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingRecord, setEditingRecord] = useState<any>(null);
	const [form] = Form.useForm();

	const loadData = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getListNhanVien({ page, limit: pageSize });
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

	const handleAdd = () => {
		setEditingRecord(null);
		form.resetFields();
		const next = Math.floor(Math.random() * 9999);
		form.setFieldsValue({
			ma: `NV${next}`,
			trangThai: 'hoatDong',
			soKhachGioiHan: 10,
			lichLamViec: [{ thu: 2, gioBatDau: dayjs('09:00', 'HH:mm'), gioKetThuc: dayjs('17:00', 'HH:mm') }],
		});
		setModalVisible(true);
	};

	const handleEdit = (record: any) => {
		setEditingRecord(record);
		const lichLamViec =
			record.lichLamViec?.map((item: any) => ({
				...item,
				gioBatDau: item.gioBatDau ? dayjs(item.gioBatDau, 'HH:mm') : null,
				gioKetThuc: item.gioKetThuc ? dayjs(item.gioKetThuc, 'HH:mm') : null,
			})) || [];
		form.setFieldsValue({ ...record, lichLamViec });
		setModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteNhanVien(id);
			message.success('Xóa thành công');
			loadData();
		} catch (error) {
			message.error('Xóa thất bại');
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const payload = {
				...values,
				lichLamViec:
					values.lichLamViec?.map((item: any) => ({
						thu: item.thu,
						gioBatDau: item.gioBatDau?.format('HH:mm'),
						gioKetThuc: item.gioKetThuc?.format('HH:mm'),
					})) || [],
			};

			if (editingRecord?._id) {
				await updateNhanVien(editingRecord._id, payload);
				message.success('Cập nhật thành công');
			} else {
				await createNhanVien(payload);
				message.success('Thêm mới thành công');
			}

			setModalVisible(false);
			loadData();
		} catch (error) {
			console.error(error);
		}
	};

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
		},
		{
			title: 'Tên nhân viên',
			dataIndex: 'ten',
			width: 180,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'sdt',
			width: 120,
		},
		{
			title: 'Số khách/ngày',
			dataIndex: 'soKhachGioiHan',
			width: 100,
			align: 'center' as const,
			render: (val: number, record: any) => `${record.soKhachDaPhucVu || 0}/${val}`,
		},
		{
			title: 'Lịch làm việc',
			dataIndex: 'lichLamViec',
			width: 200,
			render: (val: any) => (
				<>
					{val?.map((item: any, idx: number) => (
						<Tag key={idx} color='blue'>
							{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][item.thu]} {item.gioBatDau}-{item.gioKetThuc}
						</Tag>
					))}
				</>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			render: (val: string) => (
				<Tag color={val === 'hoatDong' ? 'green' : 'red'}>{val === 'hoatDong' ? 'Hoạt động' : 'Nghỉ việc'}</Tag>
			),
		},
		{
			title: 'Thao tác',
			align: 'center' as const,
			width: 90,
			fixed: 'right' as const,
			render: (_: any, record: any) => (
				<>
					<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => handleDelete(record._id)}
						title='Bạn có chắc chắn muốn xóa nhân viên này?'
						placement='topLeft'
					>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
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
				scroll={{ x: 800 }}
				title={() => 'Quản lý nhân viên'}
			/>
			<Modal
				title={editingRecord ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={handleSubmit}
				width={700}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='ma' label='Mã nhân viên' rules={[{ required: true }]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='ten' label='Tên nhân viên' rules={[{ required: true }]}>
								<Input placeholder='Nguyễn Văn A' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='sdt' label='Số điện thoại' rules={[{ required: true }]}>
								<Input placeholder='0912345678' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='email' label='Email'>
								<Input placeholder='nhanvien@example.com' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='diaChi' label='Địa chỉ'>
								<Input placeholder='123 Đường ABC' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='chucVu' label='Chức vụ'>
								<Input placeholder='Nhân viên' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='soKhachGioiHan' label='Số khách giới hạn/ngày' rules={[{ required: true }]}>
								<InputNumber min={1} max={50} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='trangThai' label='Trạng thái' initialValue='hoatDong'>
								<Select>
									<Select.Option value='hoatDong'>Hoạt động</Select.Option>
									<Select.Option value='nghiViec'>Nghỉ việc</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='lichLamViec' label='Lịch làm việc'>
						<LichLamViecForm form={form} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

const LichLamViecForm = ({ form }: { form: any }) => {
	const [dsLich, setDsLich] = useState<any[]>([]);

	useEffect(() => {
		const lich = form.getFieldValue('lichLamViec');
		if (lich) {
			setDsLich(lich);
		}
	}, []);

	const themLich = () => {
		const newLich = [...dsLich, { thu: 2, gioBatDau: dayjs('09:00', 'HH:mm'), gioKetThuc: dayjs('17:00', 'HH:mm') }];
		setDsLich(newLich);
		form.setFieldValue('lichLamViec', newLich);
	};

	const xoaLich = (index: number) => {
		const newLich = dsLich.filter((_, i) => i !== index);
		setDsLich(newLich);
		form.setFieldValue('lichLamViec', newLich);
	};

	const thuOptions = [
		{ value: 1, label: 'Thứ 2' },
		{ value: 2, label: 'Thứ 3' },
		{ value: 3, label: 'Thứ 4' },
		{ value: 4, label: 'Thứ 5' },
		{ value: 5, label: 'Thứ 6' },
		{ value: 6, label: 'Thứ 7' },
		{ value: 0, label: 'Chủ nhật' },
	];

	return (
		<div>
			<Button type='dashed' onClick={themLich} style={{ marginBottom: 8 }}>
				+ Thêm lịch làm việc
			</Button>
			{dsLich.map((lich, index) => (
				<Row key={index} gutter={8} style={{ marginBottom: 8 }}>
					<Col>
						<Form.Item name={['lichLamViec', index, 'thu']} initialValue={lich.thu}>
							<Select style={{ width: 100 }} options={thuOptions} />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name={['lichLamViec', index, 'gioBatDau']} initialValue={lich.gioBatDau}>
							<TimePicker format='HH:mm' placeholder='Bắt đầu' />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name={['lichLamViec', index, 'gioKetThuc']} initialValue={lich.gioKetThuc}>
							<TimePicker format='HH:mm' placeholder='Kết thúc' />
						</Form.Item>
					</Col>
					<Col>
						<Button danger onClick={() => xoaLich(index)}>
							Xóa
						</Button>
					</Col>
				</Row>
			))}
		</div>
	);
};

export default NhanVienPage;
