import { Form, InputNumber, Select, Button } from 'antd';

interface MonHoc {
	id: string;
	ten: string;
}

interface MucTieu {
	id: string;
	monHocId: string | null;
	thang: string;
	mucTieuGios: number;
}

interface Props {
	onSubmit: (values: Partial<MucTieu>) => void;
	initialValues?: Partial<MucTieu>;
	danhSachMonHoc?: MonHoc[];
	onCancel: () => void;
}

const FormMucTieu: React.FC<Props> = ({ onSubmit, initialValues, danhSachMonHoc = [], onCancel }) => {
	const [form] = Form.useForm();

	const transformedInitialValues = initialValues
		? {
				...initialValues,
				thang: initialValues.thang ? parseInt(initialValues.thang.split('-')[0]) : undefined,
				nam: initialValues.thang ? parseInt(initialValues.thang.split('-')[1]) : undefined,
		  }
		: undefined;

	return (
		<Form form={form} initialValues={transformedInitialValues} onFinish={onSubmit} layout='vertical'>
			<Form.Item name='monHocId' label='Môn học'>
				<Select
					placeholder='Chọn môn học'
					allowClear
					options={[
						{ value: '', label: 'Tổng thể' },
						...danhSachMonHoc.map((m) => ({ value: m.id, label: m.ten || '' })),
					]}
				/>
			</Form.Item>
			<Form.Item name='thang' label='Tháng' rules={[{ required: true, message: 'Vui lòng nhập tháng' }]}>
				<InputNumber min={1} max={12} style={{ width: '100%' }} placeholder='1-12' />
			</Form.Item>
			<Form.Item name='nam' label='Năm' rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
				<InputNumber min={2020} max={2030} style={{ width: '100%' }} placeholder='2024' />
			</Form.Item>
			<Form.Item
				name='mucTieuGios'
				label='Mục tiêu (giờ)'
				rules={[{ required: true, message: 'Vui lòng nhập mục tiêu giờ' }]}
			>
				<InputNumber min={1} style={{ width: '100%' }} placeholder='Số giờ' />
			</Form.Item>
			<div style={{ display: 'flex', gap: 8 }}>
				<Button type='primary' htmlType='submit'>
					Lưu
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormMucTieu;
