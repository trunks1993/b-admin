/*
 * @Date: 2020-05-09 21:52:27
 * @LastEditTime: 2020-05-14 22:01:49
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {}

export interface EditeItemType {
  categoryCode?: number;
  name?: string;
  iconUrl?: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/category/getCategoryList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 新增
 * @param {EditeItemType} data
 */
export async function add(data: EditeItemType): Promise<any> {
  return request('/category/addCategory', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {EditeItemType} data
 */
export async function modify(data: EditeItemType): Promise<any> {
  return request('/category/modifyCategory', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} categoryCode
 */
export async function remove(categoryCode: number): Promise<any> {
  return request('/category/deleteCategory', {
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
  return request('/category/loadCategoryInfo', {
    method: 'POST',
    data: {
      categoryCode,
    },
  });
}

/**
 * @name: 获取商品分组树形菜单 
 * @param {type} 
 */
export async function getCategoryTree(): Promise<any> {
  return request('/category/getCategoryTree', {
    method: 'POST',
  });
}
