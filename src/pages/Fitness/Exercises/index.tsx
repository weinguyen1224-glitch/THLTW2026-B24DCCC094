import { Card, Button, Input, Select, Tag, Space, Modal, Form, Popconfirm, message, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
import { generateId } from '@/services/Fitness';
import type { Fitness } from '@/services/Fitness/typing';

const { Option } = Select;

const ExercisesPage: React.FC = () => {
	const { exercises, saveExercise, deleteExercise } = useModel('fitness');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [muscleFilter, setMuscleFilter] = useState<string>('');
	const [difficultyFilter, setDifficultyFilter] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [detailModal, setDetailModal] = useState<Fitness.Exercise | null>(null);
	const [editingExercise, setEditingExercise] = useState<Fitness.Exercise | null>(null);
	const [form] = Form.useForm();

	const filteredExercises = exercises.filter((e) => {
		if (searchKeyword && !e.name.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
		if (muscleFilter && e.muscleGroup !== muscleFilter) return false;
		if (difficultyFilter && e.difficulty !== difficultyFilter) return false;
		return true;
	});

	const getDifficultyColor = (diff: string) => {
		return diff === 'easy' ? 'green' : diff === 'medium' ? 'orange' : 'red';
	};

	const getDifficultyLabel = (diff: string) => {
		return diff === 'easy' ? 'Dễ' : diff === 'medium' ? 'Trung bình' : 'Khó';
	};

	const handleEdit = (exercise: Fitness.Exercise) => {
		setEditingExercise(exercise);
		form.setFieldsValue(exercise);
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		deleteExercise(id);
		message.success('Xóa thành công');
	};

	const handleAdd = () => {
		setEditingExercise(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleSubmit = (values: any) => {
		const exercise: Fitness.Exercise = {
			id: editingExercise?.id || generateId(),
			name: values.name,
			muscleGroup: values.muscleGroup,
			difficulty: values.difficulty,
			description: values.description,
			caloriesPerHour: values.caloriesPerHour,
			instructions: values.instructions,
		};
		saveExercise(exercise);
		setIsModalOpen(false);
		message.success(editingExercise ? 'Cập nhật thành công' : 'Thêm thành công');
	};

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h1>Thư viện bài tập</h1>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm bài tập
				</Button>
			</div>

			<div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
				<Input prefix={<SearchOutlined />} placeholder='Tìm kiếm...' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} style={{ width: 200 }} />
				<Select placeholder='Nhóm cơ' allowClear style={{ width: 150 }} onChange={(val) => setMuscleFilter(val || '')}>
					<Option value='Chest'>Chest</Option>
					<Option value='Back'>Back</Option>
					<Option value='Legs'>Legs</Option>
					<Option value='Shoulders'>Shoulders</Option>
					<Option value='Arms'>Arms</Option>
					<Option value='Core'>Core</Option>
					<Option value='Full Body'>Full Body</Option>
				</Select>
				<Select placeholder='Mức độ khó' allowClear style={{ width: 150 }} onChange={(val) => setDifficultyFilter(val || '')}>
					<Option value='easy'>Dễ</Option>
					<Option value='medium'>Trung bình</Option>
					<Option value='hard'>Khó</Option>
				</Select>
			</div>

			<Row gutter={[16, 16]}>
				{filteredExercises.map((exercise) => (
					<Col key={exercise.id} xs={24} sm={12} md={8}>
						<Card
							hoverable
							onClick={() => setDetailModal(exercise)}
							actions={[
								<EditOutlined key='edit' onClick={(e) => { e.stopPropagation(); handleEdit(exercise); }} />,
								<Popconfirm key='delete' title='Xóa bài tập?' onConfirm={(e) => { e?.stopPropagation(); handleDelete(exercise.id); }}>
									<DeleteOutlined />
								</Popconfirm>,
							]}
						>
							<Card.Meta
								title={exercise.name}
								description={
									<>
										<div style={{ marginBottom: 8 }}>
											<Tag color='blue'>{exercise.muscleGroup}</Tag>
											<Tag color={getDifficultyColor(exercise.difficulty)}>{getDifficultyLabel(exercise.difficulty)}</Tag>
										</div>
										<div style={{ color: '#666', marginBottom: 8 }}>{exercise.description}</div>
										<div><strong>Calo/giờ:</strong> {exercise.caloriesPerHour} kcal</div>
									</>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Modal title={editingExercise ? 'Sửa bài tập' : 'Thêm bài tập'} visible={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} destroyOnClose width={600}>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Tên bài tập' name='name' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Nhóm cơ' name='muscleGroup' rules={[{ required: true }]}>
						<Select>
							<Option value='Chest'>Chest</Option>
							<Option value='Back'>Back</Option>
							<Option value='Legs'>Legs</Option>
							<Option value='Shoulders'>Shoulders</Option>
							<Option value='Arms'>Arms</Option>
							<Option value='Core'>Core</Option>
							<Option value='Full Body'>Full Body</Option>
						</Select>
					</Form.Item>
					<Form.Item label='Mức độ khó' name='difficulty' rules={[{ required: true }]}>
						<Select>
							<Option value='easy'>Dễ</Option>
							<Option value='medium'>Trung bình</Option>
							<Option value='hard'>Khó</Option>
						</Select>
					</Form.Item>
					<Form.Item label='Mô tả ngắn' name='description' rules={[{ required: true }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item label='Calo đốt/giờ' name='caloriesPerHour' rules={[{ required: true }]}>
						<Input type='number' />
					</Form.Item>
					<Form.Item label='Hướng dẫn thực hiện' name='instructions' rules={[{ required: true }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item style={{ textAlign: 'right' }}>
						<Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
						<Button type='primary' htmlType='submit'>Lưu</Button>
					</Form.Item>
				</Form>
			</Modal>

			<Modal title={detailModal?.name} open={!!detailModal} onCancel={() => setDetailModal(null)} footer={null}>
				{detailModal && (
					<div>
						<div style={{ marginBottom: 16 }}>
							<Tag color='blue' style={{ marginRight: 8 }}>{detailModal.muscleGroup}</Tag>
							<Tag color={getDifficultyColor(detailModal.difficulty)}>{getDifficultyLabel(detailModal.difficulty)}</Tag>
							<Tag color='orange'>{detailModal.caloriesPerHour} kcal/giờ</Tag>
						</div>
						<h4>Mô tả</h4>
						<p>{detailModal.description}</p>
						<h4>Hướng dẫn thực hiện</h4>
						<div style={{ whiteSpace: 'pre-line' }}>{detailModal.instructions}</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ExercisesPage;