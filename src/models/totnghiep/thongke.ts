import useInitModel from '@/hooks/useInitModel';
import {
	getThongKeTotNghiep,
	getThongKeTheoNganh,
	getThongKeTheoKhoa,
	getThongKeTheoXepLoai,
} from '@/services/TotNghiep/ThongKe';
import { useState } from 'react';

export default () => {
	const luotTruyCapModel = useInitModel<TotNghiep.ILuotTruyCap>('van-bang/luot-truy-cap');

	const [thongKe, setThongKe] = useState<TotNghiep.IThongKe>();
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [thongKeNganh, setThongKeNganh] = useState<any[]>([]);
	const [thongKeKhoa, setThongKeKhoa] = useState<any[]>([]);
	const [thongKeXepLoai, setThongKeXepLoai] = useState<any[]>([]);

	const fetchThongKe = async (idDotTotNghiep?: string) => {
		setLoadingThongKe(true);
		try {
			const res = await getThongKeTotNghiep({ idDotTotNghiep });
			setThongKe(res?.data?.data);
			return res?.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const fetchThongKeTheoNganh = async (idDotTotNghiep?: string, idKhoa?: string) => {
		try {
			const res = await getThongKeTheoNganh({ idDotTotNghiep, idKhoa });
			setThongKeNganh(res?.data?.data ?? []);
			return res?.data?.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const fetchThongKeTheoKhoa = async (idDotTotNghiep?: string) => {
		try {
			const res = await getThongKeTheoKhoa({ idDotTotNghiep });
			setThongKeKhoa(res?.data?.data ?? []);
			return res?.data?.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	const fetchThongKeTheoXepLoai = async (idDotTotNghiep?: string) => {
		try {
			const res = await getThongKeTheoXepLoai({ idDotTotNghiep });
			setThongKeXepLoai(res?.data?.data ?? []);
			return res?.data?.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	return {
		...luotTruyCapModel,
		thongKe,
		setThongKe,
		loadingThongKe,
		thongKeNganh,
		thongKeKhoa,
		thongKeXepLoai,
		fetchThongKe,
		fetchThongKeTheoNganh,
		fetchThongKeTheoKhoa,
		fetchThongKeTheoXepLoai,
	};
};
