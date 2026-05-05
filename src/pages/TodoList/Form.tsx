import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { Task } from '@/models/todolist';

const { Option } = Select;
const { TextArea } = Input;

const FormTodoList = () => {
	const { todoItem, isEdit, setVisible, addTask, updateTask } = useModel('todolist');

	return (
		<Form
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
			onFinish={(values) => {
				const payload: Omit<Task, 'id' | 'createdAt'> = {
					...values,
					deadline: values.deadline.toISOString(),
				};

				if (isEdit && todoItem) {
					updateTask(todoItem.id, payload);
				} else {
					addTask(payload);
				}
				setVisible(false);
			}}
			initialValues={{
				name: todoItem?.name,
				description: todoItem?.description,
				deadline: todoItem?.deadline ? moment(todoItem.deadline) : undefined,
				priority: todoItem?.priority || 'trung-binh',
				tag: todoItem?.tag,
				status: todoItem?.status || 'todo',
			}}
		>
			<Form.Item label='Tên Task' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}>
				<Input placeholder='Nhập tên task' />
			</Form.Item>

			<Form.Item label='Mô tả' name='description' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
				<TextArea rows={4} placeholder='Nhập mô tả chi tiết' />
			</Form.Item>

			<Form.Item label='Deadline' name='deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}>
				<DatePicker
					showTime
					format='DD/MM/YYYY HH:mm'
					style={{ width: '100%' }}
					placeholder='Chọn thời gian hoàn thành'
				/>
			</Form.Item>

			<Form.Item
				label='Mức độ ưu tiên'
				name='priority'
				rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
			>
				<Select>
					<Option value='cao'>Cao</Option>
					<Option value='trung-binh'>Trung bình</Option>
					<Option value='thap'>Thấp</Option>
				</Select>
			</Form.Item>

			<Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
				<Select>
					<Option value='todo'>Cần làm</Option>
					<Option value='in-progress'>Đang làm</Option>
					<Option value='completed'>Hoàn thành</Option>
				</Select>
			</Form.Item>

			<Form.Item label='Tag' name='tag' rules={[{ required: true, message: 'Vui lòng nhập tag!' }]}>
				<Input placeholder='Nhập tag (VD: Frontend, Backend...)' />
			</Form.Item>

			<Form.Item wrapperCol={{ offset: 6, span: 18 }}>
				<Space>
					<Button type='primary' htmlType='submit'>
						{isEdit ? 'Cập nhật' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default FormTodoList;
