/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-09 17:55:33
 */

export const DEFAULT_PAGE_NUM = 1; // 默认页码
export const DEFAULT_PAGE_SIZE = 10; // 默认每页条数

export const METHOD_POST = 'POST'; // post

// 不需要带token的api
export const whiteUrls = [process.env.BASE_API + '/sys/login'];

// 空选状态菜单
export const DEFAULT_ACTIVE_MENU = 1; // 默认每页条数

// 用户状态
export const USER_STATUS_NORMAL = 0; // 默认每页条数
export const USER_STATUS_FEEZE = 1; // 默认每页条数
export const USER_STATUS_BLACKLIST = 2; // 默认每页条数

export const userStatuMap = {
  [USER_STATUS_NORMAL]: '正常',
  [USER_STATUS_FEEZE]: '冻结',
  [USER_STATUS_BLACKLIST]: '黑名单',
};
