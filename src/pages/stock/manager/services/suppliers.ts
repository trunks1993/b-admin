/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-11-05 10:31:48
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  status?: number;
  name?: string;
}

export interface EditeItemType {
  id?: number;
  name?: string;
  address?: string;
  mainTelephone?: string;
  mainContactName?: string;
  minorTelephone?: string;
  minorContactName?: string;
}

export interface SuppliersItemType {
  name?: string;
  goodsCode?: number;
  productTypeCode?: number;
  channelGoodsCode?: number;
  facePrice?: number;
  price?: number;
  priority?: number;
  singleBuyLimit?: number;
  taxPrice?: number;
  remark?: string;
  withTicket?: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/supplier/searchSupplierList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/supplier/addSupplier', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/supplier/modifySupplier', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} id
 */
export async function remove(id: number): Promise<any> {
  return request('/supplier/deleteSupplier', {
    method: 'POST',
    data: {
      id,
    },
  });
}

/**
 * @name: 批量修改状态
 * @param {number[] | string[]} ids
 * @param {number} status
 */
export async function batchModifyStatus(ids: number[] | string[], status: number): Promise<any> {
  return request('/supplier/batchModifyStatus', {
    method: 'POST',
    data: {
      ids,
      status,
    },
  });
}

export interface ModifyAmountParamsType {
  amount: number;
  userId: number;
  realname: string;
  suppliers: {
    supplierCode: number;
    accountNo: number;
  }[];
}

/**
 * @name: 批量修改状态
 * @param {ModifyAmountParamsType} data
 */
export async function batchModifyAmount(data: ModifyAmountParamsType): Promise<any> {
  return request('/supplier/batchModifyAmount', {
    method: 'POST',
    data,
  });
}

export interface GetGoodsChannelList {
  supplierCode?: number;
  pageSize: number;
  currPage: number;
  withTicket?: number;
  goods?: string;
}

export interface SetGoodsChannelList {
  goodsChannelList: object;
}

/**
 * @name: 获取关联商品列表
 * @param {GetGoodsChannelList} data
 */
export async function getGoodsChannelList(data: GetGoodsChannelList): Promise<any> {
  return request('/goods/getGoodsChannelList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 设置关联商品列表
 * @param {any} data
 */
export async function setGoodsChannelList(data: SetGoodsChannelList): Promise<any> {
  return request('/goods/updateGoodsChannelList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除关联商品列表
 * @param {} data
 */
export async function deleteGoodsChannelList(data: { id: number }): Promise<any> {
  return request('/goods/deleteGoodsChannel', {
    method: 'POST',
    data,
  });
}
