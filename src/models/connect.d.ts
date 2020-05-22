/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-21 16:55:07
 */ 
import { AnyAction } from 'redux';
import { RouterTypes, Route } from 'umi';
import { LoginModelState } from './login';
import { UserModelState, MenuType, UserType } from './user';
import { ListModelState } from './product';

export { UserType, MenuType };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface LocationType {}

interface RoutingType {
  location: LocationType;
}

export interface LocationType {
  pathname: string;
  search: string;
  hash: string;
  query: string;
  key: string;
}

export interface ConnectState {
  routing: RoutingType;
  loading: Loading;
  login: LoginModelState;
  user: UserModelState;
  productManagerList: ListModelState;
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?<K = any>(action: AnyAction): K;
}
