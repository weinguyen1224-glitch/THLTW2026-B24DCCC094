import { Button, Card, Col, Input, Modal, Row, Select, Space, Table, Tag } from 'antd';
import { useModel } from 'umi';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import FormTodoList from './Form';
import { useEffect } from 'react';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;

const TodoList: React.FC = () => {
	const {
		filteredTasks,
		isEdit,
		setIsEdit,
		setTodoItem,
		setVisible,
		visible,
		getDataTodo,
		deleteTask,
		filterStatus,
		setFilterStatus,
		setSearchText,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
	} = useModel('todolist');

	useEffect(() => {
		getDataTodo();
	}, []);

	const handleEdit = (record: any) => {
		setIsEdit(true);
		setTodoItem(record);
		setVisible(true);
	};

	const columns = [
		{
			title: 'Tên Task',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: '25%',
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			width: '15%',
			render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: '10%',
			render: (status: string) => {
				let color = 'blue';
				let text = 'Cần làm';
				if (status === 'in-progress') {
					color = 'orange';
					text = 'Đang làm';
				} else if (status === 'completed') {
					color = 'green';
					text = 'Hoàn thành';
				}
				return <Tag color={color}>{text}</Tag>;
			},
		},
		{
			title: 'Mức độ',
			dataIndex: 'priority',
			key: 'priority',
			width: '10%',
			render: (priority: string) => {
				let color = 'default';
				let text = 'Thấp';
				if (priority === 'cao') {
					color = 'red';
					text = 'Cao';
				} else if (priority === 'trung-binh') {
					color = 'gold';
					text = 'Trung bình';
				}
				return <Tag color={color}>{text}</Tag>;
			},
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
			width: '10%',
			render: (tag: string) => <Tag color='purple'>{tag}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'action',
			width: '10%',
			render: (_: any, record: any) => (
				<Space size='middle'>
					<Button type='text' icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleEdit(record)} />
					<Button
						type='text'
						danger
						icon={<DeleteOutlined />}
						onClick={() => {
							Modal.confirm({
								title: 'Xác nhận xóa',
								content: 'Bạn có chắc chắn muốn xóa task này?',
								onOk: () => deleteTask(record.id),
							});
						}}
					/>
				</Space>
			),
		},
	];

	return (
		<Card title='Danh sách Task'>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Search
						placeholder='Tìm kiếm task...'
						onSearch={setSearchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
					/>
				</Col>
				<Col span={4}>
					<Select value={filterStatus} style={{ width: '100%' }} onChange={setFilterStatus}>
						<Option value='all'>Tất cả trạng thái</Option>
						<Option value='todo'>Cần làm</Option>
						<Option value='in-progress'>Đang làm</Option>
						<Option value='completed'>Hoàn thành</Option>
					</Select>
				</Col>
				<Col span={4}>
					<Select value={sortBy} style={{ width: '100%' }} onChange={setSortBy}>
						<Option value='deadline'>Sắp xếp theo Deadline</Option>
						<Option value='priority'>Sắp xếp theo Mức độ</Option>
					</Select>
				</Col>
				<Col span={4}>
					<Select value={sortOrder} style={{ width: '100%' }} onChange={setSortOrder}>
						<Option value='asc'>Tăng dần</Option>
						<Option value='desc'>Giảm dần</Option>
					</Select>
				</Col>
				<Col span={6} style={{ textAlign: 'right' }}>
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setIsEdit(false);
							setTodoItem(undefined);
							setVisible(true);
						}}
					>
						Thêm mới
					</Button>
				</Col>
			</Row>

			<Table columns={columns} dataSource={filteredTasks} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={isEdit ? 'Cập nhật Task' : 'Thêm mới Task'}
				destroyOnClose
				visible={visible}
				footer={null}
				onCancel={() => setVisible(false)}
				width={600}
			>
				<FormTodoList />
			</Modal>
		</Card>
	);
};

export default TodoList;
