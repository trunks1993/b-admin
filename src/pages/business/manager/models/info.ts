/*
 * @Date: 2020-05-09 11:43:12
 * @LastEditTime: 2020-05-22 13:05:11
 */
import { Effect } from 'dva';

import { queryList } from '../services/info';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  merchantType: 1 | 2 | 3;
  merchantId: number;
  merchantName: string;
  telephone: number; // 联系方式
  email: string; // 邮箱
  contactName: string; // 联系人
  status: 1 | 2;
}

export interface InfoModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: InfoModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'businessManagerInfo',
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
    setList: produce((draft: Draft<InfoModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
