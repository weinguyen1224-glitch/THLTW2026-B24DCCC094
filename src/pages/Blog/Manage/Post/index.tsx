import { Table, Button, Input, Select, Tag, Space, Modal, Form, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { generateId } from '@/services/Blog';
import type { Blog } from '@/services/Blog/typing';
import PostForm from './components/PostForm';

const { Option } = Select;

const ManagePosts: React.FC = () => {
	const { posts, savePost, deletePost, author, tags } = useModel('blog');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<Blog.Post | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		if (!editingPost && posts.length === 0) {
			form.setFieldsValue({
				status: 'draft',
			});
		}
	}, []);

	const filteredPosts = posts.filter((post) => {
		if (searchKeyword && !post.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
		if (statusFilter && post.status !== statusFilter) return false;
		return true;
	});

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	const handleEdit = (post: Blog.Post) => {
		setEditingPost(post);
		form.setFieldsValue({
			...post,
			tags: post.tags,
		});
		setIsModalOpen(true);
	};

	const handleDelete = (id: string) => {
		deletePost(id);
		message.success('Xóa bài viết thành công');
	};

	const handleAdd = () => {
		setEditingPost(null);
		form.resetFields();
		form.setFieldsValue({ status: 'draft' });
		setIsModalOpen(true);
	};

	const handleSubmit = (values: any) => {
		const post: Blog.Post = {
			id: editingPost?.id || generateId(),
			title: values.title,
			slug: values.slug || values.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
			content: values.content,
			summary: values.summary,
			coverImage: values.coverImage || 'https://picsum.photos/800/400',
			tags: values.tags || [],
			status: values.status,
			author: editingPost?.author || author,
			viewCount: editingPost?.viewCount || 0,
			createdAt: editingPost?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		savePost(post);
		setIsModalOpen(false);
		message.success(editingPost ? 'Cập nhật bài viết thành công' : 'Thêm bài viết thành công');
	};

	const columns = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			ellipsis: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			render: (status: string) => (
				<Tag color={status === 'published' ? 'green' : 'orange'}>
					{status === 'published' ? 'Đã đăng' : 'Nháp'}
				</Tag>
			),
		},
		{
			title: 'Thẻ',
			dataIndex: 'tags',
			width: 200,
			render: (tags: string[]) => (
				<>
					{tags.slice(0, 2).map((tag) => (
						<Tag key={tag} color='blue' style={{ marginBottom: 2 }}>{tag}</Tag>
					))}
					{tags.length > 2 && <Tag>+{tags.length - 2}</Tag>}
				</>
			),
		},
		{
			title: 'Lượt xem',
			dataIndex: 'viewCount',
			width: 100,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 120,
			render: (date: string) => formatDate(date),
		},
		{
			title: 'Hành động',
			width: 120,
			render: (_: any, record: Blog.Post) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm title='Xóa bài viết?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h1>Quản lý bài viết</h1>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
					Thêm bài viết
				</Button>
			</div>

			<div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
				<Input
					prefix={<SearchOutlined />}
					placeholder='Tìm kiếm theo tiêu đề'
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					style={{ width: 300 }}
				/>
				<Select placeholder='Lọc trạng thái' allowClear style={{ width: 150 }} onChange={(val) => setStatusFilter(val || '')}>
					<Option value='published'>Đã đăng</Option>
					<Option value='draft'>Nháp</Option>
				</Select>
			</div>

			<Table columns={columns} dataSource={filteredPosts} rowKey='id' pagination={{ pageSize: 10 }} />

			<Modal
				title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
				width={800}
				destroyOnClose
			>
				<PostForm form={form} tags={tags} onFinish={handleSubmit} onCancel={() => setIsModalOpen(false)} />
			</Modal>
		</div>
	);
};

export default ManagePosts;