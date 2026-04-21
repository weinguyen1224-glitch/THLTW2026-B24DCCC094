import { useState, useEffect } from 'react';
import { Input, Tag, Card, Row, Col, Pagination, Empty, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useModel } from 'umi';
import { PAGE_SIZE } from '@/services/Blog/constant';
import type { Blog } from '@/services/Blog/typing';

const BlogHome: React.FC = () => {
	const { tags, selectedTag, setSelectedTag, searchKeyword, setSearchKeyword, getFilteredPosts, loading } = useModel('blog');
	const [currentPage, setCurrentPage] = useState(1);
	const [debouncedKeyword, setDebouncedKeyword] = useState('');

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedKeyword(searchKeyword);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchKeyword]);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedTag, debouncedKeyword]);

	const filteredPosts = getFilteredPosts().filter((p) => {
		if (selectedTag && !p.tags.includes(selectedTag)) return false;
		if (debouncedKeyword) {
			const kw = debouncedKeyword.toLowerCase();
			if (!p.title.toLowerCase().includes(kw) && !p.summary.toLowerCase().includes(kw)) return false;
		}
		return true;
	});

	const paginatedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
	};

	return (
		<div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
			<h1 style={{ textAlign: 'center', marginBottom: 24 }}>Blog Cá Nhân</h1>

			<div style={{ marginBottom: 24 }}>
				<Input
					prefix={<SearchOutlined />}
					placeholder='Tìm kiếm bài viết...'
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					style={{ marginBottom: 16 }}
					size='large'
				/>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
					<Tag
						color={selectedTag === '' ? 'blue' : 'default'}
						onClick={() => setSelectedTag('')}
						style={{ cursor: 'pointer' }}
					>
						Tất cả
					</Tag>
					{tags.map((tag) => (
						<Tag
							key={tag.id}
							color={selectedTag === tag.name ? tag.color : 'default'}
							onClick={() => setSelectedTag(tag.name)}
							style={{ cursor: 'pointer' }}
						>
							{tag.name}
						</Tag>
					))}
				</div>
			</div>

			<Spin spinning={loading}>
				{filteredPosts.length === 0 ? (
					<Empty description='Không có bài viết nào' style={{ marginTop: 48 }} />
				) : (
					<>
						<Row gutter={[16, 16]}>
							{paginatedPosts.map((post) => (
								<Col key={post.id} xs={24} sm={12} md={8}>
									<Card
										hoverable
										cover={<img alt={post.title} src={post.coverImage} style={{ height: 180, objectFit: 'cover' }} />}
										onClick={() => history.push(`/blog/post/${post.slug}`)}
									>
										<Card.Meta
											title={post.title}
											description={
												<div>
													<p style={{ color: '#666', fontSize: 13 }}>{post.summary}</p>
													<div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
														{post.tags.map((tag) => (
															<Tag key={tag} color='blue' style={{ margin: 0 }}>
																{tag}
															</Tag>
														))}
													</div>
													<div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
														<span>{post.author.name}</span>
														<span style={{ margin: '0 8px' }}>|</span>
														<span>{formatDate(post.createdAt)}</span>
														<span style={{ margin: '0 8px' }}>|</span>
														<span>{post.viewCount} lượt xem</span>
													</div>
												</div>
											}
										/>
									</Card>
								</Col>
							))}
						</Row>
						<div style={{ textAlign: 'center', marginTop: 32 }}>
							<Pagination
								current={currentPage}
								pageSize={PAGE_SIZE}
								total={filteredPosts.length}
								onChange={setCurrentPage}
								showSizeChanger={false}
							/>
						</div>
					</>
				)}
			</Spin>
		</div>
	);
};

export default BlogHome;