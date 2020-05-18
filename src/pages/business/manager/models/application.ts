/*
 * @Date: 2020-05-09 21:53:19
 * @LastEditTime: 2020-05-18 13:49:10
 */
import { Effect } from 'dva';

import { queryList } from '../services/application';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  merchantId?: number;
  code?: number;
  iconUrl?: string;
  appKey?: string;
  appSecret?: string;
  appName?: string;
  resume?: string;
  industry?: number;
  nologinUrl?: string;
  callbackUrl?: string;
  virtualRecharge?: string;
  remark?: string;
  status?: number;
}

export interface ApplicationModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: ApplicationModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'businessManagerApplication',
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
    setList: produce((draft: Draft<ApplicationModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
