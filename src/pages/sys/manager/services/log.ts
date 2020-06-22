/*
 * @Date: 2020-06-17 17:02:39
 * @LastEditTime: 2020-06-17 17:05:10
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  operateName: string;
  moudle: string;
  beginTime: string;
  endTime: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/sys/searchSysOperateLogList', {
    method: 'POST',
    data,
  });
}
