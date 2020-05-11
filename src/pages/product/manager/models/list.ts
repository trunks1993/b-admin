/*
 * @Date: 2020-05-09 11:43:12
 * @LastEditTime: 2020-05-11 16:04:51
 */
import { Effect } from 'dva';

import { queryList } from '../services/list';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  productSubCode: number;
  productSubName: string;
  productCode: number;
  productName: string;
  brandCode: number;
  brandName: string;
  productTypeCode: number;
  price: number;
  iconUrl: string;
  soldNum: number;
  status: number;
  stock: number;
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
