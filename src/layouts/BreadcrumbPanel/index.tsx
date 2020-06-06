import React from 'react';
import Styles from './index.css';
import { connect } from 'dva';
import { ConnectState, MenuType } from '@/models/connect';
import { RouteComponentProps, NavLink } from 'dva/router';
import refresh from '@/assets/images/global/refresh.png';
import _ from 'lodash';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { routes } from './config';

interface BreadcrumbPanelType extends RouteComponentProps {
  // level2MenuMap: { [key: number]: MenuType };
  // level3MenuMap: { [key: string]: MenuType };
}

const BreadcrumbPanel: React.FC<BreadcrumbPanelType> = props => {
  const { location, breadcrumbs } = props;
  // const path = location.pathname;
  // const activeLeafMenu = _.find(
  //   level3MenuMap,
  //   (item, key) => path === item.uri || path.includes(item.uri),
  // );
  // const parentCode = activeLeafMenu?.parentCode || '';
  return (
    <div className={Styles.container}>
      <span className={Styles.breadcrumb}>
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={breadcrumb.key}>
            {index === 0 ? (
              <NavLink to={breadcrumb.match.url}>{breadcrumb.title}</NavLink>
            ) : (
              <span>{breadcrumb.title}</span>
            )}
            {(index < breadcrumbs.length - 1 && breadcrumb.title) && <i> > </i>}
          </span>
        ))}
      </span>

      <img className={Styles.refresh} width="16px" height="16px" src={refresh} onClick={() => window.location.reload()} />
    </div>
  );
};

export default withBreadcrumbs(routes)(BreadcrumbPanel);

// export default connect(({ user, routing }: ConnectState) => ({
//   location: routing.location,
//   level2MenuMap: user.level2MenuMap,
//   level3MenuMap: user.level3MenuMap,
// }))(BreadcrumbPanel);
