/*
 * @Date: 2020-05-07 15:23:35
 * @LastEditTime: 2020-06-18 10:09:23
 */
import { Effect } from 'dva';

import { queryList } from '../services/log';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  operateId: number;
  operateName: string;
  // operateType: 'UPDATE';
  moudle: string;
  content: string;
  createTime: string;
}

export interface LogModelState extends TableListData<ListItemType> {}

export interface ModelType {
  namespace: string;
  state: LogModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'sysManagerLog',
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
    setList: produce((draft: Draft<LogModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
