/*
 * @Date: 2020-05-09 21:53:29
 * @LastEditTime: 2020-05-22 21:59:08
 */
import { Effect } from 'dva';

import { queryList } from '../services/price';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  merchantId: number;
  goodsTypeCode: number;
  price: number;
  goodsTypeName: string;
  facePrice: number;
  id: number;
  goodsCode: 1000000017;
  shortName: string;
  goodsName: string;
  status: number;
  iconUrl: string;
}

export interface GroupModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: GroupModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'productManagerPrice',
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
    setList: produce((draft: Draft<GroupModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
