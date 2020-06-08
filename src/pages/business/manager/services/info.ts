/*
 * @Date: 2020-05-09 21:52:05
 * @LastEditTime: 2020-06-08 13:39:22
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';
import { ListItemType } from '../models/info';

export interface QueryParamsType extends BaseQueryType {
  minTime?: string;
  maxTime?: string;
  merchantName?: string;
  merchantType?: 1 | 2 | 3;
  status?: 1 | 2;
  merchantId?: number;
  telephone?: number;
}

export interface EditeItemType extends ListItemType {
}

export interface ModifyStatusParamType {
  goodsIds: string[] | number[];
  status: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/merchant/searchMerchantList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/merchant/addMerchant', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/merchant/modifyMerchant', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} merchantId
 */
export async function remove(merchantId: number): Promise<any> {
  return request('/merchant/deleteMerchant', {
    method: 'POST',
    data: {
      merchantId,
    },
  });
}

/**
 * @name: 修改状态
 * @param {ModifyStatusParamType} data
 */
export async function modifyStatus(data: ModifyStatusParamType): Promise<any> {
  return request('/goods/modifyGoodsStatus', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 获取详情
 * @param {string} merchantId
 */
export async function getInfo(merchantId: string): Promise<any> {
  return request('/merchant/getMerchant', {
    method: 'POST',
    data: {
      merchantId,
    },
  });
}
