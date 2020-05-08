import React from 'react';
import { Route, Redirect } from 'dva/router';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { getToken } from './utils/cookie';

const AuthRouter = (props: any) => {
  const { route } = props;
  if (route.path === '/login') {
    return getToken() ? <Redirect to="/" /> : <Route {...route} />;
  }
  return getToken() ? <Route {...route} /> : <Redirect to="/login" />;
};

export default connect(({ login }: ConnectState) => ({
  login,
}))(AuthRouter);
