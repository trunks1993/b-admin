/*
 * @Date: 2020-05-21 16:51:13
 * @LastEditTime: 2020-05-21 21:53:09
 */

import { Effect } from 'dva';

import { queryList } from '@/pages/product/manager/services/list';
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
  stockStatus: number; // 库存状态
  stock: number; // 总库存
  lockedStock: number; // 占用库存

  // 库存字段
  accountNo: number;
  destAccountNo: string;
  type: number;
  changeAmount: number;
  amount: number;
  bizType: number;
  orderNo: string;
  remark: string;
  createTime: string;
  modifyTime: string;
  productSub: {
    facePrice: number;
    shortName: string;
  };
}

export interface ListModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: ListModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'productManagerList',
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
    setList: produce((draft: Draft<ListModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
