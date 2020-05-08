import React, { useEffect } from 'react';
import Styles from './index.css';
import { MenuType, ConnectState, LocationType } from '@/models/connect';
import { connect } from 'dva';
import _ from 'lodash';
import { Dispatch, AnyAction } from 'redux';
import classnames from 'classnames';

import IconMap from './config';
import { router } from 'umi';

interface MenuProps {
  menus: MenuType[];
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
  activeMenu: number;
  activeLeafMenu: number;
  level1MenuMap: { [key: number]: MenuType[] };
}

interface MenuItemProps {
  item: MenuType;
  itemClick: (code: number, url?: string) => void;
  activeMenu: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, itemClick, activeMenu }) => (
  <li
    className={classnames(Styles.menuItem, { 'menu-active': activeMenu === item.code })}
    onClick={() => itemClick(item.code)}
  >
    <img src={IconMap[item.uri]} />
    <span className={Styles.menuName}>{item.name}</span>
  </li>
);

const LeafMenuItem: React.FC<MenuItemProps> = ({ item, itemClick, activeMenu }) => (
  <li
    className={classnames(Styles.leafMenuItem, { 'menu-leaf-active': activeMenu === item.code })}
    onClick={() => itemClick(item.code, item.uri)}
  >
    <span>{item.name}</span>
  </li>
);

const Menu: React.FC<MenuProps> = ({ menus, activeMenu, dispatch, level1MenuMap, activeLeafMenu, location, level3MenuMap }) => {

  React.useEffect(() => {
    //   const currentLeaf = level3MenuMap[location.pathname];
    //   console.log("currentLeaf", level3MenuMap[location.pathname])
    //   dispatch({
    //     type: 'user/getActiveMenuItem',
    //     code: level3MenuMap[location.pathname].parentCode,
    //   });
    //   dispatch({
    //     type: 'user/getActiveLeafMenuItem',
    //     code: level3MenuMap[location.pathname].code,
    //   });
      
  }, []);

  const handleMenuItemClick = (code: number) => {
    dispatch({
      type: 'user/getActiveMenuItem',
      code,
    });
  };

  const handleLeafMenuItemClick = (code: number, url?: string) => {
    dispatch({
      type: 'user/getActiveLeafMenuItem',
      code,
      callback: () => url && router.push(url)
    });
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.parentBox}>
        <ul>
          {_.map(menus, item => (
            <MenuItem
              key={item.code}
              item={item}
              activeMenu={activeMenu}
              itemClick={handleMenuItemClick}
            />
          ))}
        </ul>
      </div>
      <div className={Styles.visibleBox}>
        {_.map(level1MenuMap[activeMenu], item => (
          <React.Fragment key={item.code}>
            <span className={Styles.level2Menu}>{item.name}</span>
            <ul>
              {_.map(item.children, item => (
                <LeafMenuItem
                  key={item.code}
                  item={item}
                  activeMenu={activeLeafMenu}
                  itemClick={handleLeafMenuItemClick}
                />
              ))}
            </ul>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default connect(({ user, loading }: ConnectState) => ({
  menus: user.menus,
  activeMenu: user.activeMenu,
  activeLeafMenu: user.activeLeafMenu,
  level1MenuMap: user.level1MenuMap,
  loading: loading.effects['user/getMenu'],
}))(Menu);
