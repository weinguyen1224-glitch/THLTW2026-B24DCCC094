import { Card, Col, Row, Statistic, Table, Tag, Space } from 'antd';
import {
	TeamOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ClockCircleOutlined,
	BarChartOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import ColumnChart from '@/components/Chart/ColumnChart';
import moment from 'moment';

interface ThongKeTongQuan {
	soCLB: number;
	soDonPending: number;
	soDonApproved: number;
	soDonRejected: number;
	soThanhVien: number;
}

interface ThongKeTheoCLB {
	key: string;
	tenCLB: string;
	pending: number;
	approved: number;
	rejected: number;
	tong: number;
}

const BaoCaoThongKePage = () => {
	const [thongKeTongQuan, setThongKeTongQuan] = useState<ThongKeTongQuan>({
		soCLB: 0,
		soDonPending: 0,
		soDonApproved: 0,
		soDonRejected: 0,
		soThanhVien: 0,
	});
	const [thongKeTheoCLB, setThongKeTheoCLB] = useState<ThongKeTheoCLB[]>([]);
	const [chartData, setChartData] = useState<{ xAxis: string[]; yAxis: number[][]; yLabel: string[] }>({
		xAxis: [],
		yAxis: [[], [], []],
		yLabel: ['Đang chờ', 'Đã duyệt', 'Từ chối'],
	});

	const loadThongKe = () => {
		// Load data from localStorage
		const cauLacBoData = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		const donDangKyData = JSON.parse(localStorage.getItem('dondangky') || '[]');
		const thanhVienData = JSON.parse(localStorage.getItem('thanhvien') || '[]');

		// Tính tổng quan
		const soDonPending = donDangKyData.filter((d: DonDangKy.IRecord) => d.trangThai === 'Pending').length;
		const soDonApproved = donDangKyData.filter((d: DonDangKy.IRecord) => d.trangThai === 'Approved').length;
		const soDonRejected = donDangKyData.filter((d: DonDangKy.IRecord) => d.trangThai === 'Rejected').length;
		const soThanhVien = thanhVienData.filter((t: ThanhVien.IRecord) => t.trangThai === 'Active').length;

		setThongKeTongQuan({
			soCLB: cauLacBoData.length,
			soDonPending,
			soDonApproved,
			soDonRejected,
			soThanhVien,
		});

		// Thống kê theo câu lạc bộ
		const thongKeMap = new Map<string, ThongKeTheoCLB>();

		// Khởi tạo cho tất cả câu lạc bộ
		cauLacBoData.forEach((clb: CauLacBo.IRecord) => {
			thongKeMap.set(clb._id, {
				key: clb._id,
				tenCLB: clb.ten,
				pending: 0,
				approved: 0,
				rejected: 0,
				tong: 0,
			});
		});

		// Đếm số đơn theo từng câu lạc bộ
		donDangKyData.forEach((don: DonDangKy.IRecord) => {
			const existing = thongKeMap.get(don.cauLacBoId) || {
				key: don.cauLacBoId,
				tenCLB: don.cauLacBoTen || 'Không xác định',
				pending: 0,
				approved: 0,
				rejected: 0,
				tong: 0,
			};

			if (don.trangThai === 'Pending') existing.pending++;
			else if (don.trangThai === 'Approved') existing.approved++;
			else if (don.trangThai === 'Rejected') existing.rejected++;
			existing.tong++;

			thongKeMap.set(don.cauLacBoId, existing);
		});

		const thongKeArray = Array.from(thongKeMap.values());
		setThongKeTheoCLB(thongKeArray);

		// Dữ liệu cho chart
		const xAxis = thongKeArray.map((item) => item.tenCLB);
		const pendingData = thongKeArray.map((item) => item.pending);
		const approvedData = thongKeArray.map((item) => item.approved);
		const rejectedData = thongKeArray.map((item) => item.rejected);

		setChartData({
			xAxis,
			yAxis: [pendingData, approvedData, rejectedData],
			yLabel: ['Đang chờ', 'Đã duyệt', 'Từ chối'],
		});
	};

	useEffect(() => {
		loadThongKe();
	}, []);

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			width: 60,
			align: 'center' as const,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCLB',
			width: 200,
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Đang chờ',
			dataIndex: 'pending',
			width: 100,
			align: 'center' as const,
			render: (text: number) => <Tag color='orange'>{text}</Tag>,
		},
		{
			title: 'Đã duyệt',
			dataIndex: 'approved',
			width: 100,
			align: 'center' as const,
			render: (text: number) => <Tag color='green'>{text}</Tag>,
		},
		{
			title: 'Từ chối',
			dataIndex: 'rejected',
			width: 100,
			align: 'center' as const,
			render: (text: number) => <Tag color='red'>{text}</Tag>,
		},
		{
			title: 'Tổng cộng',
			dataIndex: 'tong',
			width: 100,
			align: 'center' as const,
			render: (text: number) => <Tag color='blue'>{text}</Tag>,
		},
	];

	return (
		<Card
			title={
				<Space>
					<BarChartOutlined />
					Báo cáo và thống kê
				</Space>
			}
		>
			{/* Thống kê tổng quan */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} md={8} lg={4}>
					<Card>
						<Statistic
							title='Số câu lạc bộ'
							value={thongKeTongQuan.soCLB}
							prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={5}>
					<Card>
						<Statistic
							title='Số đơn đăng ký (Tổng)'
							value={thongKeTongQuan.soDonPending + thongKeTongQuan.soDonApproved + thongKeTongQuan.soDonRejected}
							prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={5}>
					<Card>
						<Statistic
							title='Đơn đang chờ'
							value={thongKeTongQuan.soDonPending}
							prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
							valueStyle={{ color: '#fa8c16' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={5}>
					<Card>
						<Statistic
							title='Đơn đã duyệt'
							value={thongKeTongQuan.soDonApproved}
							prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={5}>
					<Card>
						<Statistic
							title='Đơn từ chối'
							value={thongKeTongQuan.soDonRejected}
							prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Biểu đồ thống kê */}
			<Card title='Biểu đồ số đơn đăng ký theo câu lạc bộ' style={{ marginBottom: 24 }}>
				<ColumnChart
					title='Số đơn đăng ký theo câu lạc bộ'
					xAxis={chartData.xAxis}
					yAxis={chartData.yAxis}
					yLabel={chartData.yLabel}
					colors={['#fa8c16', '#52c41a', '#ff4d4f']}
					height={350}
					formatY={(val) => `${val}`}
				/>
			</Card>

			{/* Bảng thống kê chi tiết */}
			<Card title='Bảng thống kê chi tiết theo câu lạc bộ'>
				<Table
					columns={columns}
					dataSource={thongKeTheoCLB.map((item, index) => ({
						...item,
						index: index + 1,
					}))}
					pagination={false}
					summary={(pageData) => {
						let totalPending = 0;
						let totalApproved = 0;
						let totalRejected = 0;
						let totalTong = 0;

						pageData.forEach(({ pending, approved, rejected, tong }) => {
							totalPending += pending;
							totalApproved += approved;
							totalRejected += rejected;
							totalTong += tong;
						});

						return (
							<Table.Summary.Row>
								<Table.Summary.Cell index={0} colSpan={2}>
									<strong>Tổng cộng</strong>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={2} align='center'>
									<Tag color='orange'>{totalPending}</Tag>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={3} align='center'>
									<Tag color='green'>{totalApproved}</Tag>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={4} align='center'>
									<Tag color='red'>{totalRejected}</Tag>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={5} align='center'>
									<Tag color='blue'>{totalTong}</Tag>
								</Table.Summary.Cell>
							</Table.Summary.Row>
						);
					}}
					locale={{ emptyText: 'Không có dữ liệu' }}
				/>
			</Card>

			{/* Footer info */}
			<div style={{ marginTop: 16, textAlign: 'right', color: '#888', fontSize: 12 }}>
				Cập nhật lúc: {moment().format('HH:mm DD/MM/YYYY')}
			</div>
		</Card>
	);
};

export default BaoCaoThongKePage;
