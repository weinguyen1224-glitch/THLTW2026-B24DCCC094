import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel('lich-hen');

	return {
		...objInit,
	};
};
