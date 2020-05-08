import { Effect } from 'dva';

import { queryList } from '../services/role';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface RoleItemType {
  code: number;
  name: string;
  isAdmin: 'Y' | 'N';
  userNumber: number;
  remark: string;
}

export interface RoleModelState extends TableListData<RoleItemType>{
}

export interface RoleModelType {
  namespace: string;
  state: RoleModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: RoleModelType = {
  namespace: 'sysManagerRole',
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
    setList: produce((draft: Draft<RoleModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
