/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-19 21:11:44
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
export const PRODUCT_STATUS_1 = 1; // 销售中|上架
export const PRODUCT_STATUS_2 = 2; // 已售罄|下架
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

// 上下架
// export const PRODUCT_STATUS_GROUNDING = 1; // 上架
// export const PRODUCT_STATUS_UNDERCARRIAGE = 2; // 下架
export const ProductStatusGU = {
  [PRODUCT_STATUS_1]: '上架',
  [PRODUCT_STATUS_2]: '下架',
};

// 商户认证
export const IDENTIFY_TYPE_1 = 1;
export const IDENTIFY_TYPE_2 = 2;
export const IDENTIFY_TYPE_3 = 3;

export const IdentifyTypes = {
  [IDENTIFY_TYPE_1]: '个人',
  [IDENTIFY_TYPE_2]: '企业',
  [IDENTIFY_TYPE_3]: '机关',
};

export const IDENTIFY_STATUS_1 = 1; // 待审核
export const IDENTIFY_STATUS_2 = 2; // 通过
export const IDENTIFY_STATUS_3 = 3; // 驳回

export const IdentifyStatus = {
  [IDENTIFY_STATUS_1]: '待审核',
  [IDENTIFY_STATUS_2]: '通过',
  [IDENTIFY_STATUS_3]: '驳回',
};

export const IDCARD_TYPE_1 = 1; // 身份证
export const IDCARD_TYPE_2 = 2; // 护照
export const IDCARD_TYPE_3 = 3; // 港澳台居民居住证

export const IdCardTypes = {
  [IDCARD_TYPE_1]: '身份证',
  [IDCARD_TYPE_2]: '护照',
  [IDCARD_TYPE_3]: '港澳台居民居住证',
};

// 商户资料
export const MERCHANT_STATUS_0 = 0; // 未认证
export const MERCHANT_STATUS_1 = 1; // 待审核
export const MERCHANT_STATUS_2 = 2; // 驳回
export const MERCHANT_STATUS_3 = 3; // 已认证

export const MerchantStatus = {
  [MERCHANT_STATUS_0]: '待审核',
  [MERCHANT_STATUS_1]: '通过',
  [MERCHANT_STATUS_2]: '驳回',
  [MERCHANT_STATUS_3]: '已认证',
};

// 交易订单
export const TRANSACTION_STATUS_1 = 1; // 初始
export const TRANSACTION_STATUS_2 = 2; // 待处理
export const TRANSACTION_STATUS_3 = 3; // 处理中
export const TRANSACTION_STATUS_4 = 4; // 成功
export const TRANSACTION_STATUS_5 = 5; // 失败

export const TransactionStatus = {
  [TRANSACTION_STATUS_1]: '初始',
  [TRANSACTION_STATUS_2]: '待处理',
  [TRANSACTION_STATUS_3]: '处理中',
  [TRANSACTION_STATUS_4]: '成功',
  [TRANSACTION_STATUS_5]: '失败',
};


export const ORDER_STATUS_1 = 1; // 待付款
export const ORDER_STATUS_2 = 2; // 待发货
export const ORDER_STATUS_4 = 4; // 已完成

export const OrderStatus = {
  [ORDER_STATUS_1]: '待付款',
  [ORDER_STATUS_2]: '待发货',
  [ORDER_STATUS_4]: '已完成',
};


export const PAY_METHOD_1 = 1; // 余额
export const PAY_METHOD_2 = 2; // 微信
export const PAY_METHOD_3 = 3; // 支付宝
export const PAY_METHOD_4 = 4; // 网银

export const PayMethods = {
  [PAY_METHOD_1]: '余额',
  [PAY_METHOD_2]: '微信',
  [PAY_METHOD_3]: '支付宝',
  [PAY_METHOD_4]: '网银',
};
