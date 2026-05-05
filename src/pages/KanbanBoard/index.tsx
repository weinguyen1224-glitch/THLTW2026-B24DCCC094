import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Tag } from 'antd';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useModel } from 'umi';
import type { Task, TaskStatus } from '@/models/todolist';
import moment from 'moment';

const KanbanBoard = () => {
	const { data, getDataTodo, moveTask } = useModel('todolist');
	const [columns, setColumns] = useState<Record<TaskStatus, Task[]>>({
		todo: [],
		'in-progress': [],
		completed: [],
	});

	useEffect(() => {
		getDataTodo();
	}, []);

	useEffect(() => {
		// Organize tasks by status whenever data changes
		const newColumns: Record<TaskStatus, Task[]> = {
			todo: [],
			'in-progress': [],
			completed: [],
		};

		data.forEach((task) => {
			if (newColumns[task.status]) {
				newColumns[task.status].push(task);
			}
		});

		setColumns(newColumns);
	}, [data]);

	const onDragEnd = (result: DropResult) => {
		const { destination, source, draggableId } = result;

		// Dropped outside a valid droppable area
		if (!destination) {
			return;
		}

		// Dropped in the same place
		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			return;
		}

		const newStatus = destination.droppableId as TaskStatus;

		moveTask(draggableId, newStatus);
	};

	const getPriorityColor = (priority: string) => {
		if (priority === 'cao') return 'red';
		if (priority === 'trung-binh') return 'gold';
		return 'default';
	};

	const getPriorityText = (priority: string) => {
		if (priority === 'cao') return 'Cao';
		if (priority === 'trung-binh') return 'Trung bình';
		return 'Thấp';
	};

	const TaskCard = ({ task, index }: { task: Task; index: number }) => (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						userSelect: 'none',
						padding: '16px',
						margin: '0 0 12px 0',
						backgroundColor: snapshot.isDragging ? '#e6f7ff' : '#fff',
						borderRadius: '4px',
						border: '1px solid #d9d9d9',
						boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
						...provided.draggableProps.style,
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
						<h4 style={{ margin: 0, fontWeight: 'bold' }}>{task.name}</h4>
						<Tag color={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</Tag>
					</div>
					<p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', minHeight: '3em' }}>
						{task.description.length > 80 ? `${task.description.substring(0, 80)}...` : task.description}
					</p>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Tag color='purple'>{task.tag}</Tag>
						<span style={{ fontSize: '12px', color: '#999' }}>{moment(task.deadline).format('DD/MM/YYYY')}</span>
					</div>
				</div>
			)}
		</Draggable>
	);

	const Column = ({ title, status, tasks }: { title: string; status: TaskStatus; tasks: Task[] }) => (
		<Col span={8}>
			<Card
				title={title}
				headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
				bodyStyle={{ backgroundColor: '#f0f2f5', padding: '16px', minHeight: '500px' }}
			>
				<Droppable droppableId={status}>
					{(provided, snapshot) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={{
								background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
								minHeight: '400px',
								transition: 'background-color 0.2s ease',
								borderRadius: '4px',
							}}
						>
							{tasks.map((task, index) => (
								<TaskCard key={task.id} task={task} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</Card>
		</Col>
	);

	return (
		<div style={{ padding: '24px' }}>
			<h2 style={{ marginBottom: '24px' }}>Kanban Board</h2>
			<DragDropContext onDragEnd={onDragEnd}>
				<Row gutter={24}>
					<Column title='Cần làm' status='todo' tasks={columns.todo} />
					<Column title='Đang làm' status='in-progress' tasks={columns['in-progress']} />
					<Column title='Hoàn thành' status='completed' tasks={columns.completed} />
				</Row>
			</DragDropContext>
		</div>
	);
};

export default KanbanBoard;
