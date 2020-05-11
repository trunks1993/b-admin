/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-11 17:15:16
 */
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { produce, Draft } from 'immer';

import { fakeAccountLogin } from '@/services/login';

import { getPageQuery } from '@/utils';
import { setToken, getToken, removeToken } from '@/utils/cookie';

export interface LoginModelState {}

export interface ModelType {
  namespace: string;
  state: LoginModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {};
}

const Model: ModelType = {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload, callback }, { call, put }) {
      const [err, data, msg] = yield call(fakeAccountLogin, payload);
      console.log('*login -> err, data, msg', err, data, msg);
      if (!err) {
        setToken(data.token);
        window.location.href = '/';
      } else {
        callback(msg);
      }
      // Login successfully
      // if (response.code === RESPONSE_SUCCESS) {
      //   setToken(response.data.token);
      //   // yield put({ type: 'setUser', payload: data.token });

      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params as { redirect: string };
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = '/';
      //       return;
      //     }
      //   }
      //   yield put(routerRedux.replace(redirect || '/'));
      // } else {
      //   message.error(response.msg);
      // }
    },

    *logout(_, { put }) {
      removeToken();
      window.location.href = '/';
    },
  },

  reducers: {},
};

export default Model;
