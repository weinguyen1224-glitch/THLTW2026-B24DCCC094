export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// QUAN LY VAN BANG TOT NGHIEP
	{
		name: 'TotNghiep',
		path: '/tot-nghiep',
		icon: 'FormOutlined',
		routes: [
			{
				name: 'TotNghiep.DotTotNghiep',
				path: 'dot-tot-nghiep',
				component: './TotNghiep/DotTotNghiep',
			},
			{
				name: 'TotNghiep.HoSoTotNghiep',
				path: 'ho-so-tot-nghiep',
				component: './TotNghiep/HoSoTotNghiep',
			},
			{
				name: 'TotNghiep.VanBang',
				path: 'van-bang',
				component: './TotNghiep/VanBang',
			},
			{
				name: 'TotNghiep.CauHinhBienMau',
				path: 'cau-hinh-bien-mau',
				component: './TotNghiep/CauHinhBienMau',
			},
			{
				name: 'TotNghiep.ThongKe',
				path: 'thong-ke',
				component: './TotNghiep/ThongKe',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
