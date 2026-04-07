import React, { useState, useEffect } from 'react';
import {
	Card,
	Row,
	Col,
	Button,
	DatePicker,
	Select,
	Modal,
	List,
	InputNumber,
	Input,
	message,
	Tag,
	Empty,
	Space,
} from 'antd';
import {
	PlusOutlined,
	DeleteOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
	DollarOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import { DiemDen, LichTrinh, NgayLichTrinh } from '@/services/dulich/typing';
import { localStorageService } from '@/services/dulich';
import moment from 'moment';
import styles from './LichTrinh.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TaoLichTrinh: React.FC = () => {
	const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
	const [lichTrinh, setLichTrinh] = useState<Partial<LichTrinh>>({
		ten: '',
		ngayBatDau: '',
		ngayKetThuc: '',
		cacNgay: [],
		tongNganSach: 0,
		tongChiPhiThucTe: 0,
		trangThai: 'dang_lap',
	});
	const [ngayChon, setNgayChon] = useState<moment.Moment[]>([]);
	const [modalThemDiemDen, setModalThemDiemDen] = useState(false);
	const [diemDenDangChon, setDiemDenDangChon] = useState<DiemDen | null>(null);
	const [ngayIndex, setNgayIndex] = useState(0);
	const [tongChiPhi, setTongChiPhi] = useState(0);

	useEffect(() => {
		localStorageService.khoiTaoDuLieuMau();
		const duLieu = localStorageService.layTatCaDiemDen();
		setDanhSachDiemDen(duLieu);
	}, []);

	useEffect(() => {
		tinhTongChiPhi();
	}, [lichTrinh.cacNgay]);

	const tinhTongChiPhi = () => {
		let tong = 0;
		lichTrinh.cacNgay?.forEach((ngay) => {
			ngay.cacDiemDen.forEach((diem) => {
				const diemDen = danhSachDiemDen.find((d) => d.id === diem.diemDenId);
				if (diemDen) {
					tong += diemDen.chiPhiAnUong + diemDen.chiPhiLuuTru + diemDen.chiPhiDiChuyen;
				}
			});
		});
		setTongChiPhi(tong);
		setLichTrinh({ ...lichTrinh, tongChiPhiThucTe: tong });
	};

	const xuLyChonNgay = (dates: any) => {
		if (dates && dates.length === 2) {
			setNgayChon(dates);
			const ngayBatDau = dates[0].format('YYYY-MM-DD');
			const ngayKetThuc = dates[1].format('YYYY-MM-DD');
			const soNgay = dates[1].diff(dates[0], 'days') + 1;

			const cacNgay: NgayLichTrinh[] = [];
			for (let i = 0; i < soNgay; i++) {
				const ngay = dates[0].clone().add(i, 'days');
				cacNgay.push({
					ngay: ngay.format('YYYY-MM-DD'),
					cacDiemDen: [],
				});
			}

			setLichTrinh({
				...lichTrinh,
				ngayBatDau,
				ngayKetThuc,
				cacNgay,
			});
		}
	};

	const moModalThemDiemDen = (index: number) => {
		setNgayIndex(index);
		setModalThemDiemDen(true);
	};

	const themDiemDenVaoNgay = () => {
		if (!diemDenDangChon) {
			message.warning('Vui lòng chọn điểm đến');
			return;
		}

		const cacNgayMoi = [...(lichTrinh.cacNgay || [])];
		const ngayHienTai = cacNgayMoi[ngayIndex];
		const thuTuMoi = ngayHienTai.cacDiemDen.length + 1;

		ngayHienTai.cacDiemDen.push({
			diemDenId: diemDenDangChon.id,
			thuTu: thuTuMoi,
		});

		setLichTrinh({ ...lichTrinh, cacNgay: cacNgayMoi });
		setModalThemDiemDen(false);
		setDiemDenDangChon(null);
		message.success('Đã thêm điểm đến vào lịch trình');
	};

	const xoaDiemDen = (ngayIndex: number, diemIndex: number) => {
		const cacNgayMoi = [...(lichTrinh.cacNgay || [])];
		cacNgayMoi[ngayIndex].cacDiemDen.splice(diemIndex, 1);

		capNhatThuTu(cacNgayMoi);
		setLichTrinh({ ...lichTrinh, cacNgay: cacNgayMoi });
		message.success('Đã xóa điểm đến');
	};

	const capNhatThuTu = (cacNgay: NgayLichTrinh[]) => {
		cacNgay.forEach((ngay) => {
			ngay.cacDiemDen.forEach((diem, index) => {
				diem.thuTu = index + 1;
			});
		});
	};

	const diChuyenDiemDen = (ngayIndex: number, diemIndex: number, huong: 'len' | 'xuong') => {
		const cacNgayMoi = [...(lichTrinh.cacNgay || [])];
		const cacDiemDen = cacNgayMoi[ngayIndex].cacDiemDen;

		if (huong === 'len' && diemIndex > 0) {
			[cacDiemDen[diemIndex], cacDiemDen[diemIndex - 1]] = [cacDiemDen[diemIndex - 1], cacDiemDen[diemIndex]];
		} else if (huong === 'xuong' && diemIndex < cacDiemDen.length - 1) {
			[cacDiemDen[diemIndex], cacDiemDen[diemIndex + 1]] = [cacDiemDen[diemIndex + 1], cacDiemDen[diemIndex]];
		}

		capNhatThuTu(cacNgayMoi);
		setLichTrinh({ ...lichTrinh, cacNgay: cacNgayMoi });
	};

	const luuLichTrinh = () => {
		if (!lichTrinh.ten) {
			message.error('Vui lòng nhập tên lịch trình');
			return;
		}

		if (!lichTrinh.ngayBatDau || !lichTrinh.ngayKetThuc) {
			message.error('Vui lòng chọn ngày bắt đầu và kết thúc');
			return;
		}

		if (!lichTrinh.cacNgay || lichTrinh.cacNgay.length === 0) {
			message.error('Vui lòng chọn ít nhất một ngày');
			return;
		}

		const coDiemDen = lichTrinh.cacNgay.some((ngay) => ngay.cacDiemDen.length > 0);
		if (!coDiemDen) {
			message.error('Vui lòng thêm ít nhất một điểm đến');
			return;
		}

		const lichTrinhMoi = localStorageService.themLichTrinh({
			ten: lichTrinh.ten,
			ngayBatDau: lichTrinh.ngayBatDau,
			ngayKetThuc: lichTrinh.ngayKetThuc,
			cacNgay: lichTrinh.cacNgay,
			tongNganSach: lichTrinh.tongNganSach || 0,
			tongChiPhiThucTe: tongChiPhi,
			trangThai: 'dang_lap',
		});

		localStorageService.taoNganSach(lichTrinhMoi.id, lichTrinh.tongNganSach || 0);

		message.success('Đã lưu lịch trình thành công');
		resetForm();
	};

	const resetForm = () => {
		setLichTrinh({
			ten: '',
			ngayBatDau: '',
			ngayKetThuc: '',
			cacNgay: [],
			tongNganSach: 0,
			tongChiPhiThucTe: 0,
			trangThai: 'dang_lap',
		});
		setNgayChon([]);
		setTongChiPhi(0);
	};

	const dinhDangTien = (soTien: number): string => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
	};

	const dinhDangNgay = (ngay: string): string => {
		return moment(ngay).format('DD/MM/YYYY');
	};

	const layDiemDenTheoId = (id: string): DiemDen | undefined => {
		return danhSachDiemDen.find((d) => d.id === id);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Tạo lịch trình du lịch</h1>
				<p>Lên kế hoạch cho chuyến đi của bạn</p>
			</div>

			<Card className={styles.formCard}>
				<Row gutter={[16, 16]}>
					<Col xs={24} md={12}>
						<div className={styles.formGroup}>
							<label>Tên lịch trình *</label>
							<Input
								placeholder='Nhập tên lịch trình'
								value={lichTrinh.ten}
								onChange={(e) => setLichTrinh({ ...lichTrinh, ten: e.target.value })}
							/>
						</div>
					</Col>
					<Col xs={24} md={12}>
						<div className={styles.formGroup}>
							<label>Ngày đi *</label>
							<RangePicker
								style={{ width: '100%' }}
								value={ngayChon as any}
								onChange={xuLyChonNgay}
								format='DD/MM/YYYY'
							/>
						</div>
					</Col>
					<Col xs={24} md={12}>
						<div className={styles.formGroup}>
							<label>Ngân sách dự kiến</label>
							<InputNumber
								style={{ width: '100%' }}
								placeholder='Nhập ngân sách'
								min={0}
								step={100000}
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
								value={lichTrinh.tongNganSach}
								onChange={(value) => setLichTrinh({ ...lichTrinh, tongNganSach: value || 0 })}
							/>
						</div>
					</Col>
				</Row>
			</Card>

			{lichTrinh.cacNgay && lichTrinh.cacNgay.length > 0 && (
				<div className={styles.daysContainer}>
					<h2>Lịch trình chi tiết</h2>
					<Row gutter={[16, 16]}>
						{lichTrinh.cacNgay.map((ngay, index) => (
							<Col xs={24} md={12} lg={8} key={index}>
								<Card
									title={
										<div className={styles.dayTitle}>
											<CalendarOutlined />
											<span>Ngày {index + 1}</span>
											<Tag color='blue'>{dinhDangNgay(ngay.ngay)}</Tag>
										</div>
									}
									extra={
										<Button
											type='primary'
											size='small'
											icon={<PlusOutlined />}
											onClick={() => moModalThemDiemDen(index)}
										>
											Thêm
										</Button>
									}
									className={styles.dayCard}
								>
									{ngay.cacDiemDen.length === 0 ? (
										<Empty description='Chưa có điểm đến' image={Empty.PRESENTED_IMAGE_SIMPLE} />
									) : (
										<List
											dataSource={ngay.cacDiemDen}
											renderItem={(diem, diemIndex) => {
												const diemDen = layDiemDenTheoId(diem.diemDenId);
												return (
													<List.Item
														actions={[
															<Button
																type='text'
																size='small'
																icon={<SwapOutlined />}
																onClick={() => diChuyenDiemDen(index, diemIndex, 'len')}
																disabled={diemIndex === 0}
															/>,
															<Button
																type='text'
																size='small'
																icon={<SwapOutlined />}
																onClick={() => diChuyenDiemDen(index, diemIndex, 'xuong')}
																disabled={diemIndex === ngay.cacDiemDen.length - 1}
															/>,
															<Button
																type='text'
																danger
																size='small'
																icon={<DeleteOutlined />}
																onClick={() => xoaDiemDen(index, diemIndex)}
															/>,
														]}
													>
														<List.Item.Meta
															title={
																<div className={styles.diemDenTitle}>
																	<span>{diemDen?.ten}</span>
																	<Tag color='green'>{diem.thuTu}</Tag>
																</div>
															}
															description={
																<div className={styles.diemDenInfo}>
																	<div>
																		<ClockCircleOutlined /> {diemDen?.thoiGianThamQuan} phút
																	</div>
																	<div>
																		<DollarOutlined />{' '}
																		{dinhDangTien(
																			(diemDen?.chiPhiAnUong || 0) +
																				(diemDen?.chiPhiLuuTru || 0) +
																				(diemDen?.chiPhiDiChuyen || 0),
																		)}
																	</div>
																</div>
															}
														/>
													</List.Item>
												);
											}}
										/>
									)}
								</Card>
							</Col>
						))}
					</Row>
				</div>
			)}

			{tongChiPhi > 0 && (
				<Card className={styles.summaryCard}>
					<Row gutter={[16, 16]}>
						<Col xs={12} md={6}>
							<div className={styles.summaryItem}>
								<div className={styles.summaryLabel}>Tổng chi phí</div>
								<div className={styles.summaryValue}>{dinhDangTien(tongChiPhi)}</div>
							</div>
						</Col>
						<Col xs={12} md={6}>
							<div className={styles.summaryItem}>
								<div className={styles.summaryLabel}>Ngân sách</div>
								<div className={styles.summaryValue}>{dinhDangTien(lichTrinh.tongNganSach || 0)}</div>
							</div>
						</Col>
						<Col xs={12} md={6}>
							<div className={styles.summaryItem}>
								<div className={styles.summaryLabel}>Còn lại</div>
								<div
									className={`${styles.summaryValue} ${
										(lichTrinh.tongNganSach || 0) - tongChiPhi >= 0 ? styles.positive : styles.negative
									}`}
								>
									{dinhDangTien((lichTrinh.tongNganSach || 0) - tongChiPhi)}
								</div>
							</div>
						</Col>
						<Col xs={12} md={6}>
							<div className={styles.summaryItem}>
								<div className={styles.summaryLabel}>Số ngày</div>
								<div className={styles.summaryValue}>{lichTrinh.cacNgay?.length || 0} ngày</div>
							</div>
						</Col>
					</Row>
				</Card>
			)}

			<div className={styles.actions}>
				<Space>
					<Button size='large' onClick={resetForm}>
						Làm mới
					</Button>
					<Button type='primary' size='large' onClick={luuLichTrinh}>
						Lưu lịch trình
					</Button>
				</Space>
			</div>

			<Modal
				title='Thêm điểm đến'
				visible={modalThemDiemDen}
				onOk={themDiemDenVaoNgay}
				onCancel={() => {
					setModalThemDiemDen(false);
					setDiemDenDangChon(null);
				}}
				width={800}
			>
				<Select
					showSearch
					style={{ width: '100%' }}
					placeholder='Chọn điểm đến'
					optionFilterProp='children'
					value={diemDenDangChon?.id}
					onChange={(value) => {
						const diemDen = danhSachDiemDen.find((d) => d.id === value);
						setDiemDenDangChon(diemDen || null);
					}}
					filterOption={(input, option) =>
						String(option?.children || '')
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
				>
					{danhSachDiemDen.map((diemDen) => (
						<Option key={diemDen.id} value={diemDen.id}>
							{diemDen.ten} - {dinhDangTien(diemDen.giaMin)} - {diemDen.rating} sao
						</Option>
					))}
				</Select>

				{diemDenDangChon && (
					<Card style={{ marginTop: 16 }}>
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<img
									src={diemDenDangChon.hinhAnh}
									alt={diemDenDangChon.ten}
									style={{ width: '100%', borderRadius: 8 }}
								/>
							</Col>
							<Col span={12}>
								<h3>{diemDenDangChon.ten}</h3>
								<p>{diemDenDangChon.moTa}</p>
								<p>
									<strong>Địa chỉ:</strong> {diemDenDangChon.diaChi}
								</p>
								<p>
									<strong>Thời gian tham quan:</strong> {diemDenDangChon.thoiGianThamQuan} phút
								</p>
								<p>
									<strong>Chi phí ăn uống:</strong> {dinhDangTien(diemDenDangChon.chiPhiAnUong)}
								</p>
								<p>
									<strong>Chi phí lưu trú:</strong> {dinhDangTien(diemDenDangChon.chiPhiLuuTru)}
								</p>
								<p>
									<strong>Chi phí di chuyển:</strong> {dinhDangTien(diemDenDangChon.chiPhiDiChuyen)}
								</p>
							</Col>
						</Row>
					</Card>
				)}
			</Modal>
		</div>
	);
};

export default TaoLichTrinh;
