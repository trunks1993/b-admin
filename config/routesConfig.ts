// 设备模块
export const product = [
  { path: '/product/manager/list', component: './product/manager/list', Routes: ['src/AuthRouter'] },
  { path: '/product/manager/group', component: './product/manager/group', Routes: ['src/AuthRouter'] },
  { path: '/product/manager/management', component: './product/manager/management', Routes: ['src/AuthRouter'] },
  { path: '/product/manager/price', component: './product/manager/price', Routes: ['src/AuthRouter'] },
  { path: '/product/manager/brand', component: './product/manager/brand', Routes: ['src/AuthRouter'] },
];
export const business = [
  { path: '/business/manager/info', component: './business/manager/info', Routes: ['src/AuthRouter'] },
  { path: '/business/manager/auth', component: './business/manager/auth', Routes: ['src/AuthRouter'] },
  { path: '/business/manager/application', component: './business/manager/application', Routes: ['src/AuthRouter'] },
  { path: '/business/manager/setting', component: './business/manager/setting', Routes: ['src/AuthRouter'] },
];
export const sys = [
  { path: '/sys/manager/base', component: './sys/manager/base', Routes: ['src/AuthRouter'] },
  { path: '/sys/manager/user', component: './sys/manager/user', Routes: ['src/AuthRouter'] },
  { path: '/sys/manager/log', component: './sys/manager/log', Routes: ['src/AuthRouter'] },
  { path: '/sys/manager/role', component: './sys/manager/role', Routes: ['src/AuthRouter'] },
];
