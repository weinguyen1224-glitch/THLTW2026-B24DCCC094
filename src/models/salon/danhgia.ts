import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel('danh-gia');

	return {
		...objInit,
	};
};
