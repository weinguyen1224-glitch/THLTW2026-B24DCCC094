import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor';

const danhSachGiangVien = [
	{ value: 'ThS. Nguyễn Văn A', label: 'ThS. Nguyễn Văn A' },
	{ value: 'ThS. Trần Thị B', label: 'ThS. Trần Thị B' },
	{ value: 'TS. Lê Văn C', label: 'TS. Lê Văn C' },
	{ value: 'PGS.TS. Phạm Thị D', label: 'PGS.TS. Phạm Thị D' },
	{ value: 'ThS. Hoàng Văn E', label: 'ThS. Hoàng Văn E' },
];

const trangThaiOptions = [
	{ value: 'Đang mở', label: 'Đang mở' },
	{ value: 'Đã kết thúc', label: 'Đã kết thúc' },
	{ value: 'Tạm dừng', label: 'Tạm dừng' },
];

const generateMaKH = (danhSach: KhoaHoc.IRecord[]): string => {
	if (!danhSach || danhSach.length === 0) return 'KH001';
	const maxMa = danhSach.reduce((max, item) => {
		const num = parseInt((item.ma || '').replace('KH', ''), 10);
		return num > max ? num : max;
	}, 0);
	return `KH${String(maxMa + 1).padStart(3, '0')}`;
};

const FormKhoaHoc = () => {
	const [form] = Form.useForm();
	const { record, postModel, putModel, formSubmiting, visibleForm, danhSach, getAllModel, handleClose } =
		useModel('khoahoc');

	const isEdit = !!record?._id;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		} else if (!isEdit && visibleForm) {
			getAllModel().then((data: KhoaHoc.IRecord[]) => {
				form.setFieldsValue({ ma: generateMaKH(data || []) });
			});
		}
	}, [record?._id, visibleForm, isEdit]);

	const onFinish = async (values: any) => {
		if (isEdit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then(() => {
					form.resetFields();
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={(isEdit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'khóa học'} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='ma' hidden>
					<Input />
				</Form.Item>

				<Form.Item
					name='ten'
					label='Tên khóa học'
					rules={[
						...rules.required,
						...rules.text,
						{
							max: 100,
							message: 'Tên khóa học không quá 100 ký tự',
						},
						{
							validator: (_, value) => {
								if (!value) return Promise.resolve();
								const isDuplicate = danhSach.some(
									(item) => item.ten?.toLowerCase() === value?.toLowerCase() && item._id !== record?._id,
								);
								if (isDuplicate) {
									return Promise.reject('Tên khóa học đã tồn tại');
								}
								return Promise.resolve();
							},
						},
					]}
				>
					<Input placeholder='Tên khóa học' />
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item name='giangVien' label='Giảng viên' rules={[...rules.required]}>
							<Select options={danhSachGiangVien} placeholder='Chọn giảng viên' showSearch />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item
							name='soLuongHocVien'
							label='Số lượng học viên'
							rules={[...rules.required, ...rules.number(1000, 0, false)]}
						>
							<InputNumber min={0} max={1000} placeholder='Số lượng HV' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item name='trangThai' label='Trạng thái' rules={[...rules.required]}>
							<Select options={trangThaiOptions} placeholder='Trạng thái' />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='moTa' label='Mô tả khóa học' rules={[...rules.requiredHtml]}>
					<TinyEditor height={400} hideMenubar />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{isEdit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={handleClose}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKhoaHoc;
