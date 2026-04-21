declare module Blog {
	export interface Post {
		id: string;
		title: string;
		slug: string;
		content: string;
		summary: string;
		coverImage: string;
		tags: string[];
		status: 'draft' | 'published';
		author: Author;
		viewCount: number;
		createdAt: string;
		updatedAt: string;
	}

	export interface Tag {
		id: string;
		name: string;
		color: string;
	}

	export interface Author {
		id: string;
		name: string;
		avatar: string;
		bio: string;
		skills: string[];
		socialLinks: SocialLinks;
	}

	export interface SocialLinks {
		facebook?: string;
		github?: string;
		linkedin?: string;
		email?: string;
	}
}