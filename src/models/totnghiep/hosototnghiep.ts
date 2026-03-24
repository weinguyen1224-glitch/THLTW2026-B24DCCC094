import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<TotNghiep.IHoSoTotNghiep>('ho-so-tot-nghiep', undefined, undefined, undefined, {
		createdAt: -1,
	});

	const [visibleTimKiem, setVisibleTimKiem] = useState<boolean>(false);
	const [conditionTimKiem, setConditionTimKiem] = useState<Partial<TotNghiep.IHoSoTotNghiep>>({});

	return {
		...objInit,
		visibleTimKiem,
		setVisibleTimKiem,
		conditionTimKiem,
		setConditionTimKiem,
	};
};
