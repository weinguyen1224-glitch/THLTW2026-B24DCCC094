export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'cao' | 'trung-binh' | 'thap';

export interface Task {
	id: string;
	name: string;
	description: string;
	deadline: string;
	priority: TaskPriority;
	tag: string;
	status: TaskStatus;
	createdAt?: string;
}

export interface TodoItem {
	content: string;
	category: string;
	color: string;
}
