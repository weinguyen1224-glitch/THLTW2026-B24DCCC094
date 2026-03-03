import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Tabs, message } from 'antd';
import FormMonHoc from './components/FormMonHoc';
import FormLichHoc from './components/FormLichHoc';
import FormMucTieu from './components/FormMucTieu';

const { TabPane } = Tabs;

const HocTap: React.FC = () => {
	const [monHocs, setmonHocs] = useState<MonHoc[]>([]);
	const [sessions, setSessions] = useState<LichHoc[]>([]);
	const [goals, setGoals] = useState<MucTieu[]>([]);
	const [monHocModal, setmonHocModal] = useState<{ visible: boolean; edit?: MonHoc }>({ visible: false });
	const [sessionModal, setSessionModal] = useState<{ visible: boolean; edit?: LichHoc }>({ visible: false });
	const [goalModal, setGoalModal] = useState<{ visible: boolean; edit?: MucTieu }>({ visible: false });
	const [activeTab, setActiveTab] = useState('progress');

	const defaultmonHocs: MonHoc[] = [
		{ id: '1', ten: 'Toán' },
		{ id: '2', ten: 'Văn' },
		{ id: '3', ten: 'Anh' },
		{ id: '4', ten: 'Khoa học' },
		{ id: '5', ten: 'Công nghệ' },
	];

	useEffect(() => {
		const storedmonHocs = localStorage.getItem('study_monHocs');
		const storedSessions = localStorage.getItem('study_sessions');
		const storedGoals = localStorage.getItem('study_goals');
		setmonHocs(storedmonHocs ? JSON.parse(storedmonHocs) : defaultmonHocs);
		setSessions(storedSessions ? JSON.parse(storedSessions) : []);
		setGoals(storedGoals ? JSON.parse(storedGoals) : []);
	}, []);

	const savemonHocs = (data: MonHoc[]) => {
		setmonHocs(data);
		localStorage.setItem('study_monHocs', JSON.stringify(data));
	};

	const saveSessions = (data: LichHoc[]) => {
		setSessions(data);
		localStorage.setItem('study_sessions', JSON.stringify(data));
	};

	const saveGoals = (data: MucTieu[]) => {
		setGoals(data);
		localStorage.setItem('study_goals', JSON.stringify(data));
	};

	const handlemonHocSubmit = (values: Partial<MonHoc>) => {
		if (monHocModal.edit) {
			const updated = monHocs.map((s) => (s.id === monHocModal.edit?.id ? { ...s, ten: values.ten || '' } : s));
			savemonHocs(updated);
		} else {
			savemonHocs([...monHocs, { id: Date.now().toString(), ten: values.ten || '' }]);
		}
		setmonHocModal({ visible: false });
	};

	const deletemonHoc = (id: string) => {
		savemonHocs(monHocs.filter((s) => s.id !== id));
		saveSessions(sessions.filter((s) => s.monHocId !== id));
		saveGoals(goals.filter((g) => g.monHocId !== id));
	};

	const handleSessionSubmit = (values: any) => {
		if (sessionModal.edit) {
			const updated = sessions.map((s) => (s.id === sessionModal.edit?.id ? { ...s, ...values } : s));
			saveSessions(updated);
		} else {
			saveSessions([...sessions, { ...values, id: Date.now().toString() }]);
		}
		setSessionModal({ visible: false });
	};

	const deleteSession = (id: string) => {
		saveSessions(sessions.filter((s) => s.id !== id));
	};

	const handleGoalSubmit = (values: any) => {
		const monthKey = `${values.thang}-${values.nam}`;
		if (goalModal.edit) {
			const updated = goals.map((g) => (g.id === goalModal.edit?.id ? { ...g, ...values, thang: monthKey } : g));
			saveGoals(updated);
		} else {
			const existing = goals.find((g) => g.thang === monthKey && g.monHocId === values.monHocId);
			if (existing) {
				message.warning('Mục tiêu cho môn học này trong tháng đã tồn tại!');
				return;
			}
			saveGoals([...goals, { ...values, id: Date.now().toString(), thang: monthKey }]);
		}
		setGoalModal({ visible: false });
	};

	const deleteGoal = (id: string) => {
		saveGoals(goals.filter((g) => g.id !== id));
	};

	const getmonHocName = (id: string) => monHocs.find((s) => s.id === id)?.ten || '';

	const getMonthProgress = (monHocId: string | null, monthKey: string) => {
		const monthSessions = sessions.filter((s) => {
			const sessionMonth = `${new Date(s.ngay).getMonth() + 1}-${new Date(s.ngay).getFullYear()}`;
			return sessionMonth === monthKey && (monHocId ? s.monHocId === monHocId : true);
		});
		return monthSessions.reduce((sum, s) => sum + s.khoangThoiGian, 0);
	};

	const getSessionColumns = () => [
		{ title: 'Môn học', dataIndex: 'monHocId', render: (id: string) => getmonHocName(id) },
		{ title: 'Ngày học', dataIndex: 'ngay' },
		{ title: 'Thời lượng (giờ)', dataIndex: 'khoangThoiGian' },
		{ title: 'Nội dung', dataIndex: 'noiDung' },
		{ title: 'Ghi chú', dataIndex: 'ghiChu' },
		{
			title: '',
			width: 120,
			render: (_: any, record: LichHoc) => (
				<>
					<Button size='small' onClick={() => setSessionModal({ visible: true, edit: record })}>
						Sửa
					</Button>
					<Button size='small' danger onClick={() => deleteSession(record.id)} style={{ marginLeft: 4 }}>
						Xóa
					</Button>
				</>
			),
		},
	];

	const getGoalColumns = () => [
		{ title: 'Môn học', dataIndex: 'monHocId', render: (id: string | null) => (id ? getmonHocName(id) : 'Tổng thể') },
		{ title: 'Tháng', dataIndex: 'thang' },
		{ title: 'Mục tiêu (giờ)', dataIndex: 'mucTieuGios' },
		{
			title: 'Tiến độ',
			width: 200,
			render: (_: any, record: MucTieu) => {
				const totalHours = getMonthProgress(record.monHocId, record.thang);
				console.log(totalHours);
				const percent = record.mucTieuGios > 0 ? Math.min(100, (totalHours / record.mucTieuGios) * 100) : 0;

				const rounded = percent.toFixed(0);

				return (
					<div style={{ width: 120 }}>
						<div
							style={{
								height: 8,
								background: '#e5e7eb',
								borderRadius: 6,
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									width: `${rounded}%`,
									height: '100%',
									background: percent >= 100 ? '#22c55e' : percent >= 70 ? '#3b82f6' : '#f59e0b',
									transition: 'width 0.3s ease',
								}}
							/>
						</div>

						<div style={{ fontSize: 12, marginTop: 4, textAlign: 'center' }}>{rounded}%</div>
					</div>
				);
			},
		},
		{
			title: '',
			width: 120,
			render: (_: any, record: MucTieu) => {
				if (!record.thang) return null;
				const [m, y] = record.thang.split('-');
				const editData = { ...record, thang: m, nam: y };
				return (
					<>
						<Button size='small' onClick={() => setGoalModal({ visible: true, edit: editData })}>
							Sửa
						</Button>
						<Button size='small' danger onClick={() => deleteGoal(record.id)} style={{ marginLeft: 4 }}>
							Xóa
						</Button>
					</>
				);
			},
		},
	];

	const getmonHocColumns = () => [
		{ title: 'Tên môn học', dataIndex: 'ten' },
		{
			title: '',
			width: 120,
			render: (_: any, record: MonHoc) => (
				<>
					<Button size='small' onClick={() => setmonHocModal({ visible: true, edit: record })}>
						Sửa
					</Button>
					<Button size='small' danger onClick={() => deletemonHoc(record.id)} style={{ marginLeft: 4 }}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Card title='Quản Lý Học Tập'>
				<Tabs activeKey={activeTab} onChange={setActiveTab}>
					<TabPane tab='Tiến độ học tập' key='progress'>
						<Button type='primary' onClick={() => setSessionModal({ visible: true })} style={{ marginBottom: 16 }}>
							Thêm lịch học
						</Button>
						<Table dataSource={sessions} columns={getSessionColumns()} rowKey='id' pagination={{ pageSize: 5 }} />
					</TabPane>
					<TabPane tab='Mục tiêu tháng' key='goals'>
						<Button type='primary' onClick={() => setGoalModal({ visible: true })} style={{ marginBottom: 16 }}>
							Thêm mục tiêu
						</Button>
						<Table dataSource={goals} columns={getGoalColumns()} rowKey='id' pagination={{ pageSize: 5 }} />
					</TabPane>
					<TabPane tab='Danh mục môn học' key='monHocs'>
						<Button type='primary' onClick={() => setmonHocModal({ visible: true })} style={{ marginBottom: 16 }}>
							Thêm môn học
						</Button>
						<Table dataSource={monHocs} columns={getmonHocColumns()} rowKey='id' pagination={{ pageSize: 5 }} />
					</TabPane>
					table
				</Tabs>
			</Card>

			<Modal
				title={monHocModal.edit ? 'Sửa môn học' : 'Thêm môn học'}
				visible={monHocModal.visible}
				onCancel={() => setmonHocModal({ visible: false })}
				footer={null}
			>
				<FormMonHoc
					onSubmit={handlemonHocSubmit}
					initialValues={monHocModal.edit}
					onCancel={() => setmonHocModal({ visible: false })}
				/>
			</Modal>

			<Modal
				title={sessionModal.edit ? 'Sửa lịch học' : 'Thêm lịch học'}
				visible={sessionModal.visible}
				onCancel={() => setSessionModal({ visible: false })}
				footer={null}
				width={600}
			>
				<FormLichHoc
					onSubmit={handleSessionSubmit}
					initialValues={sessionModal.edit}
					danhSachMonHoc={monHocs}
					onCancel={() => setSessionModal({ visible: false })}
				/>
			</Modal>

			<Modal
				title={goalModal.edit ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
				visible={goalModal.visible}
				onCancel={() => setGoalModal({ visible: false })}
				footer={null}
			>
				<FormMucTieu
					onSubmit={handleGoalSubmit}
					initialValues={goalModal.edit}
					danhSachMonHoc={monHocs}
					onCancel={() => setGoalModal({ visible: false })}
				/>
			</Modal>
		</div>
	);
};

export default HocTap;
