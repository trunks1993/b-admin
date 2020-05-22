/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-05-21 16:57:08
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

// export interface QueryParamsType extends BaseQueryType {
//   code?: number;
//   productSubCode?: number;
//   productTypeCode?: number;
//   status?: number;
// }

export interface EditeItemType {
  goodsCode: number;
  supplierCode: number;
  buyNum: number;
  remark: string;
}

// /**
//  * @name: 查询列表
//  * @param {QueryParamsType} data
//  */
// export async function queryList(data: QueryParamsType): Promise<any> {
//   return request('/goods/searchGoodsList', {
//     method: 'POST',
//     data,
//   });
// }

/**
 * @name: 采购商品
 * @param {QueryParamsType} data
 */
export async function batchBuyGoods(data: EditeItemType): Promise<any> {
  return request('/goods/batchBuyGoods', {
    method: 'POST',
    data,
  });
}
