/*
 * @Date: 2020-05-09 21:52:48
 * @LastEditTime: 2020-05-12 22:30:23
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';
import { ListItemType } from '../models/management';

export interface QueryParamsType extends BaseQueryType {
  code?: number;
  productSubCode?: number;
  productTypeCode?: number;
  status?: number;
}

export interface EditeItemType extends ListItemType {
  resume: string; // 描述
  purchaseNotes: string; // 购买须知
  usageIllustration: string; // 使用说明
  facePrice: number; // 官方价格
}

export interface EditeItemSubType {
  productSubId?: number;
  name: string;
  shortName: string;
  facePrice: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/goods/searchProductList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/goods/addProduct', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/goods/modifyProduct', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} categoryCode
 */
export async function remove(categoryCode: number): Promise<any> {
  return request('/goods/deleteProduct', {
    method: 'POST',
    data: {
      categoryCode,
    },
  });
}
/**
 * @name: 获取详情
 * @param {number} categoryCode
 */
export async function getInfo(categoryCode: number): Promise<any> {
  return request('/goods/getProduct', {
    method: 'POST',
    data: {
      categoryCode,
    },
  });
}

/**
 * @name: 新增子产品
 * @param {EditeItemType} data
 */
export async function addSub(data: EditeItemSubType): Promise<any> {
  return request('/goods/addProductSub', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改子产品
 * @param {EditeItemSubType} data
 */
export async function modifySub(data: EditeItemSubType): Promise<any> {
  return request('/goods/modifyProductSub', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 子产品详情
 * @param {number} productSubId
 */
export async function getInfoSub(productSubId: number): Promise<any> {
  return request('/goods/getProductSub', {
    method: 'POST',
    data: {
      productSubId,
    },
  });
}

/**
 * @name: 子产品列表
 * @param {number} productCode
 */
export async function queryListSub(productCode: number): Promise<any> {
  return request('/goods/getProductSubList', {
    method: 'POST',
    data: {
      productCode,
    },
  });
}
