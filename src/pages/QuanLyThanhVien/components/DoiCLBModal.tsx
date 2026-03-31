import { Modal, Select, Descriptions, Tag, Alert, Space } from 'antd';
import { TeamOutlined, SwapOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface DoiCLBModalProps {
	visible: boolean;
	onClose: () => void;
	onConfirm: (cauLacBoId: string) => void;
	soLuongThanhVien: number;
	loading?: boolean;
}

const DoiCLBModal = (props: DoiCLBModalProps) => {
	const { visible, onClose, onConfirm, soLuongThanhVien, loading } = props;
	const [selectedCLB, setSelectedCLB] = useState<string>('');
	const [danhSachCLB, setDanhSachCLB] = useState<CauLacBo.IRecord[]>([]);

	const loadCauLacBo = () => {
		const data = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		setDanhSachCLB(data);
	};

	useEffect(() => {
		if (visible) {
			loadCauLacBo();
			setSelectedCLB('');
		}
	}, [visible]);

	const handleConfirm = () => {
		if (!selectedCLB) {
			return;
		}
		onConfirm(selectedCLB);
	};

	const selectedCLBInfo = danhSachCLB.find((c) => c._id === selectedCLB);

	return (
		<Modal
			title={
				<Space>
					<SwapOutlined />
					Chuyển câu lạc bộ
				</Space>
			}
			visible={visible}
			onCancel={onClose}
			onOk={handleConfirm}
			okText='Xác nhận chuyển'
			cancelText='Hủy'
			confirmLoading={loading}
			okButtonProps={{ disabled: !selectedCLB }}
		>
			<Alert
				message={`Bạn đang chuyển ${soLuongThanhVien} thành viên sang câu lạc bộ khác`}
				type='info'
				showIcon
				style={{ marginBottom: 16 }}
			/>

			<Descriptions column={1} bordered size='small' style={{ marginBottom: 16 }}>
				<Descriptions.Item label='Số lượng thành viên'>{soLuongThanhVien} người</Descriptions.Item>
			</Descriptions>

			<div style={{ marginBottom: 8 }}>
				<strong>Chọn câu lạc bộ chuyển đến:</strong>
			</div>
			<Select
				style={{ width: '100%' }}
				placeholder='Chọn câu lạc bộ'
				value={selectedCLB || undefined}
				onChange={(value) => setSelectedCLB(value)}
				showSearch
				optionFilterProp='children'
			>
				{danhSachCLB.map((clb) => (
					<Option key={clb._id} value={clb._id}>
						<Space>
							<TeamOutlined />
							{clb.ten}
							<Tag color={clb.hoatDong ? 'green' : 'red'}>{clb.hoatDong ? 'Hoạt động' : 'Ngừng'}</Tag>
						</Space>
					</Option>
				))}
			</Select>

			{selectedCLBInfo && (
				<Alert
					message={
						<div>
							<strong>Câu lạc bộ được chọn:</strong> {selectedCLBInfo.ten}
							<br />
							<span>Chủ nhiệm: {selectedCLBInfo.chuNhiem}</span>
							<br />
							<span>Số thành viên hiện tại: {selectedCLBInfo.soThanhVien || 0}</span>
						</div>
					}
					type='success'
					style={{ marginTop: 16 }}
				/>
			)}
		</Modal>
	);
};

export default DoiCLBModal;
