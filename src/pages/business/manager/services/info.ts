/*
 * @Date: 2020-05-09 21:52:05
 * @LastEditTime: 2020-05-18 14:13:55
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
  return request('/user/searchMerchantList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/user/addMerchant', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/user/modifyMerchant', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number[] | string[]} goodsIds
 */
export async function remove(goodsIds: number[] | string[]): Promise<any> {
  return request('/goods/deleteGoods', {
    method: 'POST',
    data: {
      goodsIds,
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
 * @param {number} merchantId
 */
export async function getInfo(merchantId: number): Promise<any> {
  return request('/user/getMerchant', {
    method: 'POST',
    data: {
      merchantId,
    },
  });
}
