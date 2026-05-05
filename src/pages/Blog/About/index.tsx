import React, { useEffect } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { Card, Typography, Avatar, Tag, Space, Button, Divider, Row, Col, Spin } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import type { BlogState, Author } from '@/models/blog';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

interface AboutProps {
	blog: BlogState;
	dispatch: Dispatch;
}

const About: React.FC<AboutProps> = ({ blog, dispatch }) => {
	const { author } = blog;

	useEffect(() => {
		dispatch({ type: 'blog/fetchAuthor' });
	}, [dispatch]);

	if (!author) {
		return (
			<div className={styles.loadingContainer}>
				<Spin size='large' />
			</div>
		);
	}

	const getSocialIcon = (type: string) => {
		switch (type) {
			case 'github':
				return <GithubOutlined />;
			case 'linkedin':
				return <LinkedinOutlined />;
			case 'twitter':
				return <TwitterOutlined />;
			case 'email':
				return <MailOutlined />;
			case 'website':
				return <GlobalOutlined />;
			default:
				return <GlobalOutlined />;
		}
	};

	const socialLinks = [
		author.socialLinks.github && { key: 'github', url: author.socialLinks.github, label: 'GitHub' },
		author.socialLinks.linkedin && { key: 'linkedin', url: author.socialLinks.linkedin, label: 'LinkedIn' },
		author.socialLinks.twitter && { key: 'twitter', url: author.socialLinks.twitter, label: 'Twitter' },
		author.socialLinks.email && { key: 'email', url: `mailto:${author.socialLinks.email}`, label: 'Email' },
		author.socialLinks.website && { key: 'website', url: author.socialLinks.website, label: 'Website' },
	].filter(Boolean);

	return (
		<div className={styles.aboutPage}>
			{/* Hero Section */}
			<div className={styles.heroSection}>
				<div className={styles.heroBackground}>
					<div className={styles.heroPattern} />
				</div>
				<div className={styles.heroContent}>
					<Avatar src={author.avatar} size={160} className={styles.avatar} />
					<Title level={1} className={styles.name}>
						{author.name}
					</Title>
					<Paragraph className={styles.tagline}>Full-Stack Developer & Technical Writer</Paragraph>
				</div>
			</div>

			{/* Content Section */}
			<div className={styles.contentSection}>
				<Row gutter={[48, 48]} justify='center'>
					<Col xs={24} lg={16}>
						{/* Bio Card */}
						<Card className={styles.bioCard}>
							<Title level={3} className={styles.sectionTitle}>
								Về tôi
							</Title>
							<Paragraph className={styles.bioText}>{author.bio}</Paragraph>
							<Paragraph className={styles.bioText}>
								Với nhiều năm kinh nghiệm trong việc phát triển các ứng dụng web quy mô lớn, tôi luôn tìm cách chia sẻ
								kiến thức và kinh nghiệm thực tế thông qua các bài viết. Tôi tin rằng việc học hỏi và chia sẻ không
								ngừng là chìa khóa để phát triển trong ngành công nghệ.
							</Paragraph>
							<Paragraph className={styles.bioText}>
								Trên blog này, bạn sẽ tìm thấy các bài viết về React, TypeScript, Node.js, và nhiều chủ đề khác liên
								quan đến phát triển web hiện đại. Tôi hy vọng những bài viết này sẽ giúp ích cho bạn trong hành trình
								học tập của mình.
							</Paragraph>
						</Card>

						{/* Skills Card */}
						<Card className={styles.skillsCard}>
							<Title level={3} className={styles.sectionTitle}>
								Kỹ năng
							</Title>
							<div className={styles.skillsGrid}>
								{author.skills.map((skill, index) => (
									<Tag key={index} className={styles.skillTag}>
										{skill}
									</Tag>
								))}
							</div>
						</Card>

						{/* Social Links Card */}
						<Card className={styles.socialCard}>
							<Title level={3} className={styles.sectionTitle}>
								Liên kết
							</Title>
							<Space wrap size='middle'>
								{socialLinks.map((link) => (
									<Button
										key={link!.key}
										type='primary'
										ghost
										icon={getSocialIcon(link!.key)}
										href={link!.url}
										target='_blank'
										rel='noopener noreferrer'
										className={styles.socialButton}
									>
										{link!.label}
									</Button>
								))}
							</Space>
						</Card>
					</Col>
				</Row>
			</div>

			{/* Stats Section */}
			<div className={styles.statsSection}>
				<Row gutter={[32, 32]} justify='center'>
					<Col xs={12} sm={6}>
						<Card className={styles.statCard}>
							<Title level={2} className={styles.statNumber}>
								50+
							</Title>
							<Text className={styles.statLabel}>Bài viết</Text>
						</Card>
					</Col>
					<Col xs={12} sm={6}>
						<Card className={styles.statCard}>
							<Title level={2} className={styles.statNumber}>
								10K+
							</Title>
							<Text className={styles.statLabel}>Lượt xem</Text>
						</Card>
					</Col>
					<Col xs={12} sm={6}>
						<Card className={styles.statCard}>
							<Title level={2} className={styles.statNumber}>
								8
							</Title>
							<Text className={styles.statLabel}>Chủ đề</Text>
						</Card>
					</Col>
					<Col xs={12} sm={6}>
						<Card className={styles.statCard}>
							<Title level={2} className={styles.statNumber}>
								3+
							</Title>
							<Text className={styles.statLabel}>Năm kinh nghiệm</Text>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default connect(({ blog }: { blog: BlogState }) => ({ blog }))(About);
