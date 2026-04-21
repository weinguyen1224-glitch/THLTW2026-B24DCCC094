import { Form, Input, Select, Button } from 'antd';
import type { Blog } from '@/services/Blog/typing';

const { TextArea } = Input;

interface PostFormProps {
	form: any;
	tags: Blog.Tag[];
	onFinish: (values: any) => void;
	onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ form, tags, onFinish, onCancel }) => {
	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			<Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
				<Input />
			</Form.Item>

			<Form.Item label='Slug' name='slug'>
				<Input placeholder='Tự động tạo nếu để trống' />
			</Form.Item>

			<Form.Item label='Tóm tắt' name='summary' rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
				<TextArea rows={2} />
			</Form.Item>

			<Form.Item label='Nội dung (Markdown)' name='content' rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
				<TextArea rows={10} />
			</Form.Item>

			<Form.Item label='Ảnh đại diện (URL)' name='coverImage'>
				<Input placeholder='https://...' />
			</Form.Item>

			<Form.Item label='Thẻ' name='tags'>
				<Select mode='multiple' placeholder='Chọn thẻ'>
					{tags.map((tag) => (
						<Select.Option key={tag.id} value={tag.name}>
							{tag.name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item label='Trạng thái' name='status' initialValue='draft'>
				<Select>
					<Select.Option value='draft'>Nháp</Select.Option>
					<Select.Option value='published'>Đã đăng</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item style={{ textAlign: 'right' }}>
				<Button onClick={onCancel} style={{ marginRight: 8 }}>
					Hủy
				</Button>
				<Button type='primary' htmlType='submit'>
					Lưu
				</Button>
			</Form.Item>
		</Form>
	);
};

export default PostForm;