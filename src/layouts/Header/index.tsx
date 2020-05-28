// tslint:disable-next-line:jsx-no-multiline-js

import React, { Context } from 'react';
import { ConnectState, UserType } from '@/models/connect';
import { connect } from 'dva';
import Styles from './index.css';
import { Input, Icon, Badge, Popover, Skeleton } from 'antd';
import { Dispatch, AnyAction } from 'redux';

import logo from '@/assets/images/global/logo.png';
import doing from '@/assets/images/global/doing.png';
import lock from '@/assets/images/global/lock.png';
import msg from '@/assets/images/global/msg.png';
import errow from '@/assets/images/global/errow.png';

const { BASE_FILE_SERVER } = process.env;

interface HeaderProps {
  user: UserType;
  dispatch?: Dispatch<AnyAction>;
  loading: boolean;
}
const FuncContext: Context<any> = React.createContext(() => {});

const DropMenu: React.FC = () => (
  <FuncContext.Consumer>
    {dispatch => (
      <div className={Styles.dropBox}>
        <ul>
          <li onClick={() => dispatch({ type: 'login/logout' })}>退出</li>
        </ul>
      </div>
    )}
  </FuncContext.Consumer>
);

const Title: React.FC = () => (
  <span className={Styles.logoBox}>
    <img className={Styles.logo} src={logo} />
    <span className={Styles.logoTitle}>星权益业务运营系统</span>
  </span>
);

const Name: React.FC<HeaderProps> = ({ user, loading }) => (
  <Popover placement="bottom" content={<DropMenu />} trigger="hover">
    <span className={Styles.nameBox}>
      <img className={Styles.headIcon} src={(BASE_FILE_SERVER || '') + user.headIcon} />
      <span className={Styles.headIconTitle}>{user.realname}</span>
      <img className={Styles.errow} src={errow} />
    </span>
  </Popover>
);

const Tool: React.FC = () => (
  <span className={Styles.toolBox}>
    <Badge count={5}>
      <img className={Styles.toolIcon} src={doing} />
    </Badge>
    <span className={Styles.toolName}>事项</span>
  </span>
);

const ToolNoBage: React.FC<{ toolName: string; src: string }> = ({ toolName, src }) => (
  <span className={Styles.toolBox}>
    <img className={Styles.toolIcon} src={src} />
    <span className={Styles.toolName}>{toolName}</span>
  </span>
);

const Header: React.FC<HeaderProps> = ({ user, dispatch, loading }) => {
  return (
    <div className={Styles.container}>
      <div className={Styles.warrper}>
        <Title />
        <span className={Styles.left}>
          {/* <Input
            className="head-input"
            placeholder="请输入客户名称"
            addonAfter={<Icon type="search" />}
          /> */}
          <span style={{ display: 'flex' }}>
            {/* <Tool />
            <ToolNoBage src={msg} toolName="消息" />
            <ToolNoBage src={lock} toolName="锁屏" /> */}
            <FuncContext.Provider value={dispatch}>
              <Name user={user} loading={loading} />
            </FuncContext.Provider>
          </span>
        </span>
      </div>
    </div>
  );
};

export default connect(({ user, loading }: ConnectState) => ({
  loading: loading.effects['user/getUser'],
  user: user.user,
}))(Header);
