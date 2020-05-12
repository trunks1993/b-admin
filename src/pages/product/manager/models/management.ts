/*
 * @Date: 2020-05-09 21:53:38
 * @LastEditTime: 2020-05-12 19:59:56
 */
import { Effect } from 'dva';

import { queryList } from '../services/management';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  brandCode: number;
  name: string;
  resume: string;
  status: number;
  introduction: string;
  brandName: string;
}

export interface ManagementModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: ManagementModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'productManagement',
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
    setList: produce((draft: Draft<ManagementModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
