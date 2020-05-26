/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-22 23:36:27
 */
// 商品
export const product = [
  {
    path: '/product/manager/list',
    component: './product/manager/list',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/list/:id',
    component: './product/manager/list/edit',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/group',
    component: './product/manager/group',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/management',
    component: './product/manager/management',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/management/:id',
    component: './product/manager/management/edit',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/price',
    component: './product/manager/price',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/price/:id',
    component: './product/manager/price/edit',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/brand',
    component: './product/manager/brand',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/brand/:id',
    component: './product/manager/brand/edit',
    Routes: ['src/AuthRouter'],
  },
];
// 商户
export const business = [
  {
    path: '/business/manager/info',
    component: './business/manager/info',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/info/:id',
    component: './business/manager/info/edit',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/auth',
    component: './business/manager/auth',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/auth/:id',
    component: './business/manager/auth/edit',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/application',
    component: './business/manager/application',
    Routes: ['src/AuthRouter'],
  },

  {
    path: '/business/manager/application/:id',
    component: './business/manager/application/edit',
    Routes: ['src/AuthRouter'],
  },

  {
    path: '/business/manager/setting',
    component: './business/manager/setting',
    Routes: ['src/AuthRouter'],
  },
];
// 系统
export const sys = [
  { path: '/sys/manager/base', component: './sys/manager/base', Routes: ['src/AuthRouter'] },
  { path: '/sys/manager/user', component: './sys/manager/user', Routes: ['src/AuthRouter'] },
  { path: '/sys/manager/log', component: './sys/manager/log', Routes: ['src/AuthRouter'] },
  { path: '/sys/manager/role', component: './sys/manager/role', Routes: ['src/AuthRouter'] },
];
// 库存
export const stock = [
  {
    path: '/stock/manager/productStock',
    component: './stock/manager/productStock',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/stock/manager/suppliers',
    component: './stock/manager/suppliers',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/stock/manager/warehousing',
    component: './stock/manager/warehousing',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/stock/manager/warehousing/detail/:id',
    component: './stock/manager/warehousing/detail',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/stock/manager/warehousing/edit',
    component: './stock/manager/warehousing/edit',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/stock/manager/stockWater',
    component: './stock/manager/stockWater',
    Routes: ['src/AuthRouter'],
  },
];

// 订单
export const order = [
  {
    path: '/order/manager/transaction',
    component: './order/manager/transaction',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/order/manager/purchase',
    component: './order/manager/purchase',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/order/manager/purchase/:id',
    component: './order/manager/purchase/edit',
    Routes: ['src/AuthRouter'],
  },
];
//财务
export const finance = [
  { path: '/finance/manager/pos', component: './finance/manager/pos', Routes: ['src/AuthRouter'] },
  {
    path: '/finance/manager/details',
    component: './finance/manager/details',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/finance/manager/recharge',
    component: './finance/manager/recharge',
    Routes: ['src/AuthRouter'],
  },
];
