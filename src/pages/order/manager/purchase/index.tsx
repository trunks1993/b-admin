import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/purchase';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  IdentifyTypes,
  IDENTIFY_TYPE_1,
  IdentifyStatus,
  TransactionStatus,
  OrderStatus,
  ORDER_STATUS_1,
  ORDER_STATUS_2,
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import TabsPanel from './TabsPanel';
import moment from 'moment';
import router from 'umi/router';
import { deliver, cancel } from '../services/purchase';

const { CstInput, CstSelect } = MapForm;
const { confirm } = Modal;
interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  /**
   * @name:
   * @param {type}
   */
  const handleTabsChange = (status: string) => {
    filterForm?.setFieldsValue({
      status,
    });
    dispatchInit();
  };

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'orderManagerPurchase/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
      },
    });
  };

  /**
   * @name: 触发列表加载effect
   * @param {type}
   */
  const dispatchInit = (callback?: () => void) => {
    callback && callback();
    currPage === 1 ? initList() : setCurrPage(1);
  };

  /**
   * @name: 删除
   * @param {number} status
   * @param {number} orderId
   */
  const showConfirm = (status: number, orderId: number) => {
    const api = status === ORDER_STATUS_2 ? deliver : cancel;
    const msg = status === ORDER_STATUS_2 ? '是否发货' : '是否取消';
    confirm({
      title: '提示',
      content: msg,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await api(orderId);
        if (!err) {
          message.success('操作成功');
          dispatchInit();
        } else message.error('删除失败，请重试');
      },
      onCancel() {},
    });
  };

  return (
    <div className={Styles.container}>
      <TabsPanel onChange={handleTabsChange}>
        <div className={Styles.filter}>
          <div className={Styles.filterBox}>
            <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
              <CstInput name="status" style={{ display: 'none' }} />
              <Row>
                <Col span={7}>
                  <CstInput
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="orderId"
                    label="订单号"
                    placeholder="请输入订单号"
                  />
                </Col>
                <Col span={7}>
                  <CstInput
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="rechargeAccount"
                    label="充值账号"
                    placeholder="请输入充值账号"
                  />
                </Col>
                <Col span={7}>
                  <CstSelect
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="status"
                    label="订单状态"
                    placeholder="请选择状态"
                  >
                    {_.map(TransactionStatus, (item, key) => (
                      <Select.Option key={key} value={key}>
                        {item}
                      </Select.Option>
                    ))}
                  </CstSelect>
                </Col>
              </Row>

              {/* <Row>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="telephone"
                  label="交易时间"
                  placeholder="请输入订单号"
                />
              </Col>
            </Row> */}
              <Row>
                <Col span={7}>
                  <CstInput
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="merchantId"
                    label="商户号"
                    placeholder="请输入商户号"
                  />
                </Col>
                <Col span={7}>
                  <CstInput
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    name="customerOrderNo"
                    label="外部订单号"
                    placeholder="请输入充值账号"
                  />
                </Col>
                <Col span={7} push={2}>
                  <Form.Item>
                    <Button type="primary" icon="search" onClick={() => dispatchInit()}>
                      筛选
                    </Button>
                    <Button
                      icon="undo"
                      style={{ marginLeft: '10px' }}
                      onClick={() => filterForm?.resetFields()}
                    >
                      重置
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </MapForm>
          </div>
        </div>
        <div className={Styles.table}>
          <Row className={Styles.thead}>
            <Col span={5}>商品名称</Col>
            <Col span={2}>单价(元)</Col>
            <Col span={2}>数量(件)</Col>
            <Col span={3}>买家手机号</Col>
            <Col span={5}>订购商户</Col>
            <Col span={2}>实收金额(元)</Col>
            <Col span={2}>订单状态</Col>
            <Col span={3}>操作</Col>
          </Row>
          {_.map(list, item => (
            <Row key={item.id}>
              <Col span={24} className={Styles.title}>
                <span>采购单号：{item.orderId}</span>
                <span style={{ marginLeft: '30px' }}>
                  下单时间: {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </Col>
              {_.map(item.orderItemList, (v, index) => (
                <span key={index} className={Styles.item}>
                  <Col span={5}>{v.productSubName}</Col>
                  <Col span={2}>￥{v.price}</Col>
                  <Col span={2}>{v.detailCount}</Col>
                  {index === 0 ? (
                    <>
                      <Col span={3}>{item.telephone}</Col>
                      <Col span={5}>{item.merchantName}</Col>
                      <Col span={2}>￥{item.totalPay}</Col>
                      <Col span={2}>{OrderStatus[item.status]}</Col>
                      <Col span={3} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button
                          size="small"
                          style={{ marginBottom: '5px' }}
                          onClick={() => router.push(`/order/manager/purchase/${item.orderId}`)}
                        >
                          查看详情
                        </Button>
                        {(item.status === ORDER_STATUS_1 || item.status === ORDER_STATUS_2) && (
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => showConfirm(item.status, item.orderId)}
                          >
                            {item.status === ORDER_STATUS_2 ? '立即发货' : '取消订单'}
                          </Button>
                        )}
                      </Col>
                    </>
                  ) : null}
                </span>
              ))}
            </Row>
          ))}
        </div>
      </TabsPanel>
      <div className="global-pagination">
        <Pagination
          current={currPage}
          onChange={(currPage: number) => setCurrPage(currPage)}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          total={total}
          showQuickJumper
        />
        <span className="global-pagination-data">
          共 {total} 条 ,每页 {DEFAULT_PAGE_SIZE} 条
        </span>
      </div>
    </div>
  );
};

export default connect(({ orderManagerPurchase, loading }: ConnectState) => ({
  list: orderManagerPurchase.list,
  total: orderManagerPurchase.total,
  loading: loading.effects['orderManagerPurchase/fetchList'],
}))(Comp);
