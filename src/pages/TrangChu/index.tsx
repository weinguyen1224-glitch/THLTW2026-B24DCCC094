import { Card, Col, Row, Statistic } from 'antd';
import { useModel } from 'umi';
import { CheckCircleOutlined, ClockCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import './components/style.less';
import { unitName } from '@/services/base/constant';

const TrangChu = () => {
	const { totalTasks, completedTasks, overdueTasks, getDataTodo } = useModel('todolist');

	useEffect(() => {
		getDataTodo();
	}, []);

	return (
		<div>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={8}>
					<Card bordered={false} className='dashboard-card'>
						<Statistic
							title='Tổng số Task'
							value={totalTasks}
							prefix={<UnorderedListOutlined style={{ color: '#1890ff' }} />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card bordered={false} className='dashboard-card'>
						<Statistic
							title='Đã hoàn thành'
							value={completedTasks}
							prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card bordered={false} className='dashboard-card'>
						<Statistic
							title='Quá hạn'
							value={overdueTasks}
							prefix={<ClockCircleOutlined style={{ color: '#f5222d' }} />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
			</Row>

			<Card bodyStyle={{ height: '100%', marginTop: '24px' }}>
				<div className='home-welcome'>
					<h1 className='title'>THỰC HÀNH LẬP TRÌNH WEB</h1>
					<h2 className='sub-title'>{unitName.toUpperCase()}</h2>
				</div>
			</Card>
		</div>
	);
};

export default TrangChu;
