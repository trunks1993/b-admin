/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-06-09 10:58:08
 */

export const DEFAULT_PAGE_NUM = 1; // 默认页码
export const DEFAULT_PAGE_SIZE = 10; // 默认每页条数
export const TRANSTEMP = 10000; // 金额转换倍数
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

export const PRICE_STATUS_1 = 1; // 正常
export const PRICE_STATUS_2 = 2; // 失效
export const PriceStatus = {
  [PRICE_STATUS_1]: '正常',
  [PRICE_STATUS_2]: '失效',
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
  [MERCHANT_STATUS_0]: '未认证',
  [MERCHANT_STATUS_1]: '待审核',
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

export const TRANSACTION_TYPE_1 = 1;
export const TRANSACTION_TYPE_2 = 2;

export const TransactionTypes = {
  [TRANSACTION_TYPE_1]: '批采',
  [TRANSACTION_TYPE_2]: '直充',
};

export const TRACE_STATUS_1 = 1; // 初始
export const TRACE_STATUS_2 = 2; // 已支付
export const TRACE_STATUS_3 = 3; // 处理中
export const TRACE_STATUS_4 = 4; // 待工单处理
export const TRACE_STATUS_5 = 5; // 成功
export const TRACE_STATUS_6 = 6; // 失败
export const TRACE_STATUS_7 = 7; // 取消

export const TraceStatus = {
  [TRACE_STATUS_1]: '初始',
  [TRACE_STATUS_2]: '已支付',
  [TRACE_STATUS_3]: '处理中',
  [TRACE_STATUS_4]: '待工单处理',
  [TRACE_STATUS_5]: '成功',
  [TRACE_STATUS_6]: '失败',
  [TRACE_STATUS_7]: '取消',
};

export const ORDER_STATUS_1 = 1; // 待付款
export const ORDER_STATUS_2 = 2; // 待发货
export const ORDER_STATUS_3 = 3; // 待充值
export const ORDER_STATUS_4 = 4; // 已完成
export const ORDER_STATUS_5 = 5; // 已取消

export const OrderStatus = {
  [ORDER_STATUS_1]: '待付款',
  [ORDER_STATUS_2]: '待发货',
  [ORDER_STATUS_3]: '待充值',
  [ORDER_STATUS_4]: '已完成',
  [ORDER_STATUS_5]: '已取消',
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

// 财务
export const RECHARGE_STATUS_1 = 1; // 待确认
export const RECHARGE_STATUS_2 = 2; // 已确认
export const RECHARGE_STATUS_3 = 3; // 关闭

export const RechargeStatus = {
  [RECHARGE_STATUS_1]: '待确认',
  [RECHARGE_STATUS_2]: '已确认',
  [RECHARGE_STATUS_3]: '关闭',
};

export const BIZ_TYPE_1 = 1; // 充值
export const BIZ_TYPE_2 = 2; // 提现
export const BIZ_TYPE_3 = 3; // 采购
export const BIZ_TYPE_4 = 4; // 加款
export const BIZ_TYPE_5 = 5; // 减款

export const BizTypes = {
  [BIZ_TYPE_1]: '充值',
  [BIZ_TYPE_2]: '提现',
  [BIZ_TYPE_3]: '采购',
  [BIZ_TYPE_4]: '加款',
  [BIZ_TYPE_5]: '减款',
};

// 库存
export const STOCK_STATUS_1 = 1; // 正常
export const STOCK_STATUS_2 = 2; // 低库存
export const STOCK_STATUS_3 = 3; // 积压

export const StockStatus = {
  [STOCK_STATUS_1]: '正常',
  [STOCK_STATUS_2]: '低库存',
  [STOCK_STATUS_3]: '积压',
};

export const SUPPLIER_STATUS_1 = 0; // 正常
export const SUPPLIER_STATUS_2 = 1; // 冻结
export const SUPPLIER_STATUS_3 = 2; // 黑名单

export const SupplierStatus = {
  [SUPPLIER_STATUS_1]: '正常',
  [SUPPLIER_STATUS_2]: '冻结',
  [SUPPLIER_STATUS_3]: '黑名单',
};

export const WAREHOUSING_STATUS_1 = 1;
export const WAREHOUSING_STATUS_2 = 2;
export const WAREHOUSING_STATUS_3 = 3;
export const WAREHOUSING_STATUS_4 = 4;
export const WAREHOUSING_STATUS_5 = 5;
export const WAREHOUSING_STATUS_6 = 6;
export const WAREHOUSING_STATUS_7 = 7;
export const WAREHOUSING_STATUS_8 = 8;
export const WAREHOUSING_STATUS_9 = 9;
export const WAREHOUSING_STATUS_10 = 10;

export const WarehousingStatus = {
  [WAREHOUSING_STATUS_1]: '初始',
  [WAREHOUSING_STATUS_2]: '待处理',
  [WAREHOUSING_STATUS_3]: '采购接口调用失败',
  [WAREHOUSING_STATUS_4]: '处理中',
  [WAREHOUSING_STATUS_5]: '查单成功',
  [WAREHOUSING_STATUS_6]: '查单失败',
  [WAREHOUSING_STATUS_7]: '入库中',
  [WAREHOUSING_STATUS_8]: '成功',
  [WAREHOUSING_STATUS_9]: '失败',
  [WAREHOUSING_STATUS_10]: '渠道订单处理失败',
};

// 流水
export const WATER_STATUS_1 = 1;
export const WATER_STATUS_2 = 2;

export const WaterStatus = {
  [WATER_STATUS_1]: '出库',
  [WATER_STATUS_2]: '入库',
};

// 业务类型
export const WORK_TYPE_1 = 1;
export const WORK_TYPE_2 = 2;
export const WorkTypes = {
  [WORK_TYPE_1]: '批采',
  [WORK_TYPE_2]: '直充',
};

// 库存预警
export const STOCK_TYPE_1 = 1; // 件
export const STOCK_TYPE_2 = 2; // 天

export const StockType = {
  [STOCK_TYPE_1]: '固定预警',
  [STOCK_TYPE_2]: '动态预警',
};

//客服回访
export const UN_VISIT_1 = 1;
export const UN_VISIT_2 = 2;
export const UN_VISIT_3 = 3;

export const KEFU_VISIT = {
  [UN_VISIT_1]: '未回访',
  [UN_VISIT_2]: '已回访',
  [UN_VISIT_3]: '已转化',
};

// 线索来源
export const PRIMARY_SOURCE_1 = 'PC端官网';
export const PRIMARY_SOURCE_2 = '公众号';

export const SOURCE = {
  [PRIMARY_SOURCE_1]:[PRIMARY_SOURCE_1],
  [PRIMARY_SOURCE_2]:[PRIMARY_SOURCE_2],
}

/** 回访方式 */
export const WAY_RETURN_1 = '电话';
export const WAY_RETURN_2 = '在线客服';

export const WAY_RETURN_ALL = {
  [WAY_RETURN_1]:[WAY_RETURN_1],
  [WAY_RETURN_2]:[WAY_RETURN_2],
}
