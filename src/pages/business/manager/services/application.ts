/*
 * @Date: 2020-05-09 21:52:38
 * @LastEditTime: 2020-05-18 19:37:00
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  merchantId?: number;
}

export interface EditeItemType {
  appId?: number;
  merchantId?: number;
  iconUrl: string;
  appName: string;
  resume: string;
  industry: string;
  nologinUrl?: string;
  callbackUrl?: string;
  virtualChargeUrl?: string;
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

/** 详情
 * @name:
 * @param {type}
 */
export async function getInfo(appId: number): Promise<any> {
  return request('/application/getApplication', {
    method: 'POST',
    data: {
      appId,
    },
  });
}
