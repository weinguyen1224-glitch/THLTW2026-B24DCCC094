import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';

const FormCauLacBo = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('caulacbo');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayThanhLap: record.ngayThanhLap ? moment(record.ngayThanhLap) : null,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayThanhLap: values.ngayThanhLap ? values.ngayThanhLap.toISOString() : null,
			hoatDong: values.hoatDong ?? true,
		};

		if (edit) {
			putModel(record?._id ?? '', payload)
				.then()
				.catch((er: any) => console.log(er));
		} else {
			postModel(payload)
				.then(() => form.resetFields())
				.catch((er: any) => console.log(er));
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical' initialValues={{ hoatDong: true }}>
				<Form.Item name='ten' label='Tên câu lạc bộ' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập tên câu lạc bộ' />
				</Form.Item>

				<Form.Item name='anhDaiDien' label='Ảnh đại diện (URL)'>
					<Input placeholder='Nhập URL ảnh đại diện' />
				</Form.Item>

				<Form.Item name='ngayThanhLap' label='Ngày thành lập'>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' placeholder='Chọn ngày thành lập' />
				</Form.Item>

				<Form.Item name='moTa' label='Mô tả'>
					<Input.TextArea rows={4} placeholder='Nhập mô tả câu lạc bộ' />
				</Form.Item>

				<Form.Item
					name='chuNhiem'
					label='Chủ nhiệm CLB'
					rules={[...rules.required, ...rules.text, ...rules.length(100)]}
				>
					<Input placeholder='Nhập tên chủ nhiệm CLB' />
				</Form.Item>

				<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked'>
					<Switch checkedChildren='Có' unCheckedChildren='Không' />
				</Form.Item>

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

export default FormCauLacBo;
