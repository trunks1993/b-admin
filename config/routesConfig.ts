/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-06-08 14:08:25
 */
// 商品
export const product = [
  {
    path: '/product/manager/list',
    component: './product/manager/list',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/list/edit',
    component: './product/manager/list/edit',
    from: '/product/manager/list',
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
    path: '/product/manager/management/edit',
    component: './product/manager/management/edit',
    from: '/product/manager/management',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/price',
    component: './product/manager/price',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/price/edit',
    component: './product/manager/price/edit',
    from: '/product/manager/price',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/brand',
    component: './product/manager/brand',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/product/manager/brand/edit',
    component: './product/manager/brand/edit',
    from: '/product/manager/brand',
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
    from: '/business/manager/info',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/auth',
    component: './business/manager/auth',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/auth/edit',
    component: './business/manager/auth/edit',
    from: '/business/manager/auth',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/business/manager/application',
    component: './business/manager/application',
    Routes: ['src/AuthRouter'],
  },

  {
    path: '/business/manager/application/edit',
    component: './business/manager/application/edit',
    from: '/business/manager/application',
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
    path: '/stock/manager/earlyWarn',
    component: './stock/manager/earlyWarn',
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
    from: '/stock/manager/warehousing',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/stock/manager/warehousing/edit',
    component: './stock/manager/warehousing/edit',
    from: '/stock/manager/warehousing',
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
    from: '/order/manager/purchase',
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
//客服
export const service = [
  {
    path: '/service/manager/salesLeads',
    component: './service/manager/salesLeads',
    Routes: ['src/AuthRouter'],
  },
  {
    path: '/service/manager/salesLeads/edit',
    component: './service/manager/salesLeads/edit',
    from: '/service/manager/salesLeads',
    Routes: ['src/AuthRouter'],
  },
];
