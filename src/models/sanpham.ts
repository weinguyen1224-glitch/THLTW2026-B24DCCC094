import { useState, useCallback } from 'react';

export interface SanPham {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const initialData: SanPham[] = [
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default function useSanPhamModel() {
    const [products, setProducts] = useState<SanPham[]>(initialData);
    const [searchText, setSearchText] = useState('');

    const addProduct = useCallback((values: Omit<SanPham, 'id'>) => {
        setProducts((prev) => {
            const newId = prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
            return [...prev, { ...values, id: newId }];
        });
    }, []);

    const deleteProduct = useCallback((id: number) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase()),
    );

    return {
        products,
        filteredProducts,
        searchText,
        setSearchText,
        addProduct,
        deleteProduct,
    };
}
