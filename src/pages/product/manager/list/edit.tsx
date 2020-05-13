import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Card } from 'antd';
import { add, modify, EditeItemType, getInfo } from '../services/list';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';

const { CstInput, CstBlockCheckbox, CstTextArea } = MapForm;

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
  const [errMsg, setErrMsg] = useState('');

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    getGoodsInfo();
  });

  const getGoodsInfo = async () => {
    const [err, data, msg] = await getInfo(match.params.id);
  };

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

  // const formItemLayout = {
  //   labelCol: {
  //     span: 4,
  //   },
  //   wrapperCol: {
  //     span: 10,
  //     push: 1,
  //   },
  // };

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form" onCreate={setForm}>
        <Card
          size="small"
          type="inner"
          title="商品类型"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstBlockCheckbox
            name="productTypeCode"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="基本信息"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstInput
            label="商品名称"
            help="填写商品名称，方便快速检索相关产品"
            placeholder="请输入商品名称"
            name="productName"
          />
          <CstTextArea
            label="描述"
            placeholder="请输入商品描述"
            name="resume"
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="价格/库存"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstInput
            label="价格"
            placeholder="请输入商品价格"
            name="price"
            rules={[
              {
                required: true,
                message: '商品价格不能为空',
              },
            ]}
          />
          <CstInput label="官方价" placeholder="请输入商品价格" name="facePrice" />
          <CstInput
            label="库存"
            placeholder="请输入库存数量"
            name="stock"
            help={
              errMsg
                ? errMsg
                : '库存为 0 时，会放到『已售罄』的商品列表里，保存后买家看到的商品可售库存同步更新'
            }
            rules={[
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    setErrMsg('商品价格不能为空');
                    callback(new Error('商品价格不能为空'));
                  } else {
                    setErrMsg('');
                    callback();
                  }
                },
              },
            ]}
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="其他信息"
          style={{ width: '100%', marginBottom: '10px' }}
        ></Card>
      </MapForm>
      <div className={Styles.btn}>
        <Button type="primary">保存</Button>
        <Button style={{ marginLeft: '20px' }}>返回</Button>
      </div>
    </div>
  );
};

export default connect()(Comp);
