import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<NhanVien.IRecord>('nhan-vien');

	return {
		...objInit,
	};
};
