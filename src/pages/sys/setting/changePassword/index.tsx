import React, { useEffect, useState, ChangeEvent, ChangeEventHandler } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/user';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, UserStatuMap } from '@/const';
// import { remove, getInfo, EditeUserItemType, add, modify, modifyStatus } from '../services/user';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { listToTree } from '@/utils';
import { ListItemType as RoleItemType } from '../models/role';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { changePassword, EditeItemType } from '@/services/user';
import { router } from 'umi';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstPassword } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  roles: RoleItemType[];
}

const handleEdite = async (fields: EditeItemType) => {
  const [err, data, msg] = await changePassword(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error(msg);
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading, roles }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeUserItemType>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {}, [currPage]);

  /**
   * @name:
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (err, value) => {
      if (!err) {
        try {
          const success = await handleEdite(value);
          if (success) form.resetFields();
        } catch (error) {}
      }
    });
  };

  //   /**
  //    * @name:
  //    * @param {type}
  //    */

  //   const handleCopyPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     //   console.log(e.target.value);
  //     const newPassword = form?.getFieldValue('newPassword');
  //     const newPassword_copy = e.target.value;
  //     debugger;
  //     if (newPassword != newPassword_copy) {
  //       form?.setFields({
  //         oldPassword: {
  //           value: '',
  //           errors: [new Error('新密码输入不一致')],
  //         },
  //       });
  //     }
  //   };

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>修改密码</div>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setForm}>
          <CstPassword
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="oldPassword"
            label="原密码"
            placeholder="输入原密码"
            rules={[
              {
                required: true,
                message: '请输入原密码',
              },
              {
                max: 20,
                min: 6,
                message: '请输入6~20位字符',
              },
            ]}
          />
          <CstPassword
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="newPassword"
            label="新密码"
            placeholder="请输入6~20位字符"
            rules={[
              {
                required: true,
                message: '请输入新密码',
              },
              {
                max: 20,
                min: 6,
                message: '请输入6~20位字符',
              },
            ]}
          />
          <CstPassword
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            name="newPassword_copy"
            label="确认新密码"
            placeholder="再次输入新密码"
            // onChange={handleCopyPasswordChange}
            rules={[
              {
                required: true,
                message: '请确认新密码',
              },
              {
                validator: (rules, value, callback) => {
                  const newPassword = form?.getFieldValue('newPassword');
                  if (value && value !== newPassword) {
                    callback('密码输入不一致');
                  } else {
                    callback();
                  }
                },
              },
            ]}
          />

          <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
            <Button type="primary" icon="search" onClick={handleSubmit}>
              确认
            </Button>
            {/* <Button style={{ marginLeft: '10px' }} onClick={() => router.goBack()}>
              返回
            </Button> */}
          </Form.Item>
        </MapForm>
      </div>
    </div>
  );
};

export default connect()(Comp);
