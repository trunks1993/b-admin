/*
 * @Date: 2020-05-09 11:43:12
 * @LastEditTime: 2020-05-11 20:49:20
 */
import { Effect } from 'dva';

import { queryList } from '../services/info';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  productSubCode: number;
  productSubName: string;
  productCode: number; // 商品编码
  productName: string; // 商品名
  brandCode: number;
  brandName: string;
  productTypeCode: number; // 商品类型
  price: number;
  iconUrl: string;
  soldNum: number; // 销量
  status: number;
  stock: number;
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
