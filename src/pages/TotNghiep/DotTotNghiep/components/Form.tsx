import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { EDotTrangThai, TenDotTrangThai } from '@/services/TotNghiep/constant';

const FormDotTotNghiep = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('totnghiep.dottotnghiep');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayBatDau: record.ngayBatDau ? moment(record.ngayBatDau) : undefined,
				ngayKetThuc: record.ngayKetThuc ? moment(record.ngayKetThuc) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayBatDau: values.ngayBatDau?.toISOString(),
			ngayKetThuc: values.ngayKetThuc?.toISOString(),
		};
		if (edit) {
			putModel(record?._id ?? '', payload)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='ma' label='Mã đợt' rules={[...rules.required, ...rules.text, ...rules.length(50)]}>
					<Input placeholder='Mã đợt tốt nghiệp' />
				</Form.Item>

				<Form.Item name='ten' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Tên đợt tốt nghiệp' />
				</Form.Item>

				<Form.Item name='namHoc' label='Năm học' rules={[...rules.required, ...rules.length(20)]}>
					<Input placeholder='Ví dụ: 2024-2025' />
				</Form.Item>

				<Form.Item name='hocKy' label='Học kỳ' rules={[...rules.required]}>
					<InputNumber min={1} max={3} placeholder='Học kỳ' style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item name='ngayBatDau' label='Ngày bắt đầu' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày' />
				</Form.Item>

				<Form.Item name='ngayKetThuc' label='Ngày kết thúc' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày' />
				</Form.Item>

				<Form.Item name='trangThai' label='Trạng thái' rules={[...rules.required]} initialValue={EDotTrangThai.DANG_MO}>
					<Select
						placeholder='Chọn trạng thái'
						options={Object.entries(TenDotTrangThai).map(([value, label]) => ({ value, label }))}
					/>
				</Form.Item>

				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.length(500)]}>
					<Input.TextArea rows={3} placeholder='Ghi chú' />
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

export default FormDotTotNghiep;
