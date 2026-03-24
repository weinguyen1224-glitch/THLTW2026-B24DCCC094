import { Card, Col, Row, Spin, Statistic, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ThongKePage = () => {
	const {
		thongKe,
		loadingThongKe,
		fetchThongKe,
		thongKeNganh,
		thongKeKhoa,
		thongKeXepLoai,
		fetchThongKeTheoNganh,
		fetchThongKeTheoKhoa,
		fetchThongKeTheoXepLoai,
	} = useModel('totnghiep.thongke');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		Promise.all([fetchThongKe(), fetchThongKeTheoNganh(), fetchThongKeTheoKhoa(), fetchThongKeTheoXepLoai()]).finally(
			() => setLoading(false),
		);
	}, []);

	const columnsNganh = [
		{ title: 'Ngành', dataIndex: 'tenNganh' },
		{ title: 'Số lượng', dataIndex: 'soLuong', align: 'center' as const },
	];

	const columnsKhoa = [
		{ title: 'Khoa', dataIndex: 'tenKhoa' },
		{ title: 'Số lượng', dataIndex: 'soLuong', align: 'center' as const },
	];

	const columnsXepLoai = [
		{ title: 'Xếp loại', dataIndex: 'xepLoai' },
		{ title: 'Số lượng', dataIndex: 'soLuong', align: 'center' as const },
	];

	return (
		<Spin spinning={loading || loadingThongKe}>
			<Row gutter={[16, 16]}>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng hồ sơ' value={thongKe?.tongHoSo ?? 0} prefix={<FileTextOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Chờ duyệt'
							value={thongKe?.hoSoChoDuyet ?? 0}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đã duyệt'
							value={thongKe?.hoSoDaDuyet ?? 0}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Từ chối'
							value={thongKe?.hoSoTuChoi ?? 0}
							prefix={<CloseCircleOutlined />}
							valueStyle={{ color: '#ff4d4f' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title='Tổng văn bằng' value={thongKe?.tongVanBang ?? 0} prefix={<FileTextOutlined />} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đã cấp'
							value={thongKe?.vanBangDaCap ?? 0}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Chưa cấp'
							value={thongKe?.vanBangChuaCap ?? 0}
							prefix={<ClockCircleOutlined />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đã trả'
							value={thongKe?.vanBangDaTra ?? 0}
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card title='Thống kê theo ngành'>
						<Table dataSource={thongKeNganh} columns={columnsNganh} pagination={false} size='small' rowKey='tenNganh' />
					</Card>
				</Col>
				<Col span={8}>
					<Card title='Thống kê theo khoa'>
						<Table dataSource={thongKeKhoa} columns={columnsKhoa} pagination={false} size='small' rowKey='tenKhoa' />
					</Card>
				</Col>
				<Col span={8}>
					<Card title='Thống kê theo xếp loại'>
						<Table
							dataSource={thongKeXepLoai}
							columns={columnsXepLoai}
							pagination={false}
							size='small'
							rowKey='xepLoai'
						/>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default ThongKePage;
