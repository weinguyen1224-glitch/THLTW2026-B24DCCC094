import { useState } from 'react';
import type { Task, TaskStatus, TaskPriority } from '@/services/TodoList/typings';

export type { TaskStatus, TaskPriority };
export type { Task };

export default () => {
	const [data, setData] = useState<Task[]>([]);
	const [todoItem, setTodoItem] = useState<Task>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
	const [searchText, setSearchText] = useState<string>('');
	const [sortBy, setSortBy] = useState<'deadline' | 'priority'>('deadline');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const getDataTodo = async () => {
		const dataLocal: any = localStorage.getItem('todolist');
		const parsedData = dataLocal ? JSON.parse(dataLocal) : [];
		setData(parsedData);
	};

	const saveDataTodo = (tasks: Task[]) => {
		localStorage.setItem('todolist', JSON.stringify(tasks));
		setData(tasks);
	};

	const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
		const newTask: Task = {
			...task,
			id: Date.now().toString(),
			createdAt: new Date().toISOString(),
		};
		const newTasks = [...data, newTask];
		saveDataTodo(newTasks);
		return newTask;
	};

	const updateTask = (id: string, task: Omit<Task, 'id' | 'createdAt'>) => {
		const newTasks = data.map((t) => (t.id === id ? { ...t, ...task } : t));
		saveDataTodo(newTasks);
	};

	const deleteTask = (id: string) => {
		const newTasks = data.filter((t) => t.id !== id);
		saveDataTodo(newTasks);
	};

	const moveTask = (taskId: string, newStatus: TaskStatus) => {
		const task = data.find((t) => t.id === taskId);
		if (task && task.status !== newStatus) {
			updateTask(taskId, { ...task, status: newStatus });
		}
	};

	const filteredTasks = data
		.filter((task) => {
			const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
			const matchesSearch =
				!searchText ||
				task.name.toLowerCase().includes(searchText.toLowerCase()) ||
				task.description.toLowerCase().includes(searchText.toLowerCase());
			return matchesStatus && matchesSearch;
		})
		.sort((a, b) => {
			if (sortBy === 'deadline') {
				const dateA = new Date(a.deadline).getTime();
				const dateB = new Date(b.deadline).getTime();
				return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
			}
			const priorityOrder: Record<TaskPriority, number> = { cao: 0, 'trung-binh': 1, thap: 2 };
			const priorityA = priorityOrder[a.priority];
			const priorityB = priorityOrder[b.priority];
			return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
		});

	const totalTasks = data.length;
	const completedTasks = data.filter((t) => t.status === 'completed').length;
	const overdueTasks = data.filter(
		(t) => t.status !== 'completed' && new Date(t.deadline).getTime() < new Date().getTime(),
	).length;

	return {
		data,
		setData,
		getDataTodo,
		saveDataTodo,
		todoItem,
		setTodoItem,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
		filterStatus,
		setFilterStatus,
		searchText,
		setSearchText,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
		filteredTasks,
		totalTasks,
		completedTasks,
		overdueTasks,
		addTask,
		updateTask,
		deleteTask,
		moveTask,
	};
};
