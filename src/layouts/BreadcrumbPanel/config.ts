/*
 * @Date: 2020-06-06 17:39:55
 * @LastEditTime: 2020-06-06 18:03:33
 */
// export  blackUrl = []
export const routes = [
  { path: '/', title: '首页' },
  { path: '/changeUser', title: '修改资料' },
  { path: '/changePassword', title: '修改密码' },

  { path: '/business', title: '商户' },
  { path: '/business/manager', title: '商户管理' },
  { path: '/business/manager/info', title: '商户资料' },
  { path: '/business/manager/auth', title: '商户认证' },
  { path: '/business/manager/application', title: '商户应用' },

  { path: '/product', title: '商品' },
  { path: '/product/manager', title: '商品管理' },
  { path: '/product/manager/list', title: '商品列表' },
  { path: '/product/manager/group', title: '商品分组' },
  { path: '/product/manager/management', title: '产品管理' },
  { path: '/product/manager/price', title: '商品定价' },
  { path: '/product/manager/brand', title: '品牌管理' },

  { path: '/finance', title: '财务' },
  { path: '/finance/manager', title: '财务管理' },
  { path: '/finance/manager/pos', title: '商户账户' },
  { path: '/finance/manager/recharge', title: '财务充值' },
  { path: '/finance/manager/details', title: '财务明细' },

  { path: '/order', title: '订单' },
  { path: '/order/manager', title: '订单管理' },
  { path: '/order/manager/purchase', title: '采购订单' },
  { path: '/order/manager/transaction', title: '交易订单' },

  { path: '/stock', title: '库存' },
  { path: '/stock/manager', title: '库存管理' },
  { path: '/stock/manager/productStock', title: '商品库存' },
  { path: '/stock/manager/suppliers', title: '供应商管理' },
  { path: '/stock/manager/stockWater', title: '库存流水' },
  { path: '/stock/manager/warehousing', title: '商品采购' },

  { path: '/sys', title: '系统' },
  { path: '/sys/manager', title: '系统管理' },
  { path: '/sys/manager/user', title: '用户管理' },
  { path: '/sys/manager/role', title: '角色管理' },
];
