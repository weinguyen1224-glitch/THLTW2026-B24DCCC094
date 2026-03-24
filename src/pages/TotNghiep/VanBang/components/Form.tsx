import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { EVanBangTrangThai, TenVanBangTrangThai } from '@/services/TotNghiep/constant';

const FormVanBang = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('totnghiep.vanbang');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayCap: record.ngayCap ? moment(record.ngayCap) : undefined,
				ngayTra: record.ngayTra ? moment(record.ngayTra) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayCap: values.ngayCap?.toISOString(),
			ngayTra: values.ngayTra?.toISOString(),
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
				<Form.Item name='soVaoSo' label='Số vào sổ' rules={[...rules.required]}>
					<Input placeholder='Số vào sổ' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='soHieuVanBang' label='Số hiệu văn bằng' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='Số hiệu văn bằng' />
				</Form.Item>
				<Form.Item name='quyenSo' label='Quyển số' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='Quyển số' />
				</Form.Item>
				<Form.Item name='ngayCap' label='Ngày cấp'>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày cấp' />
				</Form.Item>
				<Form.Item name='nguoiKy' label='Người ký' rules={[...rules.length(100)]}>
					<Input placeholder='Người ký' />
				</Form.Item>
				<Form.Item name='chucVuNguoiKy' label='Chức vụ người ký' rules={[...rules.length(100)]}>
					<Input placeholder='Chức vụ người ký' />
				</Form.Item>
				<Form.Item
					name='trangThai'
					label='Trạng thái'
					rules={[...rules.required]}
					initialValue={EVanBangTrangThai.CHUA_CAP}
				>
					<Select
						placeholder='Chọn trạng thái'
						options={Object.entries(TenVanBangTrangThai).map(([value, label]) => ({ value, label }))}
					/>
				</Form.Item>
				<Form.Item name='ngayTra' label='Ngày trả'>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày trả' />
				</Form.Item>
				<Form.Item name='nguoiNhan' label='Người nhận' rules={[...rules.length(100)]}>
					<Input placeholder='Người nhận' />
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

export default FormVanBang;
