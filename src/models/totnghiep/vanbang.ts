import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<TotNghiep.IVanBang>('van-bang', undefined, undefined, undefined, {
		soVaoSo: 1,
	});

	const [visibleTraCuu, setVisibleTraCuu] = useState<boolean>(false);

	return {
		...objInit,
		visibleTraCuu,
		setVisibleTraCuu,
	};
};
