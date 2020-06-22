/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-06-10 10:47:36
 */

import request from '@/utils/request';

export interface EditeItemType {
  oldPassword: string;
  newPassword: string;
}

export interface EditUserItemType {
  aliasName: string;
  remark?: string;
  headIcon?: string;
}

export async function getMenuByToken(): Promise<any> {
  return request('/sys/loadUserMenu', {
    method: 'POST',
  });
}

export async function getUserInfo(): Promise<any> {
  return request('/sys/getLoginInfo', {
    method: 'POST',
  });
}

export async function changeUser(data: EditUserItemType): Promise<any> {
  return request('/sys/modifyUserInfo', {
    method: 'POST',
    data,
  });
}

export async function changePassword(data: EditeItemType): Promise<any> {
  return request('/sys/modifyPassword', {
    method: 'POST',
    data,
  });
}
