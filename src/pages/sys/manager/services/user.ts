/*
 * @Date: 2020-05-09 11:28:27
 * @LastEditTime: 2020-05-09 20:14:12
 */
import request from '@/utils/request';
import { BaseQueryType } from '@/services';

export interface QueryParamsType extends BaseQueryType {
  userName?: string;
  roleCode?: number;
  status?: number;
}

export interface EditeUserItemType {
  userId?: number;
  userName?: string;
  password?: string;
  realname?: string;
  roleCode?: number;
  remark?: string;
}

export interface ModifyUserStatusParamItem {
  userIds: string[] | number[];
  status: number;
}

/**
 * @name: 查询列表
 * @param {QueryParamsType} data
 */
export async function queryList(data: QueryParamsType): Promise<any> {
  return request('/sys/searchSysUserList', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 删除
 * @param {number} code
 */
export async function remove(userId: number): Promise<any> {
  return request('/sys/deleteSysUser', {
    method: 'POST',
    data: {
      userId,
    },
  });
}

/**
 * @name: 新增
 * @param {number} data
 */
export async function add(data: EditeUserItemType): Promise<any> {
  return request('/sys/addSysUser', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 修改
 * @param {number} data
 */
export async function modify(data: EditeUserItemType): Promise<any> {
  return request('/sys/modifySysUser', {
    method: 'POST',
    data,
  });
}

/**
 * @name: 获取用户信息
 * @param {number} userId
 */
export async function getSysUserInfo(userId: number): Promise<any> {
  return request('/sys/getSysUserInfo', {
    method: 'POST',
    data: {
      userId,
    },
  });
}

/**
 * @name: 批量修改用户状态
 * @param {void}
 */
export async function modifySysUserStatus(data: ModifyUserStatusParamItem): Promise<any> {
  return request('/sys/batchModifySysUserStatus', {
    method: 'POST',
    data,
  });
}
