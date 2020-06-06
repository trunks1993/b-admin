import React, { useState, useEffect } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { RouteComponentProps } from 'dva/router';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';

import TabsPanel from './components/TabsPanel';
import Styles from './edit.css';
import MapForm from '@/components/MapFormComponent';
import { Form, Button, Row, Col, Table, Tabs, message } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { getInfo, EditeItemType, modify, add } from '../services/application';
import { router } from 'umi';
import { patternUrl } from '@/rules';
const { CstInput } = MapForm;
const { TabPane } = Tabs;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
}

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.appId ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error(msg);
    return false;
  }
};

const HELP_MSG_CALLBACKURL = (
  <>
    该接口用来向第三方应用服务器反馈交易结果请求，查看<a>技术文档</a>
  </>
);

const HELP_MSG_VIRTUALCHARGEURL = (
  <>
    该接口用来向您的服务器发起虚拟商品充值请求，查看<a>技术文档</a>
  </>
);

const HELP_MSG_NOLOGINRUL = (
  <>
    该接口开放给客户端，通过生成免登录URL与平台同步信息，查看<a>技术文档</a>
  </>
);

const Comp: React.FC<CompProps> = props => {
  const { match } = props;
  const [activeKey, setActiveKey] = useState('1');
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [msgCallbackUrl, setMsgCallbackUrl] = useState(HELP_MSG_CALLBACKURL);
  const [msgVirtualChargeUrl, setMsgVirtualChargeUrl] = useState(HELP_MSG_VIRTUALCHARGEURL);
  const [msgNologinUrl, setMsgNologinUrl] = useState(HELP_MSG_NOLOGINRUL);

  useEffect(() => {
    if (activeKey == '1') initInfo();
  }, [form, activeKey]);

  const initInfo = async () => {
    const [err, data, msg] = await getInfo(parseInt(match.params.id));
    if (!err) {
      const { virtualRecharge, nologinUrl, callbackUrl } = data;
      form?.setFieldsValue({
        nologinUrl,
        callbackUrl,
        virtualChargeUrl: virtualRecharge,
      });
    }
  };

  /**
   * @name: tab切换
   * @param {string} activeKey
   */
  const handleTabsPanelChange = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  /**
   * @name:
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      if (error) return;
      setConfirmLoading(true);
      const isSuccess = await handleEdite(value);
      setConfirmLoading(false);
      if (isSuccess) {
        router.goBack();
      }
    });
  };

  const columns: ColumnProps<any>[] = [
    {
      title: '时间',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '异常原因',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '平台请求URL',
      dataIndex: 'userNumber',
      align: 'center',
    },
    {
      title: '开发者响应',
      dataIndex: 'userNumber',
      align: 'center',
    },
  ];

  return (
    <div className={Styles.container}>
      <Tabs onChange={handleTabsPanelChange} type="card">
        <TabPane tab="接口配置" key="1">
          <div style={{ padding: '0 30px' }}>
            <span className={Styles.info}>
              请务必保持下面接口可用，否则你的应用将不能正常工作。带 * 选项位必填项，其余则为选填。
              为了实时监控由于您的服务器异常产生的
            </span>
            <MapForm className="global-form global-edit-form" onCreate={setForm}>
              <CstInput name="appId" defaultValue={match.params.id} style={{ display: 'none' }} />
              <CstInput
                label="免登录接口:"
                defaultValue="http://"
                placeholder="http://"
                name="nologinUrl"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 10 }}
                help={msgNologinUrl}
                rules={[
                  {
                    validator: (rule, value, callback) => {
                      if (value && !patternUrl.test(value)) {
                        setMsgNologinUrl('免登录接口地址格式有误');
                        callback(new Error('免登录接口地址格式有误'));
                      } else {
                        setMsgNologinUrl(HELP_MSG_NOLOGINRUL);
                        callback();
                      }
                    },
                  },
                ]}
              />
              <div className={Styles.border}></div>
              <CstInput
                label="结果通知:"
                placeholder="http://"
                defaultValue="http://"
                name="callbackUrl"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 10 }}
                rules={[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        setMsgCallbackUrl('结果通知地址不能为空');
                        callback(new Error('结果通知地址不能为空'));
                      } else if (!patternUrl.test(value)) {
                        setMsgCallbackUrl('结果通知地址格式有误');
                        callback(new Error('结果通知地址格式有误'));
                      } else {
                        setMsgCallbackUrl(HELP_MSG_CALLBACKURL);
                        callback();
                      }
                    },
                  },
                ]}
                help={
                  // <>
                  //   该接口用来向第三方应用服务器反馈交易结果请求，查看<a>技术文档</a>
                  // </>
                  msgCallbackUrl
                }
              />
              <div className={Styles.border}></div>
              <CstInput
                label="虚拟商品充值："
                defaultValue="http://"
                placeholder="http://"
                name="virtualChargeUrl"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 10 }}
                help={msgVirtualChargeUrl}
                rules={[
                  {
                    validator: (rule, value, callback) => {
                      if (value && !patternUrl.test(value)) {
                        setMsgVirtualChargeUrl('虚拟商品充值地址格式有误');
                        callback(new Error('虚拟商品充值地址格式有误'));
                      } else {
                        setMsgVirtualChargeUrl(HELP_MSG_VIRTUALCHARGEURL);
                        callback();
                      }
                    },
                  },
                ]}
              />
              <Form.Item
                colon={false}
                label=" "
                labelCol={{ span: 3 }}
                style={{ marginTop: '30px' }}
              >
                <Button loading={confirmLoading} type="primary" onClick={handleSubmit}>
                  保存配置
                </Button>
              </Form.Item>
            </MapForm>
          </div>
        </TabPane>
        <TabPane tab="异常监控" key="2" disabled>
          <div style={{ padding: '0 30px' }}>
            <span className={Styles.info}>
              您的开发人员可以关注这里的异常订单情况，监控自己的接口状态是否健康。
            </span>
            <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
              <Row>
                <Col span={6}>
                  <CstInput
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    name="realname"
                    label="交易时间"
                    placeholder="请输入用户名称"
                  />
                </Col>
                <Col span={6}>
                  <CstInput
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    name="type"
                    label="账单类型"
                    placeholder="请输入用户名称"
                  />
                </Col>
                <Col span={6} push={1}>
                  <Form.Item>
                    <Button
                      type="primary"
                      icon="search"
                      // onClick={initList}
                    >
                      查询
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </MapForm>

            {/* <Table
              className="global-table"
              loading={loading}
              columns={columns}
              pagination={false}
              dataSource={[]}
              rowKey={record => record.userId.toString()}
            />  */}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default connect()(Comp);
