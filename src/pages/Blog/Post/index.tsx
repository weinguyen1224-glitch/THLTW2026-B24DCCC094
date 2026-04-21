import { Card, Tag, Button, Typography, Avatar, Spin, Empty } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { history, useParams } from 'umi';
import { useModel } from 'umi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const { Title, Text } = Typography;

const BlogDetail: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const { getPostBySlug, getRelatedPosts } = useModel('blog');

	const post = getPostBySlug(slug);
	const relatedPosts = post ? getRelatedPosts(post) : [];

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (!post) {
		return (
			<div style={{ padding: 48, textAlign: 'center' }}>
				<Empty description='Bài viết không tồn tại' />
				<Button type='primary' onClick={() => history.push('/blog')} style={{ marginTop: 16 }}>
					Quay lại danh sách
				</Button>
			</div>
		);
	}

	return (
		<div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
			<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog')} style={{ marginBottom: 24 }}>
				Quay lại
			</Button>

			<img src={post.coverImage} alt={post.title} style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 8 }} />

			<Title level={1} style={{ marginTop: 24 }}>{post.title}</Title>

			<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, color: '#666' }}>
				<span><UserOutlined /> {post.author.name}</span>
				<span><CalendarOutlined /> {formatDate(post.createdAt)}</span>
				<span><EyeOutlined /> {post.viewCount} lượt xem</span>
			</div>

			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
				{post.tags.map((tag) => (
					<Tag key={tag} color='blue'>{tag}</Tag>
				))}
			</div>

			<Card style={{ marginBottom: 32 }}>
				<div className='markdown-content'>
					<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
						{post.content}
					</ReactMarkdown>
				</div>
			</Card>

			{relatedPosts.length > 0 && (
				<>
					<Title level={3}>Bài viết liên quan</Title>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
						{relatedPosts.map((related) => (
							<Card
								key={related.id}
								hoverable
								cover={<img alt={related.title} src={related.coverImage} style={{ height: 150, objectFit: 'cover' }} />}
								onClick={() => history.push(`/blog/post/${related.slug}`)}
							>
								<Card.Meta
									title={related.title}
									description={
										<>
											<Text type='secondary'>{related.summary}</Text>
											<div style={{ marginTop: 8 }}>
												{related.tags.slice(0, 2).map((tag) => (
													<Tag key={tag} color='blue' style={{ margin: 0 }}>{tag}</Tag>
												))}
											</div>
										</>
									}
								/>
							</Card>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default BlogDetail;