/*
 * @Date: 2020-05-19 10:02:46
 * @LastEditTime: 2020-11-11 21:27:46
 */

import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  orderId?: number;
  rechargeAccount?: number;
  status?: number;
  beginCreateTime?: string;
  endCreateTime?: string;
  merchantId?: number;
  customerOrderNo?: number;
}

export interface QueryTraceParamsType extends BaseQueryType {
  itemCode: number | string;
}

export interface EditParamsType {
  userId: number;
  realname: string;
  orderId: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/merchant/order/searchMerSubscribeOrderList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 取消订单
 * @param {number} orderId
 */
export async function cancel(orderId: number): Promise<any> {
  return request('/merchant/order/cancelOrder', {
    method: 'POST',
    data: {
      orderId,
    },
  });
}

/**
 * @name: 发货
 * @param {number} orderId
 */
export async function deliver(orderId: number): Promise<any> {
  return request('/merchant/order/deliverOrder', {
    method: 'POST',
    data: {
      orderId,
    },
  });
}

/**
 * @name: 详情
 * @param {number} orderId
 */
export async function getInfo(orderId: number): Promise<any> {
  return request('/merchant/order/getOrderInfo', {
    method: 'POST',
    data: {
      orderId,
    },
  });
}

/**
 * @name: 查询详情列表
 * @param {QueryParamsType} data
 */
export async function queryListTrace(data: QueryTraceParamsType): Promise<any> {
  return request('/merchant/order/searchOrderChargeTraceList', {
    method: 'POST',
    data,
  });
}

/**
 * @name:
 */
export async function downloadBigPurchaseOrder(data: any): Promise<any> {
  return request('/report/downloadBigPurchaseOrder', {
    method: 'POST',
    data,
  });
}
