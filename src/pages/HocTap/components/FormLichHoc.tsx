import { Form, Input, InputNumber, Select, Button } from 'antd';

interface MonHoc {
	id: string;
	ten: string;
}

interface LichHoc {
	id: string;
	monHocId: string;
	ngay: string;
	khoangThoiGian: number;
	noiDung: string;
	ghiChu: string;
}

interface Props {
	onSubmit: (values: Partial<LichHoc>) => void;
	initialValues?: Partial<LichHoc>;
	danhSachMonHoc: MonHoc[];
	onCancel: () => void;
}

const FormLichHoc: React.FC<Props> = ({ onSubmit, initialValues, danhSachMonHoc, onCancel }) => {
	const [form] = Form.useForm();

	return (
		<Form form={form} initialValues={initialValues} onFinish={onSubmit} layout='vertical'>
			<Form.Item name='monHocId' label='Môn học' rules={[{ required: true }]}>
				<Select options={danhSachMonHoc.map((s) => ({ value: s.id, label: s.ten }))} />
			</Form.Item>
			<Form.Item name='ngay' label='Ngày học' rules={[{ required: true }]}>
				<Input type='date' />
			</Form.Item>
			<Form.Item name='khoangThoiGian' label='Thời lượng (giờ)' rules={[{ required: true }]}>
				<InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
			</Form.Item>
			<Form.Item name='noiDung' label='Nội dung đã học'>
				<Input.TextArea rows={2} />
			</Form.Item>
			<Form.Item name='ghiChu' label='Ghi chú'>
				<Input.TextArea rows={2} />
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

export default FormLichHoc;
