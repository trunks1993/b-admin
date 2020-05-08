import React from 'react';
import Styles from './index.css';
import { connect } from 'dva';
import { ConnectState, MenuType } from '@/models/connect';
import { RouteComponentProps } from 'dva/router';
import refresh from '@/assets/images/global/refresh.png';

interface BreadcrumbPanelType extends RouteComponentProps {
  level2MenuMap: { [key: number]: MenuType };
  level3MenuMap: { [key: string]: MenuType };
}

const BreadcrumbPanel: React.FC<BreadcrumbPanelType> = ({
  location,
  level3MenuMap,
  level2MenuMap,
}) => {
  const activeLeafMenu = level3MenuMap[location.pathname];
  return (
    <div className={Styles.container}>
      <span className={Styles.breadcrumb}>
        <span>首页</span>
        <span>>{level2MenuMap[activeLeafMenu?.parentCode]?.name}</span>
        <span style={{ color: '#333333' }}>>{activeLeafMenu?.name}</span>
      </span>
      <img className={Styles.refresh} width="16px" height="16px" src={refresh} />
    </div>
  );
};

export default connect(({ user, routing }: ConnectState) => ({
  location: routing.location,
  level2MenuMap: user.level2MenuMap,
  level3MenuMap: user.level3MenuMap,
}))(BreadcrumbPanel);
