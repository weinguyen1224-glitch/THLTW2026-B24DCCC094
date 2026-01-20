import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface FormSanPhamProps {
    form: FormInstance;
    onFinish: (values: any) => void;
    initialValues?: any;
}

const FormSanPham: React.FC<FormSanPhamProps> = ({ form, onFinish, initialValues }) => {
    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
                <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Form.Item
                name="price"
                label="Giá"
                rules={[
                    { required: true, message: 'Vui lòng nhập giá!' },
                    { type: 'number', min: 1, message: 'Giá phải là số dương!' },
                ]}
            >
                <InputNumber
                    placeholder="Nhập giá"
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                />
            </Form.Item>
            <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[
                    { required: true, message: 'Vui lòng nhập số lượng!' },
                    { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' },
                ]}
            >
                <InputNumber placeholder="Nhập số lượng" style={{ width: '100%' }} step={1} />
            </Form.Item>
        </Form>
    );
};

export default FormSanPham;
