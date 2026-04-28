import { Card, Statistic, Row, Col, Timeline, Tag } from 'antd';
import { FireOutlined, CalendarOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Chart from 'react-apexcharts';
import { primaryColor } from '@/services/base/constant';

const FitnessDashboard: React.FC = () => {
	const { getStats, getWeeklyWorkouts, getWeightHistory, getRecentWorkouts } = useModel('fitness');
	const stats = getStats();
	const weeklyData = getWeeklyWorkouts();
	const weightData = getWeightHistory();
	const recentWorkouts = getRecentWorkouts();

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
	};

	const getTypeColor = (type: string) => {
		const colors: Record<string, string> = {
			Cardio: 'red',
			Strength: 'blue',
			Yoga: 'green',
			HIIT: 'orange',
			Other: 'purple',
		};
		return colors[type] || 'default';
	};

	const weeklyChartOptions = {
		chart: { toolbar: { show: false } },
		plotOptions: { bar: { horizontal: false, columnWidth: '50%' } },
		xaxis: { categories: weeklyData.map((w) => w.week) },
		dataLabels: { enabled: false },
		colors: [primaryColor],
	};

	const weeklyChartSeries = [{ name: 'Buổi tập', data: weeklyData.map((w) => w.count) }];

	const weightChartOptions = {
		chart: { toolbar: { show: false }, type: 'area' as const },
		xaxis: { categories: weightData.map((w) => formatDate(w.date)) },
		dataLabels: { enabled: false },
		colors: ['#1890ff'],
		fill: { type: 'gradient' as const },
	};

	const weightChartSeries = [{ name: 'Cân nặng (kg)', data: weightData.map((w) => w.weight) }];

	return (
		<div style={{ padding: 24 }}>
			<h1 style={{ marginBottom: 24 }}>Dashboard Fitness</h1>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Buổi tập tháng này'
							value={stats.totalSessions}
							prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
							suffix='buổi'
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Calo đã đốt'
							value={stats.totalCalories}
							prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
							suffix='kcal'
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Streak'
							value={stats.streak}
							prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
							suffix='ngày'
						/>
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic
							title='Mục tiêu hoàn thành'
							value={stats.goalCompletionRate}
							prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
							suffix='%'
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={12}>
					<Card title='Số buổi tập theo tuần'>
						<Chart options={weeklyChartOptions} series={weeklyChartSeries} type='bar' height={280} />
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Cân nặng theo thời gian'>
						<Chart options={weightChartOptions} series={weightChartSeries} type='area' height={280} />
					</Card>
				</Col>
			</Row>

			<Card title='5 buổi tập gần nhất'>
				<Timeline>
					{recentWorkouts.map((item) => (
						<Timeline.Item key={item.id} color={item.status === 'completed' ? 'green' : 'gray'}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<strong>{formatDate(item.date)}</strong>
								<Tag color={getTypeColor(item.type)}>{item.type}</Tag>
								<span>{item.duration} phút</span>
								<span>{item.calories} kcal</span>
							</div>
							{item.notes && <div style={{ color: '#666', fontSize: 12 }}>{item.notes}</div>}
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</div>
	);
};

export default FitnessDashboard;