/*
 * @Date: 2020-05-09 21:52:05
 * @LastEditTime: 2020-05-16 17:40:42
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';
import { ListItemType } from '../models/list';

export interface QueryParamsType extends BaseQueryType {
  code?: number;
  productSubCode?: number;
  productTypeCode?: number;
  status?: number;
}

export interface EditeItemType extends ListItemType{
  resume: string; // 描述
  purchaseNotes: string; // 购买须知
  usageIllustration: string; // 使用须知
  facePrice: number; // 官方价格
  stockType: 1 | 2; // 库存扣减方式
  goodsId?: number;
  undisplayStock?: 'Y' | 'N' // 商品详情不显示剩余件数
  upType: 1 | 2 | 3; //
  upTime: string;
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
  return request('/goods/modifyGoods', {
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
 * @param {string} goodsId
 */
export async function getInfo(goodsId: string): Promise<any> {
  return request('/goods/getGoodsById', {
    method: 'POST',
    data: {
      goodsId,
    },
  });
}
