import { Card, DatePicker, Row, Col, Statistic, Table } from 'antd';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { DollarOutlined, CalendarOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

import { getListLichHen } from '@/services/QuanLySalon/LichHen';
import { getAll as getAllNhanVien } from '@/services/QuanLySalon/NhanVien';
import { getAll as getAllDichVu } from '@/services/QuanLySalon/DichVu';
import { getAll as getAllDanhGia } from '@/services/QuanLySalon/DanhGia';

const { RangePicker } = DatePicker;

const ThongKePage = () => {
	const [loading, setLoading] = useState(false);
	const [dateRange, setDateRange] = useState<any>([moment().startOf('month'), moment().endOf('month')]);
	const [thongKeLichHen, setThongKeLichHen] = useState<any>({});
	const [thongKeDoanhThu, setThongKeDoanhThu] = useState<any[]>([]);
	const [thongKeNhanVien, setThongKeNhanVien] = useState<any[]>([]);

	useEffect(() => {
		loadData();
	}, [dateRange]);

	const loadData = async () => {
		setLoading(true);
		try {
			const [ngayBatDau, ngayKetThuc] = dateRange;
			const startDate = ngayBatDau.format('YYYY-MM-DD');
			const endDate = ngayKetThuc.format('YYYY-MM-DD');

			const [lichHenRes, nhanVienRes, dichVuRes, danhGiaRes] = await Promise.all([
				getListLichHen({}),
				getAllNhanVien({}),
				getAllDichVu({}),
				getAllDanhGia(),
			]);

			const lichHenData = lichHenRes?.data?.data?.result || [];
			const nhanVienData = nhanVienRes?.data?.data || [];
			const dichVuData = dichVuRes?.data?.data || [];
			const danhGiaData = danhGiaRes?.data?.data || [];

			const filteredLichHen = lichHenData.filter((lich: any) => {
				return lich.ngayHen >= startDate && lich.ngayHen <= endDate;
			});

			const tongLichHen = filteredLichHen.length;
			const lichHoanThanh = filteredLichHen.filter((l: any) => l.trangThai === 'hoanThanh').length;
			const lichHuy = filteredLichHen.filter((l: any) => l.trangThai === 'huy').length;

			const doanhThuByDichVu: Record<string, any> = {};
			let tongDoanhThu = 0;

			filteredLichHen.forEach((lich: any) => {
				if (lich.trangThai === 'hoanThanh' && lich.dichVuId) {
					const dichVu = dichVuData.find((dv: any) => dv._id === lich.dichVuId);
					if (dichVu) {
						if (!doanhThuByDichVu[lich.dichVuId]) {
							doanhThuByDichVu[lich.dichVuId] = {
								dichVuId: lich.dichVuId,
								tenDichVu: dichVu.ten,
								soLuong: 0,
								doanhThu: 0,
							};
						}
						doanhThuByDichVu[lich.dichVuId].soLuong++;
						doanhThuByDichVu[lich.dichVuId].doanhThu += dichVu.gia;
						tongDoanhThu += dichVu.gia;
					}
				}
			});

			const doanhThuArray = Object.values(doanhThuByDichVu).map((item: any) => ({
				...item,
				tyTrong: tongDoanhThu > 0 ? Math.round((item.doanhThu / tongDoanhThu) * 100) : 0,
			}));

			const nhanVienStats: Record<string, any> = {};
			filteredLichHen.forEach((lich: any) => {
				if (lich.nhanVienId) {
					if (!nhanVienStats[lich.nhanVienId]) {
						const nhanVien = nhanVienData.find((nv: any) => nv._id === lich.nhanVienId);
						const danhGia = danhGiaData.filter((dg: any) => dg.nhanVienId === lich.nhanVienId);
						const avgSao =
							danhGia.length > 0 ? danhGia.reduce((sum: number, dg: any) => sum + dg.soSao, 0) / danhGia.length : 0;

						nhanVienStats[lich.nhanVienId] = {
							nhanVienId: lich.nhanVienId,
							tenNhanVien: nhanVien?.ten || lich.nhanVienId,
							soLichHen: 0,
							doanhThu: 0,
							danhGiaTrungBinh: avgSao,
						};
					}
					nhanVienStats[lich.nhanVienId].soLichHen++;
					if (lich.trangThai === 'hoanThanh' && lich.dichVuId) {
						const dichVu = dichVuData.find((dv: any) => dv._id === lich.dichVuId);
						if (dichVu) {
							nhanVienStats[lich.nhanVienId].doanhThu += dichVu.gia;
						}
					}
				}
			});

			const nhanVienArray = Object.values(nhanVienStats);

			setThongKeLichHen({
				tongLichHen,
				lichHoanThanh,
				lichHuy,
				tongDoanhThu,
			});
			setThongKeDoanhThu(doanhThuArray);
			setThongKeNhanVien(nhanVienArray);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	const columnsDoanhThu = [
		{
			title: 'Dịch vụ',
			dataIndex: 'tenDichVu',
			width: 200,
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			width: 100,
			align: 'center' as const,
		},
		{
			title: 'Doanh thu (VNĐ)',
			dataIndex: 'doanhThu',
			width: 150,
			align: 'right' as const,
			render: (val: number) => new Intl.NumberFormat('vi-VN').format(val),
		},
		{
			title: 'Tỷ trọng (%)',
			dataIndex: 'tyTrong',
			width: 100,
			align: 'center' as const,
		},
	];

	const columnsNhanVien = [
		{
			title: 'Nhân viên',
			dataIndex: 'tenNhanVien',
			width: 180,
		},
		{
			title: 'Số lịch hẹn',
			dataIndex: 'soLichHen',
			width: 100,
			align: 'center' as const,
		},
		{
			title: 'Doanh thu (VNĐ)',
			dataIndex: 'doanhThu',
			width: 150,
			align: 'right' as const,
			render: (val: number) => new Intl.NumberFormat('vi-VN').format(val),
		},
		{
			title: 'Đánh giá TB',
			dataIndex: 'danhGiaTrungBinh',
			width: 120,
			align: 'center' as const,
			render: (val: number) => (val ? `${val.toFixed(1)} ★` : '-'),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card>
						<Row gutter={16} align='middle'>
							<Col>
								<span style={{ marginRight: 8 }}>Thời gian:</span>
							</Col>
							<Col>
								<RangePicker
									value={dateRange}
									onChange={(dates) => {
										if (dates && dates[0] && dates[1]) {
											setDateRange(dates);
										}
									}}
									format='DD/MM/YYYY'
								/>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Tổng lịch hẹn' value={thongKeLichHen.tongLichHen || 0} prefix={<CalendarOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Lịch hoàn thành' value={thongKeLichHen.lichHoanThanh || 0} prefix={<CheckOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic title='Lịch hủy' value={thongKeLichHen.lichHuy || 0} prefix={<CloseOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} md={6}>
					<Card>
						<Statistic
							title='Doanh thu (VNĐ)'
							value={thongKeLichHen.tongDoanhThu || 0}
							prefix={<DollarOutlined />}
							formatter={(value) => new Intl.NumberFormat('vi-VN').format(Number(value))}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title='Doanh thu theo dịch vụ' loading={loading}>
						<Table
							columns={columnsDoanhThu}
							dataSource={thongKeDoanhThu}
							pagination={false}
							rowKey={(record: any) => record.dichVuId}
							size='small'
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Thống kê theo nhân viên' loading={loading}>
						<Table
							columns={columnsNhanVien}
							dataSource={thongKeNhanVien}
							pagination={false}
							rowKey={(record: any) => record.nhanVienId}
							size='small'
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ThongKePage;
