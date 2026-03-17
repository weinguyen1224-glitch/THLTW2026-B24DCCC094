import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel('dich-vu');

	return {
		...objInit,
	};
};
