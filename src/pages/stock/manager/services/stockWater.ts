/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-11-11 21:40:50
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  // code: number; // '业务单号';
  // merchantId: number; // '商户号';
  // bizType: number; // '业务类型1:充值; 2:提现; 3:采购;4:加款;5:减款';
  // accountNo: number; // '账户编号';
  // type: number; // '收支类型1:收入; 2:支出';
  // orderNo: number; // '关联订单号';
  // beginTime: string; // '账单开始时间';
  // endTime: string; // '账单结束时间';
  code: number;
  orderNo: number;
  type: number;
  goodsCode: number;
  goodsName: string;
  beginCreateTime: string;
  endCreateTime: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/goods/stock/searchGoodsStockTraceList', {
    method: 'POST',
    data,
  });
}

/**
 * @name:
 */
export async function downloadBigGoodsStockTrace(data: any): Promise<any> {
  return request('/report/downloadBigGoodsStockTrace', {
    method: 'POST',
    data,
  });
}
