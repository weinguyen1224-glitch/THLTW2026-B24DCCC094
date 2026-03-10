import { useState } from 'react';
import { Card, Button, Typography, List, Tag, Space, Statistic, Row, Col } from 'antd';
import { ReloadOutlined, TrophyOutlined, FrownOutlined, SwapOutlined } from '@ant-design/icons';
import type { LuaChon, KetQuaVanDau, ThongTinTroChoi } from '@/services/OanTuTi/typing';

const { Title, Text } = Typography;

const luaChonList: { key: LuaChon; label: string }[] = [
	{ key: 'keo', label: 'Kéo' },
	{ key: 'bua', label: 'Búa' },
	{ key: 'bao', label: 'Bao' },
];

const OanTuTi: React.FC = () => {
	const [lichSu, setLichSu] = useState<KetQuaVanDau[]>([]);
	const [luaChonHienTai, setLuaChonHienTai] = useState<LuaChon | null>(null);
	const [luaChonMay, setLuaChonMay] = useState<LuaChon | null>(null);
	const [daChon, setDaChon] = useState<boolean>(false);
	const [thongTinTroChoi, setThongTinTroChoi] = useState<ThongTinTroChoi>({
		soVanThang: 0,
		soVanThua: 0,
		soVanHoa: 0,
		tongSoVan: 0,
	});

	const getLuaChonMayTinh = (): LuaChon => {
		const randomIndex = Math.floor(Math.random() * 3);
		return luaChonList[randomIndex].key as LuaChon;
	};

	const xacDinhKetQua = (nguoiChoi: LuaChon, mayTinh: LuaChon): 'thang' | 'thua' | 'hoa' => {
		if (nguoiChoi === mayTinh) return 'hoa';
		if (
			(nguoiChoi === 'keo' && mayTinh === 'bao') ||
			(nguoiChoi === 'bua' && mayTinh === 'keo') ||
			(nguoiChoi === 'bao' && mayTinh === 'bua')
		) {
			return 'thang';
		}
		return 'thua';
	};

	const getLabelLuaChon = (luaChon: LuaChon): string => {
		return luaChonList.find((item) => item.key === luaChon)?.label || '';
	};

	const getIconLuaChon = (luaChon: LuaChon): string => {
		return luaChonList.find((item) => item.key === luaChon)?.icon || '';
	};

	const handleChon = (luaChon: LuaChon) => {
		const may = getLuaChonMayTinh();
		const ketQua = xacDinhKetQua(luaChon, may);

		setLuaChonHienTai(luaChon);
		setLuaChonMay(may);
		setDaChon(true);

		const vanDauMoi: KetQuaVanDau = {
			id: Date.now(),
			luaChonNguoiChoi: luaChon,
			luaChonMayTinh: may,
			ketQua,
			thoiGian: new Date().toLocaleString('vi-VN'),
		};

		setLichSu((prev: KetQuaVanDau[]) => [vanDauMoi, ...prev]);

		setThongTinTroChoi((prev: ThongTinTroChoi) => ({
			...prev,
			tongSoVan: prev.tongSoVan + 1,
			soVanThang: prev.soVanThang + (ketQua === 'thang' ? 1 : 0),
			soVanThua: prev.soVanThua + (ketQua === 'thua' ? 1 : 0),
			soVanHoa: prev.soVanHoa + (ketQua === 'hoa' ? 1 : 0),
		}));
	};

	const handleTaiLai = () => {
		setLuaChonHienTai(null);
		setLuaChonMay(null);
		setDaChon(false);
	};

	const handleChoilaiMoi = () => {
		setLichSu([]);
		setThongTinTroChoi({
			soVanThang: 0,
			soVanThua: 0,
			soVanHoa: 0,
			tongSoVan: 0,
		});
		handleTaiLai();
	};

	const getMauKetQua = (ketQua: 'thang' | 'thua' | 'hoa'): string => {
		switch (ketQua) {
			case 'thang':
				return 'success';
			case 'thua':
				return 'error';
			default:
				return 'default';
		}
	};

	const getTextKetQua = (ketQua: 'thang' | 'thua' | 'hoa'): string => {
		switch (ketQua) {
			case 'thang':
				return 'Thắng';
			case 'thua':
				return 'Thua';
			default:
				return 'Hòa';
		}
	};

	return (
		<div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
			<Card>
				<div style={{ textAlign: 'center' }}>
					<Title level={2}>Trò Chơi Oẳn Tù Tì</Title>
					<Text type='secondary'>Chọn Kéo, Búa hoặc Bao để chơi!</Text>
				</div>

				<Row gutter={16} style={{ marginTop: 24, marginBottom: 24 }}>
					<Col span={8}>
						<Statistic title='Thắng' value={thongTinTroChoi.soVanThang} valueStyle={{ color: '#3f8600' }} />
					</Col>
					<Col span={8}>
						<Statistic title='Hòa' value={thongTinTroChoi.soVanHoa} valueStyle={{ color: '#1890ff' }} />
					</Col>
					<Col span={8}>
						<Statistic title='Thua' value={thongTinTroChoi.soVanThua} valueStyle={{ color: '#cf1322' }} />
					</Col>
				</Row>

				{daChon && luaChonHienTai && luaChonMay && (
					<div style={{ textAlign: 'center', marginBottom: 24 }}>
						<Space size='large'>
							<div>
								<Text strong>Bạn chọn:</Text>
								<div style={{ fontSize: 48 }}>{getIconLuaChon(luaChonHienTai)}</div>
								<Text>{getLabelLuaChon(luaChonHienTai)}</Text>
							</div>
							<div style={{ fontSize: 32, alignSelf: 'center' }}>VS</div>
							<div>
								<Text strong>Máy tính chọn:</Text>
								<div style={{ fontSize: 48 }}>{getIconLuaChon(luaChonMay)}</div>
								<Text>{getLabelLuaChon(luaChonMay)}</Text>
							</div>
						</Space>
					</div>
				)}

				<div style={{ textAlign: 'center', marginBottom: 24 }}>
					<Space>
						{luaChonList.map((item) => (
							<Button
								key={item.key}
								type={luaChonHienTai === item.key ? 'primary' : 'default'}
								size='large'
								onClick={() => handleChon(item.key)}
								disabled={daChon}
								style={{ minWidth: 80 }}
							>
								<div>
									<div>{item.label}</div>
								</div>
							</Button>
						))}
					</Space>
				</div>

				{daChon && (
					<div style={{ textAlign: 'center', marginBottom: 24 }}>
						<Button type='primary' onClick={handleTaiLai} size='large'>
							Chơi Tiếp
						</Button>
					</div>
				)}

				<div style={{ textAlign: 'center', marginBottom: 24 }}>
					<Button icon={<ReloadOutlined />} onClick={handleChoilaiMoi}>
						Chơi Lại Từ Đầu
					</Button>
				</div>

				<div>
					<Title level={4}>Lịch Sử Kết Quả</Title>
					{lichSu.length === 0 ? (
						<Text type='secondary'>Chưa có ván đấu nào. Hãy chọn để bắt đầu!</Text>
					) : (
						<List
							size='small'
							dataSource={lichSu}
							renderItem={(item) => (
								<List.Item>
									<Space>
										<Text>
											Bạn: {getIconLuaChon(item.luaChonNguoiChoi)} {getLabelLuaChon(item.luaChonNguoiChoi)}
										</Text>
										<Text>-</Text>
										<Text>
											Máy: {getIconLuaChon(item.luaChonMayTinh)} {getLabelLuaChon(item.luaChonMayTinh)}
										</Text>
										<Tag color={getMauKetQua(item.ketQua)}>{getTextKetQua(item.ketQua)}</Tag>
										<Text type='secondary' style={{ fontSize: 12 }}>
											{item.thoiGian}
										</Text>
									</Space>
								</List.Item>
							)}
						/>
					)}
				</div>
			</Card>
		</div>
	);
};

export default OanTuTi;
