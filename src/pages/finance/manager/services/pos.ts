/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-06-04 20:04:16
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  accountNo?: number;
  merchantId: number;
  merchantName: string;
  status: 1 | 2; //'状态1有效，2冻结'
  beginTime: string;
  endTime: string;
}

export interface EditeItemType {
  merchantId: number;
  bizType: 4 | 5;
  amount: number;
  remark: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/merchant/searchMerchantAccount', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改-余额
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/merchant/adjustBalance', {
    method: 'POST',
    data,
  });
}
