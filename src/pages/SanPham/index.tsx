import React, { useState } from 'react';
import { Table, Button, Input, Modal, Form, Space, Popconfirm, message, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import FormSanPham from './components/FormSanPham';
import type { SanPham as SanPhamType } from '@/models/sanpham';

const SanPham: React.FC = () => {
    const { filteredProducts, searchText, setSearchText, addProduct, deleteProduct } = useModel('sanpham');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleAddProduct = (values: any) => {
        addProduct(values);
        message.success('Thêm sản phẩm thành công!');
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeleteProduct = (id: number) => {
        deleteProduct(id);
        message.success('Xóa sản phẩm thành công!');
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_: any, __: any, index: number) => index + 1,
            width: 80,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) =>
                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: SanPhamType) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                    onConfirm={() => handleDeleteProduct(record.id)}
                    okText="Có"
                    cancelText="Không"
                >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <PageContainer title="Quản lý Sản phẩm">
            <Card>
                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                    <Input.Search
                        placeholder="Tìm kiếm theo tên sản phẩm"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={searchText}
                        onSearch={(value) => setSearchText(value)}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 400 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showModal}>
                        Thêm sản phẩm
                    </Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />

                <Modal
                    title="Thêm sản phẩm mới"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onOk={() => form.submit()}
                    okText="Thêm"
                    cancelText="Hủy"
                >
                    <FormSanPham form={form} onFinish={handleAddProduct} />
                </Modal>
            </Card>
        </PageContainer>
    );
};

export default SanPham;
