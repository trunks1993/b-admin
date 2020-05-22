/*
 * @Date: 2020-05-19 23:41:12
 * @LastEditTime: 2020-05-21 10:25:38
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
