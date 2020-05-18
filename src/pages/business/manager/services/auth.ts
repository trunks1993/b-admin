/*
 * @Date: 2020-05-09 21:52:27
 * @LastEditTime: 2020-05-18 14:13:47
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
  return request('/user/searchIdentifyWorkorder', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 获取详情
 * @param {number} id
 */
export async function getInfo(id: number): Promise<any> {
  return request('/user/getIdentifyWorkorder', {
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
  return request('/user/audit', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 审批认证信息
 * @param {number[] | string[]} merchantIds
 */
export async function remove(merchantIds: number[] | string[]): Promise<any> {
  return request('/user/batchDeleteIdentifyWorkorder', {
    method: 'POST',
    data: {
      merchantIds,
    },
  });
}
