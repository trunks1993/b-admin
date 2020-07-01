import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
 
}
/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/goods/stock/searchForewarnList', {
    method: 'POST',
    data,
  });
}
export interface EditeItemType {
  setType?: number | string;
  goodsCode?: string[] | string | number | number[];
  upLimit?: number;
  lowerLimit?: number;
  leastDay?: number;
  mostDay?: number;
  forewarnCode?: string | number;
  status?: string | number;
}
/**
 * @name 新增/修改库存预警规则
 */
export async function setStockList(data: EditeItemType): Promise<any>{
  return request('/goods/modifyInventoryForewarn', {
    method: 'POST',
    data,
  });
}
/**
 * @name 批量修改库存预警规则
 */
export async function setStockLists(data: EditeItemType): Promise<any>{
  return request('/goods/batchModifyInventoryForewarn', {
    method: 'POST',
    data,
  });
}
export interface EditeItemRule {
  forewarnCode?: number | string;
  status?: number | string;
}
/**
 * @name 设置库存规则是否生效
 */
export async function setStockRule(data: EditeItemRule): Promise<any>{
  return request('/goods/modifyInventoryForewarnStatus', {
    method: 'POST',
    data,
  });
}

export interface ButtonType {
  value?: string;
}
/**
 * @name 设置预警按钮状态
 */
export async function setButtonType(data: ButtonType): Promise<any>{
  return request('/goods/controlInventoryForewarnStatus', {
    method: 'POST',
    data,
  });
}

/**
 * @name 获取预警按钮状态
 */
export async function getButtonType(): Promise<any>{
  return request('/goods/searchForewarnStatus', {
    method: 'POST',
  });
}
  
