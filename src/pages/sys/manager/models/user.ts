/*
 * @Date: 2020-05-09 11:43:12
 * @LastEditTime: 2020-05-09 14:32:43
 */
import { Effect } from 'dva';

import { queryList } from '../services/user';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface UserItemType {
  roleName: string;
  createTime: string;
  userId: number;
  userName: string;
  roleCode: number;
  id: number;
  realname: string;
  status: number;
}

export interface UserModelState extends TableListData<UserItemType> {}

export interface UserModelType {
  namespace: string;
  state: UserModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: UserModelType = {
  namespace: 'sysManagerUser',
  state: {
    list: [],
    total: 0,
  },

  effects: {
    *fetchList({ queryParams, callback }, { call, put }) {
      const [err, data, msg] = yield call(queryList, queryParams);
      if (!err) {
        yield put({
          type: 'setList',
          payload: data,
        });
      }
    },
  },

  reducers: {
    setList: produce((draft: Draft<UserModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
