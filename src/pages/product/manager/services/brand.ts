/*
 * @Date: 2020-05-09 21:52:38
 * @LastEditTime: 2020-05-11 23:22:13
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {}

export interface EditeItemType {
  categoryCode?: number;
  name?: string;
  iconUrl?: string;
}

export interface SetGroupParamsType {
  objCode: number;
  categoryCodes: number[];
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/brand/searchBrandList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/brand/addBrand', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/brand/modifyBrand', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} brandId
 */
export async function remove(brandId: number): Promise<any> {
  return request('/brand/deleteBrand', {
    method: 'POST',
    data: {
      brandId,
    },
  });
}
/**
 * @name: 获取详情
 * @param {number} brandId
 */
export async function getInfo(brandId: number): Promise<any> {
  return request('/brand/getBrand', {
    method: 'POST',
    data: {
      brandId,
    },
  });
}

/**
 * @name: 分组
 * @param {number} brandId
 */
export async function setGroup(data: SetGroupParamsType): Promise<any> {
  return request('/brand/saveBrandCategory', {
    method: 'POST',
    data,
  });
}
