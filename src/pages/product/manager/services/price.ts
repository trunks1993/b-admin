/*
 * @Date: 2020-05-09 21:52:27
 * @LastEditTime: 2020-05-23 14:57:35
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  goods?: string;
  brandId: number;
  status: 1 | 2; // '状态：1正常，2失效';
  merchantId: number;
  minPrice: number;
  maxPrice: number;
}

export interface PriceItemType {
  goodsCode: number;
  rebate: number;
  decMoney: number;
  price: number;
}

export interface EditeItemType {
  merchantId: number;
  isEffect: 'N' | 'Y';
  prices: PriceItemType[];
}

export interface ModifyStatusParamType {
  ids: string[] | number[];
  status: number;
}

export interface ModifyItemType {
  id?: number;
  merchantId?: number;
  goodsCode?: number;
  rebate?: number;
  decMoney?: number;
  price?: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/goods/searchMerGoodsPriceList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/goods/batchAddMerGoodsPrice', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {ModifyItemType} data
 */
export async function modify(data: ModifyItemType): Promise<any> {
  return request('/goods/modifyMerGoodsPrice', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number[]} ids
 */
export async function remove(ids: number[]): Promise<any> {
  return request('/goods/batchDeleteMerGoodsPrice', {
    method: 'POST',
    data: {
      ids,
    },
  });
}

/**
 * @name: 获取详情
 * @param {number} id
 */
export async function getInfo(id: number): Promise<any> {
  return request('/goods/getMerGoodsPrice', {
    method: 'POST',
    data: {
      id,
    },
  });
}

/**
 * @name: 修改状态
 * @param {ModifyStatusParamType} data
 */
export async function modifyStatus(data: ModifyStatusParamType): Promise<any> {
  return request('/goods/batchModifyMerGoodsPriceStatus', {
    method: 'POST',
    data,
  });
}
