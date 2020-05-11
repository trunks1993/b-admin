import { Effect } from 'dva';
import { Reducer } from 'redux';
import { produce, Draft } from 'immer';
import { getUserInfo, getMenuByToken } from '@/services/user';
import _ from 'lodash';
import { DEFAULT_ACTIVE_MENU } from '@/const';

export interface MenuType {
  code: number; // 唯一标识
  parentCode: number; // 父级标识
  name: string; // 菜单名字
  level: number; // 层级
  isLeaf: 'Y' | 'N'; // 是否为叶子节点 'Y/N'
  uri: string; // 前端路由
  children: MenuType[];
}

export interface UserModelState {
  menus: MenuType[];
  user: UserType;
  level1MenuMap: { [key: number]: MenuType[] };
  level2MenuMap: { [key: number]: MenuType };
  level3MenuMap: { [key: string]: MenuType };
  activeMenu: number;
  activeLeafMenu: number;
}

export interface UserType {
  realname?: string;
  headIcon?: string;
}

interface ModelType {
  namespace?: string;
  state: UserModelState;
  effects: {
    getUser: Effect;
    getMenu: Effect;
    getActiveMenuItem: Effect;
    getActiveLeafMenuItem: Effect;
  };
  reducers: {
    setMenu: Reducer;
    setUser: Reducer;
    setActiveMenuItem: Reducer;
    setActiveLeafMenuItem: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'user',

  state: {
    menus: [],
    user: {},
    level1MenuMap: {},
    level2MenuMap: {},
    level3MenuMap: {},
    activeMenu: DEFAULT_ACTIVE_MENU,
    activeLeafMenu: DEFAULT_ACTIVE_MENU,
  },

  effects: {
    *getUser({}, { call, put }) {
      let [err, data, msg] = yield call(getUserInfo);
      if (!err) {
        yield put({
          type: 'setUser',
          payload: data,
        });
      }
    },
    *getMenu({ callback }, { call, put }) {
      let [err, data, msg] = yield call(getMenuByToken);
      if (!err) {
        yield put({
          type: 'setMenu',
          payload: data.menuData,
        });
        typeof callback === 'function' && callback();
      }
    },
    *getActiveMenuItem({ code }, { call, put }) {
      yield put({
        type: 'setActiveMenuItem',
        payload: code,
      });
    },
    *getActiveLeafMenuItem({ code, callback }, { call, put }) {
      yield put({
        type: 'setActiveLeafMenuItem',
        payload: code,
      });
      typeof callback === 'function' && callback();
    },
  },

  reducers: {
    setUser: produce((draft: Draft<UserModelState>, { payload }): void => {
      draft.user = payload;
    }),
    setMenu: produce((draft: Draft<UserModelState>, { payload }): void => {
      const level1MenuMap = {};
      const level2MenuMap = {};
      const level3MenuMap = {};
      _.forEach(payload, item => {
        level1MenuMap[item.code] = item.children;
        _.forEach(item.children, item => {
          level2MenuMap[item.code] = item;
          _.forEach(item.children, item => {
            level3MenuMap[item.uri] = item;
          });
        });
      });
      draft.menus = payload;
      draft.level1MenuMap = level1MenuMap;
      draft.level2MenuMap = level2MenuMap;
      draft.level3MenuMap = level3MenuMap;
    }),
    setActiveMenuItem: produce((draft: Draft<UserModelState>, { payload }): void => {
      draft.activeMenu = payload;
    }),
    setActiveLeafMenuItem: produce((draft: Draft<UserModelState>, { payload }): void => {
      draft.activeLeafMenu = payload;
    }),
  },
};

export default Model;
