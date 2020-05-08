import request from '@/utils/request';

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
