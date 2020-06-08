/*
 * @Date: 2020-05-09 21:52:48
 * @LastEditTime: 2020-06-08 13:30:59
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  code?: number;
  productSubCode?: number;
  productTypeCode?: number;
  status?: number;
}

export interface EditeItemType {
  productId?: number;
  name: string;
  resume: string;
  iconUrl: string;
  brandCode: number;
  introduction: string;
  productSubs: ProductSubItemType[];
}

export interface ProductSubItemType {
  name: string;
  shortName: string;
  iconUrl: string;
  facePrice: number;
  isDelete: 'Y' | 'N';
}

export interface EditeItemSubType {
  productSubId?: number | string;
  productCode?: number;
  uuid?: string;
  name: string;
  shortName: string;
  facePrice: number | string;
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
 * @param {number} productId
 */
export async function remove(productId: number): Promise<any> {
  return request('/goods/deleteProduct', {
    method: 'POST',
    data: {
      productId,
    },
  });
}
/**
 * @name: 获取详情
 * @param {string} categoryCode
 */
export async function getInfo(productId: string): Promise<any> {
  return request('/goods/getProduct', {
    method: 'POST',
    data: {
      productId,
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
export async function queryListSub(productCode?: number, name?: string): Promise<any> {
  return request('/goods/getProductSubList', {
    method: 'POST',
    data: {
      productCode,
      name,
    },
  });
}

/**
 * @name: 子产品列表
 * @param {number} productCode
 */
export async function removeSub(productSubId?: number): Promise<any> {
  return request('/goods/deleteProductSub', {
    method: 'POST',
    data: {
      productSubId,
    },
  });
}
