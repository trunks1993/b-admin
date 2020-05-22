/*
 * @Date: 2020-05-19 23:41:06
 * @LastEditTime: 2020-05-20 13:47:34
 */

import { Effect } from 'dva';

import { queryList } from '../services/recharge';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  custId: number;
  merchantId: number;
  rechargeChannelName: string; // 入款银行账户
  bizType: number;
  rechargeChannel: number;
  accountNo: number;
  amount: number;
  balance: number;
  status: number; // 1 待确认 2 已确认 3 关闭
  receiptUrl: string; // 回单图片路径
  auditId: string;
  auditName: string;
  completeTime: string;
  createTime: string;
  modifyTime: string;
}

export interface RechargeModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: RechargeModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'financeManagerRecharge',
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
    setList: produce((draft: Draft<RechargeModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
