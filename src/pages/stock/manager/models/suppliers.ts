/*
 * @Date: 2020-05-19 23:41:06
 * @LastEditTime: 2020-05-20 21:57:12
 */

import { Effect } from 'dva';

import { queryList } from '../services/suppliers';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  code: number;
  modifyTime: string;
  createTime: string;
  name: string;
  id: number;
  mainTelephone: string; // 主要联系人电话
  mainContactName: string; // 主要联系人
  minorContactName: string; // 次要联系人
  minorTelephone: string; // 次要联系人电话
  status: number;
  amount: number; // 系统余额
  address: string;
  accountNo: number;
}

export interface SuppliersModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: SuppliersModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'stockManagerSuppliers',
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
    setList: produce((draft: Draft<SuppliersModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
