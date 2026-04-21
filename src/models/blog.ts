import { useState, useCallback, useEffect } from 'react';
import type { Blog } from '@/services/Blog/typing';
import * as blogService from '@/services/Blog';

export default () => {
	const [posts, setPosts] = useState<Blog.Post[]>([]);
	const [tags, setTags] = useState<Blog.Tag[]>([]);
	const [author, setAuthor] = useState<Blog.Author>({} as Blog.Author);
	const [selectedTag, setSelectedTag] = useState<string>('');
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const loadPosts = useCallback(() => {
		setLoading(true);
		const data = blogService.getPosts();
		setPosts(data);
		setLoading(false);
	}, []);

	const loadTags = useCallback(() => {
		const data = blogService.getTags();
		setTags(data);
	}, []);

	const loadAuthor = useCallback(() => {
		const data = blogService.getAuthor();
		setAuthor(data);
	}, []);

	const getFilteredPosts = useCallback(() => {
		let filtered = posts.filter((p) => p.status === 'published');
		if (selectedTag) {
			filtered = filtered.filter((p) => p.tags.includes(selectedTag));
		}
		if (searchKeyword) {
			const keyword = searchKeyword.toLowerCase();
			filtered = filtered.filter(
				(p) => p.title.toLowerCase().includes(keyword) || p.summary.toLowerCase().includes(keyword)
			);
		}
		return filtered;
	}, [posts, selectedTag, searchKeyword]);

	const getPostBySlug = useCallback((slug: string) => {
		return blogService.getPostBySlug(slug);
	}, []);

	const getRelatedPosts = useCallback((currentPost: Blog.Post) => {
		return blogService.getRelatedPosts(currentPost);
	}, []);

	const savePost = useCallback((post: Blog.Post) => {
		blogService.savePost(post);
		loadPosts();
	}, [loadPosts]);

	const deletePost = useCallback((id: string) => {
		blogService.deletePost(id);
		loadPosts();
	}, [loadPosts]);

	const saveTag = useCallback((tag: Blog.Tag) => {
		blogService.saveTag(tag);
		loadTags();
	}, [loadTags]);

	const deleteTag = useCallback((id: string) => {
		blogService.deleteTag(id);
		loadTags();
	}, [loadTags]);

	const saveAuthorInfo = useCallback((authorData: Blog.Author) => {
		blogService.saveAuthor(authorData);
		setAuthor(authorData);
	}, []);

	const getPostCountByTag = useCallback((tagName: string) => {
		return posts.filter((p) => p.tags.includes(tagName)).length;
	}, [posts]);

	useEffect(() => {
		loadPosts();
		loadTags();
		loadAuthor();
	}, []);

	return {
		posts,
		tags,
		author,
		selectedTag,
		searchKeyword,
		loading,
		setSelectedTag,
		setSearchKeyword,
		loadPosts,
		getFilteredPosts,
		getPostBySlug,
		getRelatedPosts,
		savePost,
		deletePost,
		saveTag,
		deleteTag,
		saveAuthorInfo,
		getPostCountByTag,
	};
};