import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Slider, Button, Rate, Tag, Empty, Input } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { DiemDen, LoaiDiemDen } from '@/services/dulich/typing';
import { localStorageService } from '@/services/dulich';
import styles from './index.less';

const { Option } = Select;
const { Search } = Input;

interface DieuKienLoc {
	loai?: string;
	giaMin?: number;
	giaMax?: number;
	ratingMin?: number;
	tuKhoa?: string;
}

const TrangChu: React.FC = () => {
	const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
	const [danhSachLoc, setDanhSachLoc] = useState<DiemDen[]>([]);
	const [dieuKienLoc, setDieuKienLoc] = useState<DieuKienLoc>({});
	const [tieuChiSapXep, setTieuChiSapXep] = useState<'gia' | 'rating'>('rating');
	const [thuTuSapXep, setThuTuSapXep] = useState<'tang' | 'giam'>('giam');

	useEffect(() => {
		localStorageService.khoiTaoDuLieuMau();
		const duLieu = localStorageService.layTatCaDiemDen();
		setDanhSachDiemDen(duLieu);
		setDanhSachLoc(duLieu);
	}, []);

	useEffect(() => {
		let ketQua = danhSachDiemDen;

		if (dieuKienLoc.tuKhoa) {
			ketQua = ketQua.filter(
				(item) =>
					item.ten.toLowerCase().includes(dieuKienLoc.tuKhoa!.toLowerCase()) ||
					item.diaChi.toLowerCase().includes(dieuKienLoc.tuKhoa!.toLowerCase()),
			);
		}

		if (dieuKienLoc.loai) {
			ketQua = ketQua.filter((item) => item.loai === dieuKienLoc.loai);
		}

		if (dieuKienLoc.giaMin !== undefined) {
			ketQua = ketQua.filter((item) => item.giaMin >= dieuKienLoc.giaMin!);
		}

		if (dieuKienLoc.giaMax !== undefined) {
			ketQua = ketQua.filter((item) => item.giaMax <= dieuKienLoc.giaMax!);
		}

		if (dieuKienLoc.ratingMin !== undefined) {
			ketQua = ketQua.filter((item) => item.rating >= dieuKienLoc.ratingMin!);
		}

		ketQua = localStorageService.sapXepDiemDen(ketQua, tieuChiSapXep, thuTuSapXep);
		setDanhSachLoc(ketQua);
	}, [dieuKienLoc, tieuChiSapXep, thuTuSapXep, danhSachDiemDen]);

	const xoaLoc = () => {
		setDieuKienLoc({});
		setTieuChiSapXep('rating');
		setThuTuSapXep('giam');
	};

	const layMauLoai = (loai: string): string => {
		switch (loai) {
			case LoaiDiemDen.BIEN:
				return 'blue';
			case LoaiDiemDen.NUI:
				return 'green';
			case LoaiDiemDen.THANH_PHO:
				return 'orange';
			default:
				return 'default';
		}
	};

	const layTenLoai = (loai: string): string => {
		switch (loai) {
			case LoaiDiemDen.BIEN:
				return 'Biển';
			case LoaiDiemDen.NUI:
				return 'Núi';
			case LoaiDiemDen.THANH_PHO:
				return 'Thành phố';
			default:
				return loai;
		}
	};

	const dinhDangTien = (soTien: number): string => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Khám phá điểm đến</h1>
				<p>Tìm kiếm và khám phá những địa điểm du lịch tuyệt đẹp tại Việt Nam</p>
			</div>

			<div className={styles.filterSection}>
				<Card className={styles.filterCard}>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Search
								placeholder='Tìm kiếm điểm đến...'
								allowClear
								enterButton={<SearchOutlined />}
								size='large'
								onChange={(e) => setDieuKienLoc({ ...dieuKienLoc, tuKhoa: e.target.value })}
							/>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Select
								placeholder='Loại hình'
								size='large'
								style={{ width: '100%' }}
								allowClear
								onChange={(value) => setDieuKienLoc({ ...dieuKienLoc, loai: value })}
							>
								<Option value={LoaiDiemDen.BIEN}>Biển</Option>
								<Option value={LoaiDiemDen.NUI}>Núi</Option>
								<Option value={LoaiDiemDen.THANH_PHO}>Thành phố</Option>
							</Select>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Select
								placeholder='Sắp xếp theo'
								size='large'
								style={{ width: '100%' }}
								value={tieuChiSapXep}
								onChange={(value) => setTieuChiSapXep(value)}
							>
								<Option value='rating'>Đánh giá</Option>
								<Option value='gia'>Giá</Option>
							</Select>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Select
								placeholder='Thứ tự'
								size='large'
								style={{ width: '100%' }}
								value={thuTuSapXep}
								onChange={(value) => setThuTuSapXep(value)}
							>
								<Option value='giam'>Giảm dần</Option>
								<Option value='tang'>Tăng dần</Option>
							</Select>
						</Col>
					</Row>

					<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
						<Col xs={24} sm={12} md={8}>
							<div className={styles.sliderContainer}>
								<span>
									Giá: {dinhDangTien(dieuKienLoc.giaMin || 0)} - {dinhDangTien(dieuKienLoc.giaMax || 10000000)}
								</span>
								<Slider
									range
									min={0}
									max={10000000}
									step={500000}
									value={[dieuKienLoc.giaMin || 0, dieuKienLoc.giaMax || 10000000]}
									onChange={(value) => setDieuKienLoc({ ...dieuKienLoc, giaMin: value[0], giaMax: value[1] })}
								/>
							</div>
						</Col>
						<Col xs={24} sm={12} md={8}>
							<div className={styles.sliderContainer}>
								<span>Đánh giá tối thiểu: {dieuKienLoc.ratingMin || 0} sao</span>
								<Slider
									min={0}
									max={5}
									step={0.5}
									value={dieuKienLoc.ratingMin || 0}
									onChange={(value) => setDieuKienLoc({ ...dieuKienLoc, ratingMin: value })}
								/>
							</div>
						</Col>
						<Col xs={24} sm={12} md={8}>
							<Button type='primary' size='large' onClick={xoaLoc} block>
								Xóa bộ lọc
							</Button>
						</Col>
					</Row>
				</Card>
			</div>

			<div className={styles.results}>
				<div className={styles.resultsHeader}>
					<h2>Kết quả ({danhSachLoc.length} điểm đến)</h2>
				</div>

				{danhSachLoc.length === 0 ? (
					<Empty description='Không tìm thấy điểm đến phù hợp' />
				) : (
					<Row gutter={[16, 16]}>
						{danhSachLoc.map((diemDen) => (
							<Col xs={24} sm={12} md={8} lg={6} key={diemDen.id}>
								<Card
									hoverable
									className={styles.card}
									cover={
										<div className={styles.cardImage}>
											<img alt={diemDen.ten} src={diemDen.hinhAnh} />
											<Tag color={layMauLoai(diemDen.loai)} className={styles.tag}>
												{layTenLoai(diemDen.loai)}
											</Tag>
										</div>
									}
								>
									<Card.Meta
										title={
											<div className={styles.cardTitle}>
												<span>{diemDen.ten}</span>
												<Rate disabled defaultValue={diemDen.rating} allowHalf />
											</div>
										}
										description={
											<div className={styles.cardDescription}>
												<div className={styles.location}>
													<EnvironmentOutlined /> {diemDen.diaChi}
												</div>
												<div className={styles.price}>
													<span className={styles.priceLabel}>Giá:</span>
													<span className={styles.priceValue}>
														{dinhDangTien(diemDen.giaMin)} - {dinhDangTien(diemDen.giaMax)}
													</span>
												</div>
												<div className={styles.time}>
													<span className={styles.timeLabel}>Thời gian:</span>
													<span className={styles.timeValue}>
														{Math.floor(diemDen.thoiGianThamQuan / 60)} giờ {diemDen.thoiGianThamQuan % 60} phút
													</span>
												</div>
											</div>
										}
									/>
								</Card>
							</Col>
						))}
					</Row>
				)}
			</div>
		</div>
	);
};

export default TrangChu;
