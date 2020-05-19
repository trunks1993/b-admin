/*
 * @Date: 2020-05-19 23:41:06
 * @LastEditTime: 2020-05-19 23:43:06
 */

import { Effect } from 'dva';

import { queryList } from '../services/pos';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  merchantId: number;
  accountNo: number;
  type: number;
  amount: number;
  frozeAmount: number;
  doorsillAmount: number;
  status: number;
  createTime: string;
  modifyTime: string;
}

export interface PosModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: PosModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'financeManagerPos',
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
    setList: produce((draft: Draft<PosModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
