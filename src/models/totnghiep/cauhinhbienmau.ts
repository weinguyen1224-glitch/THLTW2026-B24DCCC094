import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<TotNghiep.ICauHinhBienMau>('cau-hinh-bien-mau', undefined, undefined, undefined, {
		createdAt: -1,
	});

	return {
		...objInit,
	};
};
