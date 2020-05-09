/*
 * @Date: 2020-05-09 11:43:12
 * @LastEditTime: 2020-05-09 21:56:04
 */
import { Effect } from 'dva';

import { queryList } from '../services/list';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  roleName: string;
  createTime: string;
  userId: number;
  userName: string;
  roleCode: number;
  id: number;
  realname: string;
  status: number;
}

export interface ListModelState extends TableListData<ListItemType> {}

export interface ListModelType {
  namespace: string;
  state: ListModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ListModelType = {
  namespace: 'productManagerList',
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
    setList: produce((draft: Draft<ListModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
