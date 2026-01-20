import SanPham from '@/pages/SanPham';
import type { ELoaiPhanHoi } from './constant';

declare module SanPham {
	export interface IRecord {
		id: number;
		name: string;
		price: number;
		quantity: number;
	}
}
