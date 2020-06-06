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
  TransactionStatus,
  OrderStatus,
  ORDER_STATUS_1,
  ORDER_STATUS_2,
  TRANSTEMP,
  PRODUCT_TYPE_4,
  TraceStatus,
  TRACE_STATUS_5,
  TRACE_STATUS_6,
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import TabsPanel from './TabsPanel';
import moment from 'moment';
import router from 'umi/router';
import { deliver, cancel, queryListTrace } from '../services/purchase';
import { getFloat } from '@/utils';
import GlobalModal from '@/components/GlobalModal';

const { CstInput, CstSelect } = MapForm;
const { confirm } = Modal;
interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [modalVisible, setModalVisible] = useState<string | number>('');
  const [modalTitle, setModalTitle] = useState('');

  const [traceList, setTraceList] = useState([]);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    if (modalVisible) initTraceList();
    else setTraceList([]);
  }, [modalVisible]);

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
   * @name: 列表加载
   */
  const initTraceList = async () => {
    try {
      const [err, data, msg] = await queryListTrace({
        currPage: 1,
        pageSize: 10000,
        itemCode: modalVisible,
      });
      if (!err) setTraceList(data.list);
    } catch (error) {}
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
        } else message.error(msg);
      },
      onCancel() {},
    });
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '序号',
      align: 'center',
      // dataIndex: 'index',
      render: (record, arr, index) => index + 1,
    },
    {
      title: '充值账号',
      align: 'center',
      dataIndex: 'objNo',
    },
    {
      title: '充值数量（件）',
      align: 'center',
      dataIndex: 'amount',
    },
    {
      title: '充值状态',
      align: 'center',
      // dataIndex: 'status',
      render: record => TraceStatus[record.status],
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
  ];

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
                  <Col span={2}>￥{getFloat(v.price / TRANSTEMP, 4)}</Col>
                  <Col span={2}>
                    {v.productTypeCode === PRODUCT_TYPE_4 ? (
                      <Button
                        type="link"
                        onClick={() => {
                          setModalVisible(v.code);
                          setModalTitle(v.productSubName);
                        }}
                      >
                        {v.detailCount}
                      </Button>
                    ) : (
                      v.detailCount
                    )}
                  </Col>
                  {index === 0 ? (
                    <>
                      <Col span={3}>{item.telephone}</Col>
                      <Col span={5}>{item.merchantName}</Col>
                      <Col span={2}>￥{getFloat(item.realTotalPay / TRANSTEMP, 4)}</Col>
                      <Col span={2}>{OrderStatus[item.status]}</Col>
                      <Col span={3} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button
                          size="small"
                          style={{ marginBottom: '5px' }}
                          onClick={() => router.push(`/order/manager/purchase/${item.orderId}`)}
                        >
                          查看详情
                        </Button>
                        {(item.status === ORDER_STATUS_1 ||
                          (item.status === ORDER_STATUS_2 &&
                            item.orderItemList.some(
                              item => item.productTypeCode !== PRODUCT_TYPE_4,
                            ))) && (
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
                  ) : (
                    <>
                      <Col span={15}></Col>
                    </>
                  )}
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
      <GlobalModal
        modalVisible={!!modalVisible}
        title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>{`${modalTitle}-直充明细`}</div>}
        confirmLoading={confirmLoading}
        cancelText={
          <Button
            type="link"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <span style={{ color: '#333333' }}>
              充值账号
              <span style={{ color: '#1A61DC', fontWeight: 'bold', margin: '0 5px' }}>
                {traceList.length}
              </span>
              个
            </span>
            <span style={{ color: '#333333', marginLeft: '10px' }}>
              充值成功
              <span style={{ color: '#1A61DC', fontWeight: 'bold', margin: '0 5px' }}>
                {_.filter(traceList, item => item.status === TRACE_STATUS_5).length}
              </span>
              件
            </span>
            <span style={{ color: '#333333', marginLeft: '10px' }}>
              充值失败
              <span style={{ color: '#DD0000', fontWeight: 'bold', margin: '0 5px' }}>
                {_.filter(traceList, item => item.status === TRACE_STATUS_6).length}
              </span>
              件
            </span>
          </Button>
        }
        onOk={() => setModalVisible('')}
        onCancel={() => setModalVisible('')}
        cancelButtonProps={{
          className: 'global-modal-btn-cancel',
          type: 'link',
          style: { position: 'absolute', left: 0 },
        }}
        width={560}
      >
        <Table
          className="global-table"
          loading={loading}
          columns={columns}
          pagination={false}
          dataSource={traceList}
          scroll={{ y: 200 }}
          rowKey={record => record.id.toString()}
        />
      </GlobalModal>
    </div>
  );
};

export default connect(({ orderManagerPurchase, loading }: ConnectState) => ({
  list: orderManagerPurchase.list,
  total: orderManagerPurchase.total,
  loading: loading.effects['orderManagerPurchase/fetchList'],
}))(Comp);
