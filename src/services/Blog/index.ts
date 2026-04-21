import type { Blog } from './typing';
import { EStorageKey } from './constant';

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultAuthor: Blog.Author = {
	id: 'author-1',
	name: 'Nguyễn Văn A',
	avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=1890ff&color=fff',
	bio: 'Lập trình viên Frontend với niềm đam mê với công nghệ và thiết kế.',
	skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'JavaScript'],
	socialLinks: {
		facebook: 'https://facebook.com',
		github: 'https://github.com',
		linkedin: 'https://linkedin.com',
		email: 'email@example.com',
	},
};

const defaultPosts: Blog.Post[] = [
	{
		id: generateId(),
		title: 'Giới thiệu về React Hooks',
		slug: 'gioi-thieu-react-hooks',
		content: '## React Hooks là gì?\n\nReact Hooks là các hàm cho phép bạn sử dụng state và lifecycle trong functional components.',
		summary: 'Tìm hiểu về React Hooks - cách quản lý state và lifecycle trong functional components.',
		coverImage: 'https://picsum.photos/800/400?random=1',
		tags: ['React', 'JavaScript'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 120,
		createdAt: '2024-01-15T10:00:00Z',
		updatedAt: '2024-01-15T10:00:00Z',
	},
	{
		id: generateId(),
		title: 'TypeScript cho người mới bắt đầu',
		slug: 'typescript-cho-nguoi-moi',
		content: '## TypeScript là gì?\n\nTypeScript là một superset của JavaScript với thêm type system.',
		summary: 'Hướng dẫn cơ bản về TypeScript cho người mới bắt đầu.',
		coverImage: 'https://picsum.photos/800/400?random=2',
		tags: ['TypeScript', 'JavaScript'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 85,
		createdAt: '2024-01-20T14:30:00Z',
		updatedAt: '2024-01-20T14:30:00Z',
	},
	{
		id: generateId(),
		title: 'CSS Flexbox và Grid',
		slug: 'css-flexbox-grid',
		content: '## Layout với Flexbox và Grid\n\nHai công cụ mạnh mẽ để tạo layout responsive.',
		summary: 'So sánh và cách sử dụng Flexbox và CSS Grid để tạo layout web.',
		coverImage: 'https://picsum.photos/800/400?random=3',
		tags: ['CSS', 'Frontend'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 200,
		createdAt: '2024-02-01T09:00:00Z',
		updatedAt: '2024-02-01T09:00:00Z',
	},
	{
		id: generateId(),
		title: 'Node.js cơ bản',
		slug: 'nodejs-co-ban',
		content: '## Node.js là gì?\n\nNode.js là một runtime cho phép chạy JavaScript phía server.',
		summary: 'Tìm hiểu những khái niệm cơ bản về Node.js.',
		coverImage: 'https://picsum.photos/800/400?random=4',
		tags: ['Node.js', 'Backend'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 95,
		createdAt: '2024-02-10T11:00:00Z',
		updatedAt: '2024-02-10T11:00:00Z',
	},
	{
		id: generateId(),
		title: 'Git cơ bản',
		slug: 'git-co-ban',
		content: '## Git là gì?\n\nGit là một hệ thống quản lý phiên bản phân tán.',
		summary: 'Hướng dẫn sử dụng Git từ cơ bản đến nâng cao.',
		coverImage: 'https://picsum.photos/800/400?random=5',
		tags: ['Git', 'DevOps'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 150,
		createdAt: '2024-02-15T08:00:00Z',
		updatedAt: '2024-02-15T08:00:00Z',
	},
	{
		id: generateId(),
		title: 'React Native cho người mới',
		slug: 'react-native-cho-nguoi-moi',
		content: '## React Native là gì?\n\nFramework để phát triển ứng dụng di động đa nền tảng.',
		summary: 'Bắt đầu với React Native - xây dựng ứng dụng di động với JavaScript.',
		coverImage: 'https://picsum.photos/800/400?random=6',
		tags: ['React', 'Mobile'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 180,
		createdAt: '2024-02-20T10:00:00Z',
		updatedAt: '2024-02-20T10:00:00Z',
	},
	{
		id: generateId(),
		title: 'MongoDB cơ bản',
		slug: 'mongodb-co-ban',
		content: '## MongoDB là gì?\n\nMongoDB là một NoSQL database document-oriented.',
		summary: 'Tìm hiểu MongoDB và cách thiết kế schema cho ứng dụng.',
		coverImage: 'https://picsum.photos/800/400?random=7',
		tags: ['Node.js', 'Database'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 110,
		createdAt: '2024-02-25T15:00:00Z',
		updatedAt: '2024-02-25T15:00:00Z',
	},
	{
		id: generateId(),
		title: 'RESTful API Design',
		slug: 'restful-api-design',
		content: '## RESTful API là gì?\n\nArchitecture style cho việc thiết kế web services.',
		summary: 'Hướng dẫn thiết kế RESTful API chuẩn và best practices.',
		coverImage: 'https://picsum.photos/800/400?random=8',
		tags: ['API', 'Backend'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 220,
		createdAt: '2024-03-01T09:00:00Z',
		updatedAt: '2024-03-01T09:00:00Z',
	},
	{
		id: generateId(),
		title: 'Docker cơ bản',
		slug: 'docker-co-ban',
		content: '## Docker là gì?\n\nPlatform để container hóa ứng dụng.',
		summary: 'Bắt đầu với Docker - cách đóng gói và deploy ứng dụng.',
		coverImage: 'https://picsum.photos/800/400?random=9',
		tags: ['Docker', 'DevOps'],
		status: 'published',
		author: defaultAuthor,
		viewCount: 130,
		createdAt: '2024-03-05T14:00:00Z',
		updatedAt: '2024-03-05T14:00:00Z',
	},
	{
		id: generateId(),
		title: 'Bài viết nháp - Test',
		slug: 'bai-viet-nhap-test',
		content: '## Bài viết nháp\n\nĐây là bài viết đang trong trạng thái nháp.',
		summary: 'Bài viết test cho trạng thái nháp.',
		coverImage: 'https://picsum.photos/800/400?random=10',
		tags: ['Test'],
		status: 'draft',
		author: defaultAuthor,
		viewCount: 0,
		createdAt: '2024-03-10T10:00:00Z',
		updatedAt: '2024-03-10T10:00:00Z',
	},
];

const defaultTags: Blog.Tag[] = [
	{ id: '1', name: 'React', color: '#61dafb' },
	{ id: '2', name: 'JavaScript', color: '#f7df1e' },
	{ id: '3', name: 'TypeScript', color: '#3178c6' },
	{ id: '4', name: 'CSS', color: '#264de4' },
	{ id: '5', name: 'Frontend', color: '#ff6b6b' },
	{ id: '6', name: 'Node.js', color: '#339933' },
	{ id: '7', name: 'Backend', color: '#8b5cf6' },
	{ id: '8', name: 'Git', color: '#f05032' },
	{ id: '9', name: 'DevOps', color: '#2496ed' },
	{ id: '10', name: 'Mobile', color: '#3b82f6' },
	{ id: '11', name: 'Database', color: '#f59e0b' },
	{ id: '12', name: 'API', color: '#10b981' },
	{ id: '13', name: 'Docker', color: '#2496ed' },
	{ id: '14', name: 'Test', color: '#ef4444' },
];

const getData = <T>(key: string, defaultValue: T): T => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : defaultValue;
};

const setData = (key: string, data: unknown) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const getPosts = (): Blog.Post[] => {
	const posts = getData<Blog.Post[]>(EStorageKey.BLOG_POSTS, defaultPosts);
	return posts.length ? posts : defaultPosts;
};

export const savePost = (post: Blog.Post): void => {
	const posts = getPosts();
	const index = posts.findIndex((p) => p.id === post.id);
	if (index >= 0) {
		posts[index] = { ...post, updatedAt: new Date().toISOString() };
	} else {
		posts.unshift(post);
	}
	setData(EStorageKey.BLOG_POSTS, posts);
};

export const deletePost = (id: string): void => {
	const posts = getPosts().filter((p) => p.id !== id);
	setData(EStorageKey.BLOG_POSTS, posts);
};

export const getPostBySlug = (slug: string): Blog.Post | undefined => {
	const posts = getPosts();
	const post = posts.find((p) => p.slug === slug);
	if (post) {
		post.viewCount += 1;
		setData(EStorageKey.BLOG_POSTS, posts);
	}
	return post;
};

export const getRelatedPosts = (currentPost: Blog.Post, limit = 3): Blog.Post[] => {
	const posts = getPosts();
	return posts
		.filter((p) => p.id !== currentPost.id && p.status === 'published' && p.tags.some((t) => currentPost.tags.includes(t)))
		.slice(0, limit);
};

export const getTags = (): Blog.Tag[] => {
	const tags = getData<Blog.Tag[]>(EStorageKey.BLOG_TAGS, defaultTags);
	return tags.length ? tags : defaultTags;
};

export const saveTag = (tag: Blog.Tag): void => {
	const tags = getTags();
	const index = tags.findIndex((t) => t.id === tag.id);
	if (index >= 0) {
		tags[index] = tag;
	} else {
		tags.push(tag);
	}
	setData(EStorageKey.BLOG_TAGS, tags);
};

export const deleteTag = (id: string): void => {
	const tags = getTags().filter((t) => t.id !== id);
	setData(EStorageKey.BLOG_TAGS, tags);
};

export const getAuthor = (): Blog.Author => {
	const author = getData<Blog.Author | null>(EStorageKey.BLOG_AUTHOR, null);
	return author || defaultAuthor;
};

export const saveAuthor = (author: Blog.Author): void => {
	setData(EStorageKey.BLOG_AUTHOR, author);
};

export { defaultAuthor, defaultTags, generateId };