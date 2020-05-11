import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Card } from 'antd';
import { add, modify, EditeItemType, getInfo } from '../services/list';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { RouteComponentProps } from 'dva/router';

const { confirm } = Modal;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.goodsId ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error('操作失败');
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, loading, match }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    getGoodsInfo();
  });

  const getGoodsInfo = async () => {
    const [err, data, msg] = await getInfo(match.params.id);
    console.log(data);
  };

  /**
   * @name: 打开弹窗设置回显字段
   * @param {ListItemType} record
   */
  //   const handleModalVisible = async (record: ListItemType) => {
  //     const [err, data, msg] = await getSysUserInfo(record.id);
  //     setModalVisible(true);
  //     setFormData(data);
  //   };

  /**
   * @name: 表单提交
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      if (error) return;
      setConfirmLoading(true);
      const isSuccess = await handleEdite(value);
      setConfirmLoading(false);
      if (isSuccess) {
        setModalVisible(false);
      }
    });
  };

  return (
    <div style={{background: '#f1f2f7', height: '100%'}}>
      <Card size="small" type="inner" title="商品类型" style={{ width: '100%', marginBottom: '10px' }}></Card>
      <Card size="small" type="inner" title="基本信息" style={{ width: '100%', marginBottom: '10px' }}></Card>
      <Card size="small" type="inner" title="价格/库存" style={{ width: '100%', marginBottom: '10px' }}></Card>
      <Card size="small" type="inner" title="其他信息" style={{ width: '100%', marginBottom: '10px' }}></Card>
    </div>
  );
};

export default connect()(Comp);
