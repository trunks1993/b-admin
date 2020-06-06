/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-06-01 20:58:54
 */

import request from '@/utils/request';

export interface EditeItemType {
  oldPassword: string;
  newPassword: string;
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

export async function changeUser(): Promise<any> {
  return request('/sys/getLoginInfo', {
    method: 'POST',
  });
}

export async function changePassword(data: EditeItemType): Promise<any> {
  return request('/sys/modifyPassword', {
    method: 'POST',
    data,
  });
}
