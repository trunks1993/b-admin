/*
 * @Date: 2020-05-19 23:41:06
 * @LastEditTime: 2020-05-20 17:31:10
 */

import { Effect } from 'dva';

import { queryList } from '../services/warehousing';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  supplierCode: number;
  supplierName: string;
  buynerType: number;
  bizType: number;
  innerOrderId: number;
  goodsCode: number;
  reqUrl: string;
  reqParam: string;
  response: string;
  reqMethod: string;
  reqType: string;
  orderId: string;
  status: number;
  retryTimes: number;
  outerOrderStatus: string;
  outerReturnCode: string;
  outerReturnMessage: string;
  processStartTime: string;
  completeTime: string;
  processType: number;
  createTime: string;
  modifyTime: string;
}

export interface WarehousingModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: WarehousingModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'stockManagerWarehousing',
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
    setList: produce((draft: Draft<WarehousingModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
