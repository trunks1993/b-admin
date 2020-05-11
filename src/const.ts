/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-11 15:55:16
 */

export const DEFAULT_PAGE_NUM = 1; // 默认页码
export const DEFAULT_PAGE_SIZE = 10; // 默认每页条数

export const METHOD_POST = 'POST'; // post

// 不需要带token的api
export const whiteUrls = [process.env.BASE_API + '/sys/login'];

// 空选状态菜单
export const DEFAULT_ACTIVE_MENU = 1; // 默认每页条数

// 用户状态
export const USER_STATUS_NORMAL = 0; // 默认每页条数
export const USER_STATUS_FEEZE = 1; // 默认每页条数
export const USER_STATUS_BLACKLIST = 2; // 默认每页条数

export const UserStatuMap = {
  [USER_STATUS_NORMAL]: '正常',
  [USER_STATUS_FEEZE]: '冻结',
  [USER_STATUS_BLACKLIST]: '黑名单',
};

// 商品列表常量
export const PRODUCT_STATUS_1 = 1; // 销售中
export const PRODUCT_STATUS_2 = 2; // 已售罄
export const PRODUCT_STATUS_3 = 3; // 仓库中

export const ProductStatus = {
  [PRODUCT_STATUS_1]: '销售中',
  [PRODUCT_STATUS_2]: '已售罄',
  [PRODUCT_STATUS_3]: '仓库中',
};

// 商品类型常量
export const PRODUCT_TYPE_1 = 101; // 卡密
export const PRODUCT_TYPE_2 = 102; // 兑换码
export const PRODUCT_TYPE_3 = 103; // 短链接
export const PRODUCT_TYPE_4 = 104; // 直充

export const ProductTypes = {
  [PRODUCT_TYPE_1]: '卡密',
  [PRODUCT_TYPE_2]: '兑换码',
  [PRODUCT_TYPE_3]: '短链接',
  [PRODUCT_TYPE_4]: '直充',
};
