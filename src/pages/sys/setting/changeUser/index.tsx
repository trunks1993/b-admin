import React, { useEffect } from 'react';
import { ConnectState, UserType } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { Button, message, Form } from 'antd';

import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { EditUserItemType, changeUser } from '@/services/user';
import { FILE_ERROR_TYPE, FILE_ERROR_SIZE } from '@/components/GlobalUpload';
import { getInfo } from '../../manager/services/user';

const { CstInput, CstTextArea, CstUpload } = MapForm;

interface CompProps {
  dispatch: Dispatch<AnyAction>;
  user: UserType;
}

const handleEdite = async (fields: EditUserItemType) => {
  const [err, data, msg] = await changeUser(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error(msg);
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ user }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  useEffect(() => {
    try {
      if (user.userId) getUser();
    } catch (error) {}
  }, [form, user]);

  const getUser = async () => {
    const [err, data, msg] = await getInfo(user.userId);
    if (!err) {
      const { remark, headIcon, realname, roleName, userName } = data;
      form?.setFieldsValue({
        remark,
        headIcon,
        realname,
        roleName,
        userName,
      });
    }
  };

  /**
   * @name:
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (err, value) => {
      if (!err) {
        try {
          const success = await handleEdite(value);
          if (success) resetForm();
        } catch (error) {}
      }
    });
  };

/**
 * @name: 
 * @param {type} 
 */  
const resetForm = () => {
  form?.setFieldsValue({
    headIcon: '',
    realname: '',
    remark: '',
  });
} 

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>修改资料</div>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setForm}>
          <CstUpload
            label="头像"
            name="headIcon"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (value === FILE_ERROR_TYPE) {
                    callback(new Error('文件格式错误'));
                  } else if (value === FILE_ERROR_SIZE) {
                    callback(new Error('文件大小不能超过2M'));
                  } else {
                    callback();
                  }
                },
              },
            ]}
            action={`${process.env.BASE_FILE_SERVER}/upload`}
            method="POST"
            data={{
              userName: 'yunjin_file_upload',
              password: 'yunjin_upload_password',
              domain: 'headIcon',
              secret: 'N',
            }}
          />
          <CstInput
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="realname"
            label="姓名"
            placeholder="请输入姓名"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
              {
                max: 6,
                min: 1,
                message: '请输入1~6位字符',
              },
            ]}
          />
          <CstInput
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="userName"
            label="登录账号"
            disabled={true}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <CstInput
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="roleName"
            label="所属角色"
            disabled={true}
            rules={[
              {
                required: true,
              },
            ]}
          />
          <CstTextArea
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="remark"
            label="备注"
            placeholder="请输入备注信息"
            autoSize={{ minRows: 4, maxRows: 6 }}
            rules={[
              {
                max: 50,
                message: '不能超过50个字符',
              },
            ]}
          />

          <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
            <Button type="primary" icon="search" onClick={handleSubmit}>
              确认
            </Button>
            {/* <Button
              icon="undo"
              style={{ marginLeft: '10px' }}
              onClick={resetForm}
            >
              重置
            </Button> */}
          </Form.Item>
        </MapForm>
      </div>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  user: user.user,
}))(Comp);
