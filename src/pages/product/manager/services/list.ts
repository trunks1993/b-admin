/*
 * @Date: 2020-05-09 21:52:05
 * @LastEditTime: 2020-05-11 11:47:10
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  code?: number;
  productSubCode?: number;
  productTypeCode?: number;
}

export interface EditeItemType {
  goodsId?: number;
  productSubCode?: number;
  productTypeCode?: number;
  price?: number;
  purchaseNotes?: string;
  usageIllustration?: string;
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
  return request('/goods/searchGoodsList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/goods/addGoods', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/sys/modifyGoods', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} goodsId
 */
export async function remove(goodsId: number): Promise<any> {
  return request('/sys/deleteGoods', {
    method: 'POST',
    data: {
      goodsId,
    },
  });
}

/**
 * @name: 修改
 * @param {ModifyStatusParamType} data
 */
export async function modifyStatus(data: ModifyStatusParamType): Promise<any> {
  return request('/goods/modifyGoodsStatus', {
    method: 'POST',
    data,
  });
}
