import { Table, Button, Input, Tag, Space, Modal, Form, Popconfirm, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
import { generateId, getBMIStatus, calculateBMI } from '@/services/Fitness';
import type { Fitness } from '@/services/Fitness/typing';

const HealthLogPage: React.FC = () => {
	const { healthLogs, saveHealthLog, deleteHealthLog } = useModel('fitness');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingLog, setEditingLog] = useState<Fitness.HealthLog | null>(null);
	const [form] = Form.useForm();

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const handleEdit = (log: Fitness.HealthLog) => {
		setEditingLog(log);
		form.setFieldsValue({ ...log, date: new Date(log.date) });
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		deleteHealthLog(id);
		message.success('Xóa thành công');
	};

	const handleAdd = () => {
		setEditingLog(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleSubmit = (values: any) => {
		const bmi = calculateBMI(values.weight, values.height);
		const log: Fitness.HealthLog = {
			id: editingLog?.id || generateId(),
			date: values.date.format('YYYY-MM-DD'),
			weight: values.weight,
			height: values.height,
			bmi,
			restingHeartRate: values.restingHeartRate,
			sleepHours: values.sleepHours,
		};
		saveHealthLog(log);
		setIsModalOpen(false);
		message.success(editingLog ? 'Cập nhật thành công' : 'Thêm thành công');
	};

	const columns = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			width: 120,
			render: (date: string) => formatDate(date),
		},
		{ title: 'Cân nặng (kg)', dataIndex: 'weight', width: 130 },
		{ title: 'Chiều cao (cm)', dataIndex: 'height', width: 120 },
		{
			title: 'BMI',
			dataIndex: 'bmi',
			width: 150,
			render: (bmi: number) => {
				const status = getBMIStatus(bmi);
				return <Tag color={status.color}>{bmi.toFixed(2)} - {status.label}</Tag>;
			},
		},
		{ title: 'Nhịp tim nghỉ (bpm)', dataIndex: 'restingHeartRate', width: 140 },
		{ title: 'Giờ ngủ', dataIndex: 'sleepHours', width: 100 },
		{
			title: 'Hành động',
			width: 120,
			render: (_: any, record: Fitness.HealthLog) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm title='Xóa?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h1>Nhật ký chỉ số sức khỏe</h1>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm chỉ số
				</Button>
			</div>

			<Table columns={columns} dataSource={healthLogs} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal title={editingLog ? 'Sửa chỉ số' : 'Thêm chỉ số'} visible={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} destroyOnClose>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Ngày' name='date' rules={[{ required: true }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Cân nặng (kg)' name='weight' rules={[{ required: true }]}>
						<Input type='number' step='0.1' />
					</Form.Item>
					<Form.Item label='Chiều cao (cm)' name='height' rules={[{ required: true }]}>
						<Input type='number' />
					</Form.Item>
					<Form.Item label='Nhịp tim lúc nghỉ (bpm)' name='restingHeartRate' rules={[{ required: true }]}>
						<Input type='number' />
					</Form.Item>
					<Form.Item label='Giờ ngủ' name='sleepHours' rules={[{ required: true }]}>
						<Input type='number' step='0.5' />
					</Form.Item>
					<Form.Item style={{ textAlign: 'right' }}>
						<Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
						<Button type='primary' htmlType='submit'>Lưu</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default HealthLogPage;