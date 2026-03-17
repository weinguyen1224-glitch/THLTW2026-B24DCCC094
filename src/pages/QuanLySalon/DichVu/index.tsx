import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Tag, Popconfirm, Modal, Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getListDichVu, createDichVu, updateDichVu, deleteDichVu } from '@/services/QuanLySalon/DichVu';

const DichVuPage = () => {
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
			const res = await getListDichVu({ page, limit: pageSize });
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
		form.setFieldsValue({ ma: `DV${next}`, trangThai: 'hoatDong' });
		setModalVisible(true);
	};

	const handleEdit = (record: any) => {
		setEditingRecord(record);
		form.setFieldsValue(record);
		setModalVisible(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteDichVu(id);
			message.success('Xóa thành công');
			loadData();
		} catch (error) {
			message.error('Xóa thất bại');
		}
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();

			if (editingRecord?._id) {
				await updateDichVu(editingRecord._id, values);
				message.success('Cập nhật thành công');
			} else {
				await createDichVu(values);
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
			title: 'Tên dịch vụ',
			dataIndex: 'ten',
			width: 200,
		},
		{
			title: 'Giá (VNĐ)',
			dataIndex: 'gia',
			width: 120,
			align: 'right' as const,
			render: (val: number) => new Intl.NumberFormat('vi-VN').format(val),
		},
		{
			title: 'Thời gian (phút)',
			dataIndex: 'thoiGianThucHien',
			width: 120,
			align: 'center' as const,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 100,
			render: (val: string) => (
				<Tag color={val === 'hoatDong' ? 'green' : 'red'}>{val === 'hoatDong' ? 'Hoạt động' : 'Không hoạt động'}</Tag>
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
						title='Bạn có chắc chắn muốn xóa dịch vụ này?'
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
				title={() => 'Quản lý dịch vụ'}
			/>
			<Modal
				title={editingRecord ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onOk={handleSubmit}
				width={600}
			>
				<Form form={form} layout='vertical'>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='ma' label='Mã dịch vụ' rules={[{ required: true }]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='ten' label='Tên dịch vụ' rules={[{ required: true }]}>
								<Input placeholder='Cắt tóc' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='gia' label='Giá (VNĐ)' rules={[{ required: true }]}>
								<InputNumber min={0} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='thoiGianThucHien' label='Thời gian (phút)' rules={[{ required: true }]}>
								<InputNumber min={5} step={5} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='moTa' label='Mô tả'>
						<Input.TextArea rows={3} placeholder='Mô tả dịch vụ...' />
					</Form.Item>
					<Form.Item name='trangThai' label='Trạng thái' initialValue='hoatDong'>
						<Select>
							<Select.Option value='hoatDong'>Hoạt động</Select.Option>
							<Select.Option value='khongHoatDong'>Không hoạt động</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default DichVuPage;
