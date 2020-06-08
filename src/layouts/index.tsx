import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import Header from './Header/index';
import Menu from './Menu/index';
import BreadcrumbPanel from './BreadcrumbPanel/index';

import Styles from './index.css';
import { connect } from 'dva';
// import { ConnectState } from '@/models/connect';
import { RouteComponentProps } from 'react-router-dom';
import { ConnectState, MenuType } from '@/models/connect';
import _ from 'lodash';
import { getToken } from '@/utils/cookie';

interface LayoutProps extends RouteComponentProps {
  dispatch: Dispatch<AnyAction>;
  level3MenuMap: { [key: string]: MenuType };
  level2MenuMap: { [key: number]: MenuType };
}

interface LayoutState {}

@connect(({ user, routing }: ConnectState) => ({
  location: routing.location,
  level3MenuMap: user.level3MenuMap,
  level2MenuMap: user.level2MenuMap,
}))
class BasicLayout extends Component<LayoutProps, LayoutState> {
  
  componentDidMount() {
    const { dispatch } = this.props;
    if (!getToken()) return;
    dispatch({
      type: 'user/getUser',
    });
    dispatch({
      type: 'user/getMenu',
      callback: this.updataActiveMenu,
    });
  }

  componentDidUpdate(prevProps) {
    const preUrl = prevProps.location.pathname;
    const currentUrl = this.props.location.pathname;
    if (preUrl !== currentUrl) this.updataActiveMenu();
  }

  updataActiveMenu = () => {
    const { dispatch } = this.props;
    const { level2MenuMap, level3MenuMap, location } = this.props;
    const { pathname } = location;
    const activeLeafMenu = _.find(
      level3MenuMap,
      (item, key) => pathname === item.uri || pathname.includes(item.uri),
    );
    const leafCode = activeLeafMenu?.code;
    let parentCode = activeLeafMenu?.parentCode;
    parentCode = level2MenuMap[parentCode || '']?.parentCode;
    dispatch({
      type: 'user/getActiveMenuItem',
      code: parentCode,
    });
    dispatch({
      type: 'user/getActiveLeafMenuItem',
      code: leafCode,
    });
  };

  render() {
    // const { match } = this.props;
    return (
      <div className={Styles.container}>
        <Header />
        <section className={Styles.main}>
          <Menu />
          <div className={Styles.left}>
            <BreadcrumbPanel />
            <section className={Styles.wrapper}>{this.props.children}</section>
          </div>
        </section>
      </div>
    );
  }
}

export default BasicLayout;
