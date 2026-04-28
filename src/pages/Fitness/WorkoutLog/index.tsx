import { Table, Button, Input, Select, Tag, Space, Modal, Form, Popconfirm, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
import { generateId } from '@/services/Fitness';
import type { Fitness } from '@/services/Fitness/typing';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WorkoutLogPage: React.FC = () => {
	const { workouts, saveWorkout, deleteWorkout } = useModel('fitness');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('');
	const [dateRange, setDateRange] = useState<[string, string] | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingWorkout, setEditingWorkout] = useState<Fitness.WorkoutLog | null>(null);
	const [form] = Form.useForm();

	const filteredWorkouts = workouts.filter((w) => {
		if (searchKeyword && !w.type.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
		if (typeFilter && w.type !== typeFilter) return false;
		if (dateRange) {
			const date = new Date(w.date);
			const start = new Date(dateRange[0]);
			const end = new Date(dateRange[1]);
			if (date < start || date > end) return false;
		}
		return true;
	});

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const handleEdit = (workout: Fitness.WorkoutLog) => {
		setEditingWorkout(workout);
		form.setFieldsValue({ ...workout, date: new Date(workout.date) });
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		deleteWorkout(id);
		message.success('Xóa thành công');
	};

	const handleAdd = () => {
		setEditingWorkout(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleSubmit = (values: any) => {
		const workout: Fitness.WorkoutLog = {
			id: editingWorkout?.id || generateId(),
			date: values.date.format('YYYY-MM-DD'),
			type: values.type,
			duration: values.duration,
			calories: values.calories,
			notes: values.notes || '',
			status: values.status,
		};
		saveWorkout(workout);
		setIsModalOpen(false);
		message.success(editingWorkout ? 'Cập nhật thành công' : 'Thêm thành công');
	};

	const columns = [
		{
			title: 'Ngày',
			dataIndex: 'date',
			width: 120,
			render: (date: string) => formatDate(date),
		},
		{
			title: 'Loại bài tập',
			dataIndex: 'type',
			width: 120,
			render: (type: string) => <Tag color={type === 'Cardio' ? 'red' : type === 'Strength' ? 'blue' : type === 'Yoga' ? 'green' : 'orange'}>{type}</Tag>,
		},
		{ title: 'Thời lượng (phút)', dataIndex: 'duration', width: 140 },
		{ title: 'Calo đốt', dataIndex: 'calories', width: 100 },
		{ title: 'Ghi chú', dataIndex: 'notes', ellipsis: true },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			render: (status: string) => (
				<Tag color={status === 'completed' ? 'green' : 'red'}>{status === 'completed' ? 'Hoàn thành' : 'Bỏ lỡ'}</Tag>
			),
		},
		{
			title: 'Hành động',
			width: 120,
			render: (_: any, record: Fitness.WorkoutLog) => (
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
				<h1>Nhật ký tập luyện</h1>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm buổi tập
				</Button>
			</div>

			<div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
				<Input prefix={<SearchOutlined />} placeholder='Tìm kiếm...' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} style={{ width: 200 }} />
				<Select placeholder='Loại bài tập' allowClear style={{ width: 150 }} onChange={(val) => setTypeFilter(val || '')}>
					<Option value='Cardio'>Cardio</Option>
					<Option value='Strength'>Strength</Option>
					<Option value='Yoga'>Yoga</Option>
					<Option value='HIIT'>HIIT</Option>
					<Option value='Other'>Other</Option>
				</Select>
				<RangePicker onChange={(dates) => setDateRange(dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : null)} />
			</div>

			<Table columns={columns} dataSource={filteredWorkouts} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal title={editingWorkout ? 'Sửa buổi tập' : 'Thêm buổi tập'} visible={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} destroyOnClose>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Ngày tập' name='date' rules={[{ required: true }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Loại bài tập' name='type' rules={[{ required: true }]}>
						<Select>
							<Option value='Cardio'>Cardio</Option>
							<Option value='Strength'>Strength</Option>
							<Option value='Yoga'>Yoga</Option>
							<Option value='HIIT'>HIIT</Option>
							<Option value='Other'>Other</Option>
						</Select>
					</Form.Item>
					<Form.Item label='Thời lượng (phút)' name='duration' rules={[{ required: true }]}>
						<Input type='number' />
					</Form.Item>
					<Form.Item label='Calo' name='calories' rules={[{ required: true }]}>
						<Input type='number' />
					</Form.Item>
					<Form.Item label='Ghi chú' name='notes'>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item label='Trạng thái' name='status' initialValue='completed'>
						<Select>
							<Option value='completed'>Hoàn thành</Option>
							<Option value='missed'>Bỏ lỡ</Option>
						</Select>
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

export default WorkoutLogPage;