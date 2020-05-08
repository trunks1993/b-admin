import request from '@/utils/request';
import md5 from 'js-md5';

export interface LoginParamsType {
  userName: string;
  password: string;
}

export async function fakeAccountLogin(data: LoginParamsType): Promise<any> {
  return request('/sys/login', {
    method: 'POST',
    data,
  });
}
