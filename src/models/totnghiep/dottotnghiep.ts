import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<TotNghiep.IDotTotNghiep>('dot-tot-nghiep', undefined, undefined, undefined, {
		createdAt: -1,
	});

	return {
		...objInit,
	};
};
