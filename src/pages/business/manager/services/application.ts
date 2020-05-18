/*
 * @Date: 2020-05-09 21:52:38
 * @LastEditTime: 2020-05-16 15:58:44
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  merchantId?: number;
}

export interface EditeItemType {
  merchantId?: number;
  iconUrl: string;
  appName: string;
  resume: string;
  industry: string;
  remark: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/application/searchApplication', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/application/addApplication', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/application/modifyApplication', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} appId
 */
export async function remove(appId: number): Promise<any> {
  return request('/application/disableApplication', {
    method: 'POST',
    data: {
      appId,
    },
  });
}
