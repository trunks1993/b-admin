/*
 * @Date: 2020-05-19 10:02:40
 * @LastEditTime: 2020-05-19 22:53:21
 */

import { Effect } from 'dva';

import { queryList } from '../services/purchase';
import { Reducer } from 'redux';
import produce, { Draft } from 'immer';
import { TableListData } from '@/pages/data';

export interface OrderItemType {
  id: number;
  orderId: number;
  code: number;
  goodsCode: number;
  brandCode: number;
  brandName: string;
  productSubCode: number;
  productSubName: string;
  productTypeCode: number;
  typeLabel: string;
  facePrice: number;
  price: number;
  iconUrl: string;
  status: number;
  batchFileUrl: string;
  createTime: string;
  detailCount: number;
}

export interface ListItemType {
  id: number;
  merchantId: number;
  orderId: number;
  custId: number;
  totalPay: number; // 总金额
  realTotalPay: number; // 实收金额
  totalDerateFee: number; // 优惠金额
  merchantName: string; // 商户名称
  telephone: number; // 买家手机号
  payStatus: 0 | 1; // 支付状态 - 0:待支付; 1:已支付
  payMethod: number; // 支付方式 - 1:余额; 2:微信; 3:支付宝; 4:网银
  status: number; // 订单状态 - 0:初始; 1:待付款; 2:待发货; 3:待充值; 4:已完成; 5:已取消;
  completeTime: string; // 完成时间
  createTime: string; // 下单时间
  payTime: string; // 付款时间
  deliverTime: string; // 发货时间
  modifyTime: string;
  payCode: number;
  deliverUserName: string; // 配送员
  deliverMethod: number; // 配送方式
  orderItemList: OrderItemType[];
}

export interface PurchaseModelState extends TableListData<ListItemType> {}

interface ModelType {
  namespace: string;
  state: PurchaseModelState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const Model: ModelType = {
  namespace: 'orderManagerPurchase',
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
    setList: produce((draft: Draft<PurchaseModelState>, { payload }): void => {
      draft.list = payload.list;
      draft.total = payload.totalRecords;
    }),
  },
};

export default Model;
