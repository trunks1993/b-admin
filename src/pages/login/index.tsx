// tslint:disable-next-line:jsx-no-multiline-js

import React, { Component } from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch, AnyAction } from 'redux';
import { LoginParamsType } from '@/services/login';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { Form, Button } from 'antd';

import user from '@/assets/images/login/user.png';
import pwd from '@/assets/images/login/pwd.png';
import icon from '@/assets/images/login/icon.png';
import md5 from 'js-md5';

const { CstInput, CstPassword, CstOther } = MapForm;
interface LoginProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  form: FormComponentProps['form'];
  loading: boolean;
}

interface LoginState {}

const FormBox: React.FC<{ dispatch: Dispatch; loading: boolean }> = ({ dispatch, loading }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  const fromCreate = (e: FormComponentProps['form']) => {
    setForm(e);
  };

  const handleSubmit = () => {
    form?.validateFields((err: any, value: LoginParamsType) => {
      if (!err) {
        value.password = md5(value.password);
        dispatch({
          type: 'login/login',
          payload: value,
          callback: (errorMsg: string) => {
            form.setFields({
              errorMsg: {
                value: '',
                errors: [new Error(errorMsg)],
              },
            });
          },
        });
      }
    });
  };

  const resetErrorMsg = () => {
    form?.setFields({
      errorMsg: {
        value: '',
        errors: [],
      },
    });
  };

  const otherProps = (isPwd: boolean) => ({
    onFocus: () => resetErrorMsg(),
    addonBefore: (
      <span>
        <img src={isPwd ? pwd : user} />
      </span>
    ),
    className: 'login-form-input',
    onPressEnter: isPwd ? handleSubmit : () => {},
  });

  return (
    <div className={Styles.box}>
      <div className={Styles.formTitle}>
        <img src={icon} width="100" height="100" />
        <span style={{ fontSize: '24px', lineHeight: '24px', marginTop: '28px' }}>
          星权益业务运营系统
        </span>
        <span style={{ fontSize: '14px', lineHeight: '14px', marginTop: '8px' }}>
          X-Marketing Business Operation
        </span>
      </div>

      <MapForm className={Styles.form} onCreate={fromCreate}>
        <CstInput
          name="userName"
          rules={[
            {
              required: true,
              message: '请填写用户名称',
            },
          ]}
          {...otherProps(false)}
          placeholder="请输入用户名"
        />
        <CstPassword
          name="password"
          rules={[
            {
              required: true,
              message: '请填写登录密码',
            },
          ]}
          {...otherProps(true)}
          placeholder="请输入登录密码"
        />
        <CstOther name="errorMsg">
          <Button className="login-form-btn" block loading={loading} onClick={handleSubmit}>
            登录
          </Button>
        </CstOther>
      </MapForm>
    </div>
  );
};

const Footer: React.FC = () => (
  <div className={Styles.footer}>
    <span>Copyright © XJF All Rights Reserved</span>
    <span>领先的数字权益营销服务提供商</span>
  </div>
);

@connect(({ loading }: ConnectState) => ({
  loading: loading.effects['login/login'],
}))
class Login extends Component<LoginProps, LoginState> {
  render() {
    const { loading, dispatch } = this.props;
    return (
      <div className={Styles.container}>
        <FormBox dispatch={dispatch} loading={loading} />
        <Footer />
      </div>
    );
  }
}

export default Login;
