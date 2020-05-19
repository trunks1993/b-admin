/*
 * @Date: 2020-05-19 10:02:46
 * @LastEditTime: 2020-05-19 11:39:08
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  orderId?: number;
  rechargeAccount?: number;
  status?: number;
  beginCreateTime?: string;
  endCreateTime?: string;
  merchantId?: number;
  customerOrderNo?: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/merchant/order/searchMerTradeOrderList', {
    method: 'POST',
    data,
  });
}
