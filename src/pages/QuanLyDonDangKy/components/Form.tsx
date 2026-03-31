import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select, Radio } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Option } = Select;
const { TextArea } = Input;

const FormDonDangKy = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('dondangky' as any);
	const title = props?.title ?? '';
	const [danhSachCLB, setDanhSachCLB] = useState<CauLacBo.IRecord[]>([]);

	const loadCauLacBo = () => {
		const data = JSON.parse(localStorage.getItem('caulacbo') || '[]');
		setDanhSachCLB(data);
	};

	useEffect(() => {
		loadCauLacBo();
	}, []);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er: any) => console.log(er));
		} else {
			postModel(values)
				.then(() => form.resetFields())
				.catch((er: any) => console.log(er));
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical' initialValues={{ gioiTinh: 'Nam', trangThai: 'Pending' }}>
				<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.text, ...rules.length(100)]}>
					<Input placeholder='Nhập họ tên' />
				</Form.Item>

				<Form.Item name='email' label='Email' rules={[...rules.required, ...rules.email]}>
					<Input placeholder='Nhập email' />
				</Form.Item>

				<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required, ...rules.soDienThoai]}>
					<Input placeholder='Nhập số điện thoại' />
				</Form.Item>

				<Form.Item name='gioiTinh' label='Giới tính'>
					<Radio.Group>
						<Radio value='Nam'>Nam</Radio>
						<Radio value='Nữ'>Nữ</Radio>
						<Radio value='Khác'>Khác</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item name='diaChi' label='Địa chỉ'>
					<Input placeholder='Nhập địa chỉ' />
				</Form.Item>

				<Form.Item name='soTruong' label='Sở trường'>
					<TextArea rows={2} placeholder='Nhập sở trường/kỹ năng' />
				</Form.Item>

				<Form.Item name='cauLacBoId' label='Câu lạc bộ' rules={[...rules.required]}>
					<Select placeholder='Chọn câu lạc bộ' showSearch optionFilterProp='children'>
						{danhSachCLB.map((clb) => (
							<Option key={clb._id} value={clb._id}>
								{clb.ten}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item name='lyDoDangKy' label='Lý do đăng ký' rules={[...rules.required, ...rules.length(500)]}>
					<TextArea rows={3} placeholder='Nhập lý do đăng ký tham gia câu lạc bộ' />
				</Form.Item>

				{!edit && (
					<Form.Item name='trangThai' label='Trạng thái' hidden>
						<Select>
							<Option value='Pending'>Pending</Option>
							<Option value='Approved'>Approved</Option>
							<Option value='Rejected'>Rejected</Option>
						</Select>
					</Form.Item>
				)}

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDonDangKy;
