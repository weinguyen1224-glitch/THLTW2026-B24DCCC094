import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauHinhBienMau = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('totnghiep.cauhinhbienmau');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='ten' label='Tên cấu hình' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Tên cấu hình' />
				</Form.Item>
				<Form.Item name='mauSac' label='Màu sắc' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='VD: #FFFFFF' />
				</Form.Item>
				<Form.Item name='kichThuoc' label='Kích thước' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='VD: A4' />
				</Form.Item>
				<Form.Item name='fontChu' label='Font chữ' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='VD: Times New Roman' />
				</Form.Item>
				<Form.Item name='hinhDang' label='Hình dạng' rules={[...rules.required, ...rules.length(100)]}>
					<Input placeholder='Hình dạng' />
				</Form.Item>
				<Form.Item name='viTriDau' label='Vị trí dấu' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder='Vị trí dấu' />
				</Form.Item>
				<Form.Item name='viTriChuKy' label='Vị trí chữ ký' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder='Vị trí chữ ký' />
				</Form.Item>
				<Form.Item name='nguoiKyMacDinh' label='Người ký mặc định' rules={[...rules.length(100)]}>
					<Input placeholder='Người ký mặc định' />
				</Form.Item>
				<Form.Item name='chucVuKyMacDinh' label='Chức vụ ký mặc định' rules={[...rules.length(100)]}>
					<Input placeholder='Chức vụ ký mặc định' />
				</Form.Item>
				<Form.Item name='mauSacChu' label='Màu sắc chữ' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='VD: #000000' />
				</Form.Item>
				<Form.Item name='kieuChu' label='Kiểu chữ' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='VD: Bold, Italic' />
				</Form.Item>
				<Form.Item name='trangThai' label='Trạng thái' rules={[...rules.required]} initialValue={true}>
					<Select
						placeholder='Chọn trạng thái'
						options={[
							{ value: true, label: 'Kích hoạt' },
							{ value: false, label: 'Vô hiệu hóa' },
						]}
					/>
				</Form.Item>
				<Form.Item name='moTa' label='Mô tả' rules={[...rules.length(500)]}>
					<Input.TextArea rows={3} placeholder='Mô tả' />
				</Form.Item>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCauHinhBienMau;
