import { Effect } from 'dva';

import { Reducer } from 'redux';
import { TableListData } from '@/pages/data';
import produce, { Draft } from 'immer';
import { queryList, selectByClueClues } from '../services/salesLeads';

export interface ListItemType {
    code: number;
    telephone: number;
    status:number;
    name: string;
    createTime:string;
    companyName:string;
    modifyTime:string;
    email:string;
    custReturnVisitRecords:ListItemDetailType[];
    clueSource:number;
    unknow:string;
}

export interface ListItemDetailType {
  returnVisitPerson: string;
  status: number;
  returnVisitWay: string;
  returnVisitTime: string;
  context: string;
}
  

export interface PurchaseModelState extends TableListData<ListItemType> {
  detaillist:ListItemType
}

interface ModelType {
    namespace: string;
    state: PurchaseModelState;
    effects: {
      fetchList: Effect;
      fetchListDetail: Effect;
    };
    reducers: {
      setList: Reducer;
      setListDetail: Reducer;
    };
}

const Model: ModelType = {
    namespace: 'serviceInfo',
    state: {
        list: [],
        total: 0,
        detaillist:<ListItemType>{},
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
          
        *fetchListDetail({ queryParams, callback }, { call, put }) {
            const [err, data, msg] = yield call(selectByClueClues, queryParams);
            if (!err) {
              yield put({
                type: 'setListDetail',
                payload: data,
              });
            }
          },

    },

    reducers: {
        setList: produce((draft: Draft<PurchaseModelState>, { payload }): void => {
            draft.list = payload.list;
            draft.total = payload.totalRecords;
        }),

        setListDetail: produce((draft: Draft<PurchaseModelState>, { payload }): void => {
          draft.detaillist = payload;
        }),
    }
}

export default Model;
