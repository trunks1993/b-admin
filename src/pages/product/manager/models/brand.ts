/*
 * @Date: 2020-05-09 21:53:19
 * @LastEditTime: 2020-05-14 21:47:33
 */
import { Effect } from 'dva';

import { queryList } from '../services/brand';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  name: string;
  code: number;
  iconUrl: string;
  resume: string;
  status: number;
}

export interface BrandModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: BrandModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'productManagerBrand',
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
    setList: produce((draft: Draft<BrandModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
