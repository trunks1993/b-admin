import React from 'react';
import { Route, Redirect } from 'dva/router';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { getToken } from './utils/cookie';
import _ from 'lodash';

const AuthRouter = (props: any) => {
  const { route, authRouteMap } = props;
  const hasAuth = _.has(authRouteMap, route.path);
  const hasToken = !!getToken();

  if (!hasToken) {
    return route.path === '/login' ? <Route {...route} /> : <Redirect to="/login" />;
  }

  if (authRouteMap['/dashboard'] && !hasAuth) {
    const hasAuth = _.has(authRouteMap, route.from);
    if (!hasAuth) {
      return <Redirect to="/auth" />;
    }
  }

  return route.path === '/login' ? <Redirect to="/" /> : <Route {...route} />;
};

export default connect(({ login, user }: ConnectState) => ({
  login,
  authRouteMap: user.level3MenuMap,
}))(AuthRouter);
