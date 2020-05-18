/*
 * @Date: 2020-05-09 21:53:29
 * @LastEditTime: 2020-05-12 22:33:29
 */
import { Effect } from 'dva';

import { queryList } from '../services/auth';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  name: string;
  status?: number;
  iconUrl?: string;
  createTime?: string;
  goodsCount?: number;
  brandName?: string;
}

export interface AuthModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: AuthModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'businessManagerAuth',
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
    setList: produce((draft: Draft<AuthModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
