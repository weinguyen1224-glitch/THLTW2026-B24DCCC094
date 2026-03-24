import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { EHoSoTrangThai, TenHoSoTrangThai, TenXepLoai } from '@/services/TotNghiep/constant';

const FormHoSoTotNghiep = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('totnghiep.hosototnghiep');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
				ngayQuyetDinh: record.ngayQuyetDinh ? moment(record.ngayQuyetDinh) : undefined,
				ngayCapBang: record.ngayCapBang ? moment(record.ngayCapBang) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngaySinh: values.ngaySinh?.toISOString(),
			ngayQuyetDinh: values.ngayQuyetDinh?.toISOString(),
			ngayCapBang: values.ngayCapBang?.toISOString(),
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
				<Form.Item name='maSinhVien' label='Mã sinh viên' rules={[...rules.required, ...rules.length(20)]}>
					<Input placeholder='Mã sinh viên' />
				</Form.Item>
				<Form.Item name='hoTen' label='Họ tên' rules={[...rules.required, ...rules.text, ...rules.length(100)]}>
					<Input placeholder='Họ tên sinh viên' />
				</Form.Item>
				<Form.Item name='ngaySinh' label='Ngày sinh' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày sinh' />
				</Form.Item>
				<Form.Item name='gioiTinh' label='Giới tính' rules={[...rules.required]}>
					<Select
						placeholder='Chọn giới tính'
						options={[
							{ value: 'Nam', label: 'Nam' },
							{ value: 'Nữ', label: 'Nữ' },
						]}
					/>
				</Form.Item>
				<Form.Item name='soCMND' label='Số CMND/CCCD' rules={[...rules.required, ...rules.length(20)]}>
					<Input placeholder='Số CMND/CCCD' />
				</Form.Item>
				<Form.Item name='noiSinh' label='Nơi sinh' rules={[...rules.length(250)]}>
					<Input placeholder='Nơi sinh' />
				</Form.Item>
				<Form.Item name='danToc' label='Dân tộc' rules={[...rules.length(50)]}>
					<Input placeholder='Dân tộc' />
				</Form.Item>
				<Form.Item name='queQuan' label='Quê quán' rules={[...rules.length(250)]}>
					<Input placeholder='Quê quán' />
				</Form.Item>
				<Form.Item name='xepLoaiTotNghiep' label='Xếp loại tốt nghiệp' rules={[...rules.required]}>
					<Select
						placeholder='Chọn xếp loại'
						options={Object.entries(TenXepLoai).map(([value, label]) => ({ value, label }))}
					/>
				</Form.Item>
				<Form.Item name='soQuyetDinh' label='Số quyết định' rules={[...rules.required, ...rules.length(50)]}>
					<Input placeholder='Số quyết định' />
				</Form.Item>
				<Form.Item name='ngayQuyetDinh' label='Ngày quyết định' rules={[...rules.required]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày' />
				</Form.Item>
				<Form.Item name='ngayCapBang' label='Ngày cấp bằng'>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày' />
				</Form.Item>
				<Form.Item
					name='trangThai'
					label='Trạng thái'
					rules={[...rules.required]}
					initialValue={EHoSoTrangThai.CHO_DUYET}
				>
					<Select
						placeholder='Chọn trạng thái'
						options={Object.entries(TenHoSoTrangThai).map(([value, label]) => ({ value, label }))}
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

export default FormHoSoTotNghiep;
