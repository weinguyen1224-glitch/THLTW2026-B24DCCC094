import { Form, Input, Button } from 'antd';

interface Props {
	onSubmit: (values: Partial<MonHoc>) => void;
	initialValues?: Partial<MonHoc>;
	onCancel: () => void;
}

const FormMonHoc: React.FC<Props> = ({ onSubmit, initialValues, onCancel }) => {
	const [form] = Form.useForm();

	return (
		<Form form={form} initialValues={initialValues} onFinish={onSubmit} layout='vertical'>
			<Form.Item name='ten' label='Tên môn học' rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
				<Input placeholder='Nhập tên môn học' />
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

export default FormMonHoc;
