/*
 * @Date: 2020-05-09 21:53:38
 * @LastEditTime: 2020-05-16 16:53:12
 */
import { Effect } from 'dva';

import { queryList } from '../services/setting';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {
  id: number;
  code: number;
  brandCode: number;
  name: string;
  resume: string;
  status: number;
  introduction: string;
  brandName: string;
  iconUrl: string;
}

export interface SettingModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: SettingModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'businessManagerSetting',
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
    setList: produce((draft: Draft<SettingModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
