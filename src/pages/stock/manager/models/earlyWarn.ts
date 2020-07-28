import { Effect } from 'dva';

import { queryList } from '../services/earlyWarn';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface ListItemType {

}

export interface OutOfStockModelState extends TableListData<ListItemType> {}

interface ModelType {
    namespace: string;
    state: OutOfStockModelState;
    effects: {
      fetchList: Effect;
    };
    reducers: {
      setList: Reducer;
    };
}

const Model: ModelType = {
    namespace: 'stockEarlyWarn',
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
      setList: produce((draft: Draft<OutOfStockModelState>, { payload }): void => {
        draft.list = payload.list;
        draft.total = payload.totalRecords;
      }),
    },
  };
  
  export default Model;
