/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-05-23 15:49:12
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  status: number;
  supplierCode: number;
  bizType: number;
  code: number;
  goodsCode: number;
  beginCreateTime: string;
  endCreateTime: string;
}

export interface GoodsItemType {
  goodsCode: number;
  purchasePrice: number;
  taxRate: number;
  fileUrl: string;
  count?: number;
}

export interface EditeItemType {
  data: GoodsItemType[];
  supplierCode: number;
  remark: string;
  importTime: string; // 入库时间
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/goods/searchWorkorderList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/goods/batchImportGoodsInventory', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {QueryParamsType} data
 */
export async function check(goodsCode: number, fileUrl: string): Promise<any> {
  return request('/goods/checkStockInQuantity', {
    method: 'POST',
    data: {
      goodsCode,
      fileUrl,
    },
  });
}

/**
 * @name: 详情
 * @param {type}
 */
export async function getInfo(status: number, code: string): Promise<any> {
  return request('/goods/getWorkorder', {
    method: 'POST',
    data: {
      status,
      code,
    },
  });
}
