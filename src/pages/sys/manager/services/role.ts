import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {}

export interface EditeRoleItemType {
  code?: number;
  name: string;
  authorityCodes: number[];
  remark: string;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/sys/searchSysRoleList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} code
 */
export async function remove(code: number): Promise<any> {
  return request('/sys/deleteSysRole', {
    method: 'POST',
    data: {
      code,
    },
  });
}

/**
 * @name: 新增
 * @param {number} data
 */
export async function add(data: EditeRoleItemType): Promise<any> {
  return request('/sys/addSysRole', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {number} data
 */
export async function modify(data: EditeRoleItemType): Promise<any> {
  return request('/sys/modifySysRole', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 获取所有权限
 * @param {void}
 */
export async function getAuthorityList(): Promise<any> {
  return request('/sys/searchSysAuthorityList', {
    method: 'POST',
  });
}

/**
 * @name:
 * @param {number} code
 */
export async function getSysRoleInfo(code: number): Promise<any> {
  return request('/sys/getSysRoleInfo', {
    method: 'POST',
    data: {
      code,
    },
  });
}
