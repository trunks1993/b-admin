/*
 * @Date: 2020-05-09 21:52:27
 * @LastEditTime: 2020-05-14 22:01:49
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  token?: number;
  code?: number;
  identifyType?: string;
  status?: number;
  telephone?: number;
  merchantName?: string;
}

export interface EditeItemType {}

export interface VerifyType {
  id: number;
  userId: number;
  realname: string;
  auditResult: string;
  rejectText: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/merchant/searchIdentifyWorkorder', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 获取详情
 * @param {number} id
 */
export async function getInfo(id: number): Promise<any> {
  return request('/merchant/getIdentifyWorkorder', {
    method: 'POST',
    data: {
      id,
    },
  });
}

/**
 * @name: 审批认证信息
 * @param {number} id
 */
export async function verify(data: VerifyType): Promise<any> {
  return request('/merchant/audit', {
    method: 'POST',
    data,
  });
}
