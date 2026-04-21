import { Card, Avatar, Tag, Typography, Row, Col, Divider } from 'antd';
import { MailOutlined, GithubOutlined, LinkedinOutlined, FacebookOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Title, Paragraph } = Typography;

const AboutPage: React.FC = () => {
	const { author } = useModel('blog');

	const SocialIcon = ({ type, url }: { type: string; url?: string }) => {
		if (!url) return null;
		const icons: Record<string, React.ReactNode> = {
			email: <MailOutlined />,
			github: <GithubOutlined />,
			linkedin: <LinkedinOutlined />,
			facebook: <FacebookOutlined />,
		};
		return (
			<a href={type === 'email' ? `mailto:${url}` : url} target='_blank' rel='noopener noreferrer' style={{ fontSize: 24, margin: '0 12px', color: '#1890ff' }}>
				{icons[type]}
			</a>
		);
	};

	return (
		<div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
			<Title level={1} style={{ textAlign: 'center', marginBottom: 32 }}>Giới thiệu</Title>

			<Card>
				<Row gutter={[32, 24]} align='middle'>
					<Col xs={24} md={8} style={{ textAlign: 'center' }}>
						<Avatar src={author.avatar} size={180} style={{ marginBottom: 16 }} />
						<Title level={3}>{author.name}</Title>
						<div>
							<SocialIcon type='email' url={author.socialLinks?.email} />
							<SocialIcon type='github' url={author.socialLinks?.github} />
							<SocialIcon type='linkedin' url={author.socialLinks?.linkedin} />
							<SocialIcon type='facebook' url={author.socialLinks?.facebook} />
						</div>
					</Col>
					<Col xs={24} md={16}>
						<Title level={4}>Tiểu sử</Title>
						<Paragraph style={{ fontSize: 16 }}>{author.bio}</Paragraph>

						<Divider />

						<Title level={4}>Kỹ năng</Title>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
							{author.skills?.map((skill) => (
								<Tag key={skill} color='blue' style={{ fontSize: 14, padding: '4px 12px' }}>
									{skill}
								</Tag>
							))}
						</div>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default AboutPage;