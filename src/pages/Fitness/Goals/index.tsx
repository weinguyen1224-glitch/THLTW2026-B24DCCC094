import { Card, Button, Progress, Tag, Space, Popconfirm, message, Drawer, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
import { generateId } from '@/services/Fitness';
import type { Fitness } from '@/services/Fitness/typing';

const { Option } = Select;

const GoalsPage: React.FC = () => {
	const { goals, saveGoal, deleteGoal } = useModel('fitness');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [editingGoal, setEditingGoal] = useState<Fitness.Goal | null>(null);
	const [form] = Form.useForm();

	const filteredGoals = goals.filter((g) => {
		if (statusFilter === 'all') return true;
		return g.status === statusFilter;
	});

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const getStatusColor = (status: string) => {
		return status === 'achieved' ? 'green' : status === 'cancelled' ? 'red' : 'blue';
	};

	const getTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			weight_loss: 'Giảm cân',
			muscle_gain: 'Tăng cơ',
			endurance: 'Cải thiện sức bền',
			other: 'Khác',
		};
		return labels[type] || type;
	};

	const handleEdit = (goal: Fitness.Goal) => {
		setEditingGoal(goal);
		form.setFieldsValue({ ...goal, deadline: new Date(goal.deadline) });
		setIsDrawerOpen(true);
	};

	const handleDelete = (id: string) => {
		deleteGoal(id);
		message.success('Xóa thành công');
	};

	const handleAdd = () => {
		setEditingGoal(null);
		form.resetFields();
		setIsDrawerOpen(true);
	};

	const handleSubmit = (values: any) => {
		const goal: Fitness.Goal = {
			id: editingGoal?.id || generateId(),
			name: values.name,
			type: values.type,
			targetValue: values.targetValue,
			currentValue: values.currentValue || 0,
			deadline: values.deadline.format('YYYY-MM-DD'),
			status: values.status,
		};
		saveGoal(goal);
		setIsDrawerOpen(false);
		message.success(editingGoal ? 'Cập nhật thành công' : 'Thêm thành công');
	};

	const handleUpdateCurrent = (goal: Fitness.Goal, value: number) => {
		const updatedGoal = { ...goal, currentValue: value };
		saveGoal(updatedGoal);
	};

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h1>Quản lý mục tiêu</h1>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm mục tiêu
				</Button>
			</div>

			<div style={{ marginBottom: 16 }}>
				<Space>
					<Button type={statusFilter === 'all' ? 'primary' : 'default'} onClick={() => setStatusFilter('all')}>Tất cả</Button>
					<Button type={statusFilter === 'in_progress' ? 'primary' : 'default'} onClick={() => setStatusFilter('in_progress')}>Đang thực hiện</Button>
					<Button type={statusFilter === 'achieved' ? 'primary' : 'default'} onClick={() => setStatusFilter('achieved')}>Đã đạt</Button>
					<Button type={statusFilter === 'cancelled' ? 'primary' : 'default'} onClick={() => setStatusFilter('cancelled')}>Đã hủy</Button>
				</Space>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
				{filteredGoals.map((goal) => {
					const percent = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
					return (
						<Card key={goal.id} actions={[
							<EditOutlined key='edit' onClick={() => handleEdit(goal)} />,
							<Popconfirm key='delete' title='Xóa mục tiêu?' onConfirm={() => handleDelete(goal.id)}>
								<DeleteOutlined />
							</Popconfirm>,
						]}>
							<h3>{goal.name}</h3>
							<Tag color={getStatusColor(goal.status)}>
								{goal.status === 'in_progress' ? 'Đang thực hiện' : goal.status === 'achieved' ? 'Đã đạt' : 'Đã hủy'}
							</Tag>
							<Tag color='purple'>{getTypeLabel(goal.type)}</Tag>
							<div style={{ marginTop: 12 }}>
								<div>Deadline: {formatDate(goal.deadline)}</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
									<InputNumber
										size='small'
										value={goal.currentValue}
										onChange={(val) => handleUpdateCurrent(goal, val || 0)}
										style={{ width: 80 }}
									/>
									<span>/ {goal.targetValue}</span>
								</div>
								<Progress percent={percent} status={goal.status === 'achieved' ? 'success' : 'active'} style={{ marginTop: 8 }} />
							</div>
						</Card>
					);
				})}
			</div>

			<Drawer title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'} visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width={400}>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Tên mục tiêu' name='name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Loại' name='type' rules={[{ required: true }]}>
						<Select>
							<Option value='weight_loss'>Giảm cân</Option>
							<Option value='muscle_gain'>Tăng cơ</Option>
							<Option value='endurance'>Cải thiện sức bền</Option>
							<Option value='other'>Khác</Option>
						</Select>
					</Form.Item>
					<Form.Item label='Giá trị mục tiêu' name='targetValue' rules={[{ required: true }]}>
						<InputNumber style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Giá trị hiện tại' name='currentValue' initialValue={0}>
						<InputNumber style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Deadline' name='deadline' rules={[{ required: true }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Trạng thái' name='status' initialValue='in_progress'>
						<Select>
							<Option value='in_progress'>Đang thực hiện</Option>
							<Option value='achieved'>Đã đạt</Option>
							<Option value='cancelled'>Đã hủy</Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' block>Lưu</Button>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default GoalsPage;