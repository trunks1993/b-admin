/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-05-20 12:15:09
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

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/merchant/bankroll/searchRechargeWorkorderList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {number} code
 * @param {number} status
 */
export async function modify(code: number, status: number): Promise<any> {
  return request('/merchant/bankroll/modifyRechargeWorkorder', {
    method: 'POST',
    data: {
      code,
      status,
    },
  });
}
