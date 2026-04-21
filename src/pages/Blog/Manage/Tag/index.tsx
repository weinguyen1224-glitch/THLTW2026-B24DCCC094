import { Table, Button, Tag, Space, Modal, Form, Input, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
import { generateId } from '@/services/Blog';
import type { Blog } from '@/services/Blog/typing';

const ManageTags: React.FC = () => {
	const { tags, saveTag, deleteTag, getPostCountByTag } = useModel('blog');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTag, setEditingTag] = useState<Blog.Tag | null>(null);
	const [form] = Form.useForm();

	const handleEdit = (tag: Blog.Tag) => {
		setEditingTag(tag);
		form.setFieldsValue(tag);
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		deleteTag(id);
		message.success('Xóa thẻ thành công');
	};

	const handleAdd = () => {
		setEditingTag(null);
		form.resetFields();
		setIsModalOpen(true);
	};

	const handleSubmit = (values: any) => {
		const tag: Blog.Tag = {
			id: editingTag?.id || generateId(),
			name: values.name,
			color: values.color || '#1890ff',
		};
		saveTag(tag);
		setIsModalOpen(false);
		message.success(editingTag ? 'Cập nhật thẻ thành công' : 'Thêm thẻ thành công');
	};

	const columns = [
		{
			title: 'Tên thẻ',
			dataIndex: 'name',
			render: (name: string, record: Blog.Tag) => (
				<Tag color={record.color} style={{ padding: '4px 12px', fontSize: 14 }}>
					{name}
				</Tag>
			),
		},
		{
			title: 'Màu sắc',
			dataIndex: 'color',
			width: 120,
			render: (color: string) => (
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 4 }} />
					<span>{color}</span>
				</div>
			),
		},
		{
			title: 'Số bài viết',
			dataIndex: 'count',
			width: 120,
			render: (_: any, record: Blog.Tag) => getPostCountByTag(record.name),
		},
		{
			title: 'Hành động',
			width: 120,
			render: (_: any, record: Blog.Tag) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm title='Xóa thẻ?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h1>Quản lý thẻ</h1>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm thẻ
				</Button>
			</div>

			<Table columns={columns} dataSource={tags} rowKey='id' pagination={false} />

			<Modal
				title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				destroyOnClose
			>
				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item label='Tên thẻ' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Màu sắc' name='color' initialValue='#1890ff'>
						<Input type='color' style={{ width: 100 }} />
					</Form.Item>
					<Form.Item style={{ textAlign: 'right' }}>
						<Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>
							Hủy
						</Button>
						<Button type='primary' htmlType='submit'>
							Lưu
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ManageTags;