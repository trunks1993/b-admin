/*
 * @Date: 2020-05-19 10:02:40
 * @LastEditTime: 2020-05-19 10:22:39
 */

import { Effect } from 'dva';

import { queryList } from '../services/transaction';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  orderId: number;
  merchantId: number;
  appCode: number;
  bizType: 1;
  customerOrderNo: string;
  goodsCode: number;
  goodsName: string;
  rechargeAccount: number;
  buyNumber: string;
  totalPay: number;
  payStatus: 1;
  payMethod: 1;
  status: 1 | 2 | 3 | 4 | 5; // '状态 - 1:初始; 2:待处理; 3:处理中; 4:成功; 5:失败',
  processStartTime: string;
  completeTime: string;
  processType: 1;
  workOrderNo: null;
  supplierCode: null;
  createTime: string;
  modifyTime: string;
  appInfo: null;
  orderDetailList: null;
}

export interface TransactionModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: TransactionModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'orderManagerTransaction',
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
    setList: produce((draft: Draft<TransactionModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
