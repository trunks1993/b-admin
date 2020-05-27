/*
 * @Date: 2020-05-19 10:02:46
 * @LastEditTime: 2020-05-27 19:27:38
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
