import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Table, Tag, Alert, Progress, Statistic } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'react-apexcharts';
import { DollarOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { LichTrinh, NganSach, LoaiChiPhi } from '@/services/dulich/typing';
import { localStorageService } from '@/services/dulich';
import styles from './NganSach.less';

const { Option } = Select;

const MAU_BIEU_DO = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const MUC_TIEU_THEO_LOAI: Record<LoaiChiPhi, string> = {
	an_uong: 'Ăn uống',
	di_chuyen: 'Di chuyển',
	luu_tru: 'Lưu trú',
	giai_tri: 'Giải trí',
	khac: 'Khác',
};

const QuanLyNganSach: React.FC = () => {
	const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<LichTrinh[]>([]);
	const [lichTrinhChon, setLichTrinhChon] = useState<string>('');
	const [nganSach, setNganSach] = useState<NganSach | null>(null);
	const [duLieuBieuDo, setDuLieuBieuDo] = useState<any>({ series: [], labels: [] });

	useEffect(() => {
		const duLieu = localStorageService.layTatCaLichTrinh();
		setDanhSachLichTrinh(duLieu);
		if (duLieu.length > 0) {
			setLichTrinhChon(duLieu[0].id);
		}
	}, []);

	useEffect(() => {
		if (lichTrinhChon) {
			const ns = localStorageService.layNganSach(lichTrinhChon);
			if (ns) {
				setNganSach(ns);
				capNhatBieuDo(ns);
			} else {
				const lichTrinh = danhSachLichTrinh.find((lt) => lt.id === lichTrinhChon);
				if (lichTrinh) {
					const nsMoi = localStorageService.taoNganSach(lichTrinhChon, lichTrinh.tongNganSach);
					setNganSach(nsMoi);
					capNhatBieuDo(nsMoi);
				}
			}
		}
	}, [lichTrinhChon, danhSachLichTrinh]);

	const capNhatBieuDo = (ngansach: NganSach) => {
		const series: number[] = [];
		const labels: string[] = [];

		Object.entries(ngansach.chiPhiTheoLoai).forEach(([loai, soTien]) => {
			if (soTien > 0) {
				series.push(soTien);
				labels.push(MUC_TIEU_THEO_LOAI[loai as LoaiChiPhi] || loai);
			}
		});

		if (series.length === 0) {
			series.push(1);
			labels.push('Chưa chi');
		}

		setDuLieuBieuDo({ series, labels });
	};

	const dinhDangTien = (soTien: number): string => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
	};

	const tinhPhanTram = (daChi: number, tong: number): number => {
		if (tong === 0) return 0;
		return Math.round((daChi / tong) * 100);
	};

	const layBangLoaiChiPhi = () => {
		if (!nganSach) return [];
		return Object.entries(nganSach.chiPhiTheoLoai).map(([loai, soTien]) => ({
			key: loai,
			loai: MUC_TIEU_THEO_LOAI[loai as LoaiChiPhi] || loai,
			soTien: soTien,
			phanTram: tinhPhanTram(soTien, nganSach!.tongNganSach),
		}));
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Quản lý ngân sách</h1>
				<p>Theo dõi và quản lý chi phí chuyến đi</p>
			</div>

			<Card className={styles.selectCard}>
				<Select
					style={{ width: '100%', maxWidth: 400 }}
					placeholder='Chọn lịch trình'
					value={lichTrinhChon}
					onChange={setLichTrinhChon}
				>
					{danhSachLichTrinh.map((lt) => (
						<Option key={lt.id} value={lt.id}>
							{lt.ten} ({lt.ngayBatDau} - {lt.ngayKetThuc})
						</Option>
					))}
				</Select>
			</Card>

			{nganSach && (
				<>
					{nganSach.vuotNganSach && (
						<Alert
							message='Cảnh báo vượt ngân sách'
							description={`Bạn đã chi ${dinhDangTien(nganSach.daChi)} vượt quá ngân sách ${dinhDangTien(
								nganSach.tongNganSach,
							)}`}
							type='error'
							showIcon
							icon={<WarningOutlined />}
							className={styles.alert}
						/>
					)}

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Card className={styles.statCard}>
								<Statistic
									title='Tổng ngân sách'
									value={nganSach.tongNganSach}
									precision={0}
									formatter={(value) => dinhDangTien(Number(value))}
									prefix={<DollarOutlined />}
									valueStyle={{ color: '#1890ff' }}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card className={styles.statCard}>
								<Statistic
									title='Đã chi'
									value={nganSach.daChi}
									precision={0}
									formatter={(value) => dinhDangTien(Number(value))}
									prefix={<DollarOutlined />}
									valueStyle={{ color: '#faad14' }}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card className={styles.statCard}>
								<Statistic
									title='Còn lại'
									value={nganSach.conLai}
									precision={0}
									formatter={(value) => dinhDangTien(Number(value))}
									prefix={<DollarOutlined />}
									valueStyle={{
										color: nganSach.conLai >= 0 ? '#52c41a' : '#f5222d',
									}}
								/>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card className={styles.statCard}>
								<Statistic
									title='Tiến độ'
									value={tinhPhanTram(nganSach.daChi, nganSach.tongNganSach)}
									suffix='%'
									valueStyle={{
										color: tinhPhanTram(nganSach.daChi, nganSach.tongNganSach) > 100 ? '#f5222d' : '#52c41a',
									}}
								/>
								<Progress
									percent={tinhPhanTram(nganSach.daChi, nganSach.tongNganSach)}
									strokeColor={tinhPhanTram(nganSach.daChi, nganSach.tongNganSach) > 100 ? '#f5222d' : '#52c41a'}
									showInfo={false}
								/>
							</Card>
						</Col>
					</Row>

					<Row gutter={[16, 16]} style={{ marginTop: 24 }}>
						<Col xs={24} lg={12}>
							<Card title='Phân bổ ngân sách theo hạng mục' className={styles.chartCard}>
								<ResponsiveContainer width='100%' height={300}>
									<PieChart>
										<Pie
											data={duLieuBieuDo.series.map((value, index) => ({
												value,
												name: duLieuBieuDo.labels[index],
											}))}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={100}
											dataKey='value'
											label
										>
											{duLieuBieuDo.series.map((entry: any, index: number) => (
												<Cell key={`cell-${index}`} fill={MAU_BIEU_DO[index % MAU_BIEU_DO.length]} />
											))}
										</Pie>
										<Tooltip formatter={(value: number) => dinhDangTien(value)} />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</Card>
						</Col>
						<Col xs={24} lg={12}>
							<Card title='Chi tiết theo hạng mục' className={styles.tableCard}>
								<Table
									dataSource={layBangLoaiChiPhi()}
									columns={[
										{ title: 'Hạng mục', dataIndex: 'loai', key: 'loai' },
										{
											title: 'Số tiền',
											dataIndex: 'soTien',
											key: 'soTien',
											render: (soTien: number) => dinhDangTien(soTien),
										},
										{
											title: 'Tỷ trọng',
											dataIndex: 'phanTram',
											key: 'phanTram',
											render: (phanTram: number) => <Progress percent={phanTram} size='small' showInfo={false} />,
										},
									]}
									pagination={false}
								/>
							</Card>
						</Col>
					</Row>

					{!nganSach.vuotNganSach && nganSach.conLai > 0 && (
						<Alert
							message='Ngân sách còn dư'
							description={`Bạn còn ${dinhDangTien(nganSach.conLai)} để sử dụng`}
							type='success'
							showIcon
							icon={<CheckCircleOutlined />}
							className={styles.alert}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default QuanLyNganSach;
