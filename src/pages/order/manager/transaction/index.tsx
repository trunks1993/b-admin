import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/transaction';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, message, Checkbox, Select, Form, Col, Row, Modal, Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import GlobalModal from '@/components/GlobalModal';
import copy from 'copy-to-clipboard';
import { setToSuccess, setToFailed, reroute, getOuterWorkerList, retry, searchMerchantList, downloadBigTradeOrder } from '../services/transaction';
import { getSupplierList } from '@/pages/product/manager/services/list'
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  OrderTypes,
  TransactionStatus,
  TRANSTEMP,
  TransactionTypes,
  WarehousingStatus,
  WAREHOUSING_STATUS_11,
  WarehousingTypes,
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import { getFloat } from '@/utils';

import { getAjax } from '@/utils/index';

const { CstInput, CstSelect, CstTextArea, CstCheckbox, CstRangePicker } = MapForm;
const transaction_set_all = {
  1: '置成功',
  2: '置失败',
  3: '重新分流',
  4: '再次充值',
};


interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState(1);
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
  const [selectedRow, setSelectedRow] = useState<ListItemType[]>([]);
  const [merchantInfo, setMerchantInfo] = useState<any>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [goodsList, setGoodsList] = useState({});// 供应商列表

  const [visible, setVisible] = useState<any>(false);
  const [lists, setLists] = useState<any>([]);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
    getMerchantInfo();
    getSuppliersList();
  }, [currPage]);

  useEffect(() => {
    if (_.isEmpty(form)) return;
    form?.setFieldsValue({ ids: selectedRow[0].id })
  }, [form]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    const beginCreateTime = !_.isEmpty(data?.time) ? moment(data?.time[0]).format('YYYY-MM-DD 00:00:00') : undefined
    const endCreateTime = !_.isEmpty(data?.time) ? moment(data?.time[1]).format('YYYY-MM-DD 23:59:59') : undefined
    const isAbnormal = data?.isAbnormals ? 'Y' : undefined
    dispatch({
      type: 'orderManagerTransaction/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
        isAbnormal,
        beginCreateTime,
        endCreateTime,
      },
    });
  };

  const getSuppliersList = async () => {
    try {
      const [err, data, msg] = await getSupplierList();
      if (!err) setGoodsList(data)
      else message.error(msg)
    } catch (error) { }
  }

  /**
   * 
   * @name: 下载报表
   */
  const download = async () => {
    const data = filterForm?.getFieldsValue();
    if (!data?.time) return message.error('请选择下载的时间段!')
    getAjax({
      ...data,
      beginCreateTime: moment(data?.time[0]).format('YYYY-MM-DD 00:00:00'),
      endCreateTime: moment(data?.time[1]).format('YYYY-MM-DD 23:59:59')
    }, '/report/downloadTradeOrder')
  }

  /**
   * 
   * @name: 下载大报表
   */
  const superDownload = async () => {
    const obj = filterForm?.getFieldsValue();
    if (!obj?.time) return message.error('请选择下载的时间段!')
    try {
      const [err, data, msg] = await downloadBigTradeOrder({
        ...obj,
        beginCreateTime: moment(obj?.time[0]).format('YYYY-MM-DD 00:00:00'),
        endCreateTime: moment(obj?.time[1]).format('YYYY-MM-DD 23:59:59')
      })

      if (!err) {
        const url = window.location.origin + '/file/' + data?.webPath
        Modal.success({
          title: '下载大数据报表链接',
          content: <Typography.Paragraph copyable={true}>{url}</Typography.Paragraph>,
          okText: '复制',
          maskClosable: false,
          keyboard: false,
          onOk() {
            copy(url);
          },
        })
      } else message.error(msg)
    } catch (error) { }
  }

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商户信息',
      align: 'center',
      width: 80,
      dataIndex: 'merchantName',
    },
    {
      title: '订单号/外部订单号',
      align: 'center',
      width: 120,
      render: record => (
        <span>
          <div style={{ whiteSpace: 'nowrap' }}>{record.orderId}/</div>
          <div>{record.customerOrderNo}</div>
        </span>
      ),
    },
    {
      title: '交易类型',
      align: 'center',
      width: 50,
      render: record => TransactionTypes[record.bizType],
    },
    {
      title: '状态',
      align: 'center',
      width: 70,
      render: record => TransactionStatus[record.status],
    },
    {
      title: '充值账号',
      align: 'center',
      width: 100,
      dataIndex: 'rechargeAccount',
    },
    {
      title: '异常订单',
      align: 'center',
      width: 50,
      render: (record) => {
        if (record.isAbnormal === 'Y') return <div>是</div>
        else return <div>否</div>
      }
    },
    {
      title: '交易金额(元)',
      align: 'center',
      width: 80,
      render: record => getFloat(record.totalPay / TRANSTEMP, 4),
    },
    {
      title: '商品',
      align: 'center',
      width: 100,
      // dataIndex: 'goodsName',
      render: record => `${record.goodsName}(${record.goodsCode})`
    },
    {
      title: '请求时间',
      align: 'center',
      width: 100,
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '完成时间',
      align: 'center',
      width: 100,
      render: record =>
        record.completeTime && moment(record.completeTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '耗时',
      align: 'center',
      width: 50,
      render: record => {
        const time = moment(record.completeTime).valueOf() - moment(record.createTime).valueOf();
        return record.completeTime ? time / 1000 + 's' : '';
      },
    },
    {
      title: '供应商通道',
      align: 'center',
      width: 80,
      dataIndex: 'supplierName',
    },
    {
      title: '路由详情',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: record => (
        <Button type="link" onClick={() => checkOrder(record.orderId, record.createTime)}>路由详情</Button>
      )
    }
  ];

  /** 
   * @name: 列表详情
   */
  const listColumns: any = [
    { title: '供应商名称', align: 'center', dataIndex: 'supplier.name' },
    { title: '供应商编号', align: 'center', dataIndex: 'supplierCode' },
    { title: '工单号', align: 'center', dataIndex: 'code' },
    { title: '外部订单号', align: 'center', dataIndex: 'orderId' },
    { title: '状态', align: 'center', dataIndex: 'status', render: record => WarehousingStatus[record] },
    { title: '创建时间', align: 'center', dataIndex: 'processStartTime', render: record => record && moment(record).format('YYYY-MM-DD HH:mm:ss') },
    { title: '完成时间', align: 'center', dataIndex: 'completeTime', render: record => record && moment(record).format('YYYY-MM-DD HH:mm:ss') },
    { title: '返回码 ', align: 'center', dataIndex: 'outerReturnCode' },
    { title: '返回消息 ', align: 'center', dataIndex: 'outerReturnMessage' },
    { title: '处理方式 ', align: 'center', dataIndex: 'processType', render: record => WarehousingTypes[record] },
    { title: '操作 ', align: 'center', fixed: 'right', render: record => { if (record.status === WAREHOUSING_STATUS_11) { return <Button type='link' onClick={() => retryOrder(record.id)}>查单重试</Button> } return '--'; } },
  ];

  const retryOrder = async (ids: number) => {
    try {
      const [err, data, msg] = await retry({ ids: [ids.toString()] })
      setVisible(false)
      if (!err) return message.success('操作成功')
      else return message.error(msg)
    } catch (error) { }
  }

  /**
   * @name: checkbox onChange 事件
   * @param {CheckboxChangeEvent} e
   */
  const handleSelectAll = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const keys = _.map(list, item => item.orderId.toString());
    const selections =
      (selectedRowKeys.length > 0 || checked) && selectedRowKeys.length !== keys.length ? keys : [];
    setSelectedRowKeys(selections);
  };

  const checkOrder = async (orderId: number, createTime: string) => {
    try {
      const [err, data, msg] = await getOuterWorkerList({ orderId, createTime: moment(createTime).format('YYYY-MM-DD HH:mm:ss') })
      if (!err) { setLists(data); setVisible(true) }
      else message.error(msg)
    } catch (error) {

    }
  }

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
      setSelectedRow(selectedRows)
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  /**
     * @name: 修改订单状态
     */
  const toTransactionType = (type: number) => {
    // if (selectedRowKeys.length !== 1) return message.error('只能选择一条数据进行操作!')
    if (selectedRow[0]?.status === 4 || selectedRow[0]?.status === 5) return message.error('订单已完成,无法修改!')
    if (selectedRow[0]?.isAbnormal !== 'Y') return message.error('订单没有异常!')
    setTransactionType(type);
    if (type === 3) {
      const obj = { ids: [selectedRow[0]?.id.toString()] };
      Map[type](obj);
      initList();
      return;
    }
    setModalVisible(true);
  }

  /**
   * @name: 修改订单状态
   */
  const setTransactionStatus = () => {
    form?.validateFields(async (err, value) => {
      if (!err) {
        const obj = { ids: [value?.ids.toString()], remark: value?.remark };
        Map[transactionType](obj)
        initList();
      }
    });

  }

  const Map = {
    [1]: async (val: any) => {
      try {
        const [err, data, msg] = await setToSuccess(val);

        if (!err) {
          message.success(data?.length ? data[0].message : "操作成功");
          setSelectedRowKeys([]);
          setSelectedRow([]);
        }
        else message.error(data?.length ? data[0].message : msg);
        setModalVisible(false);
      } catch (error) { }
    },
    [2]: async (val: any) => {
      try {
        const [err, data, msg] = await setToFailed(val);

        if (!err) {
          message.success(data?.length ? data[0].message : '操作成功');
          setSelectedRowKeys([]);
          setSelectedRow([]);
        }
        else message.error(data?.length ? data[0].message : msg);
        setModalVisible(false);
      } catch (error) { }
    },
    [3]: async (val: any) => {
      try {
        const [err, data, msg] = await reroute(val);

        if (!err) {
          message.success(data?.length ? data[0].message : '操作成功');
          setSelectedRowKeys([]);
          setSelectedRow([]);
        }
        else message.error(data?.length ? data[0].message : msg);
      } catch (error) { }
    }
  }

  /** 获取所有商户info */
  const getMerchantInfo = async () => {
    try {
      const [err, data, msg] = await searchMerchantList();
      if (!err) setMerchantInfo(data.list);
      else message.error(msg)
    } catch (error) { }
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>交易订单</div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
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
                  name="bizType"
                  label="交易类型"
                  placeholder="全部"
                >
                  {_.map(TransactionTypes, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantId"
                  label="商户号"
                  placeholder="全部"
                >
                  {_.map(merchantInfo, (item, key) => (
                    <Select.Option key={key} value={item?.merchantId}>
                      {item?.merchantName}
                    </Select.Option>
                  ))}
                </CstSelect>
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
              <Col span={7} >
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="status"
                  label="订单状态"
                  placeholder="全部"
                >
                  {_.map(OrderTypes, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
            </Row>
            <Row>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="goodsCode"
                  label="商品编号"
                  placeholder="请输入商品编号"
                />
              </Col>
              <Col span={9}>
                <CstRangePicker
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="time"
                  label="订单时间"
                  placeholder="请输入订单时间"
                />
              </Col>
              <Col span={4} >
                <CstCheckbox
                  labelCol={{ span: 14 }}
                  wrapperCol={{ span: 10 }}
                  name="isAbnormals"
                  label="异常订单"
                />
              </Col>
            </Row>
            <Row>
              <Col span={7} >
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="supplierCode"
                  label="供应商"
                  placeholder="全部"
                >
                  {_.map(goodsList, (item, key) => (
                    <Select.Option key={key} value={item?.code}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
              <Col span={9} push={1}>
                <Form.Item>
                  <Button
                    type="primary"
                    icon="search"
                    onClick={() => (currPage === 1 ? initList() : setCurrPage(1))}
                  >
                    筛选
                  </Button>
                  <Button
                    icon="undo"
                    style={{ marginLeft: '10px' }}
                    onClick={() => filterForm?.resetFields()}
                  >
                    重置
                  </Button>
                  <Button
                    icon="download"
                    onClick={() => download()}
                    style={{ marginLeft: '10px' }}
                  >
                    下载
                  </Button>
                  <Button
                    icon='download'
                    onClick={() => superDownload()}
                    style={{ marginLeft: '10px' }}
                  >
                    大数据下载
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </MapForm>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <span>
          <Checkbox
            indeterminate={list.length !== selectedRowKeys.length && selectedRowKeys.length > 0}
            onChange={handleSelectAll}
            checked={selectedRowKeys.length > 0}
          >
            当页全选
          </Checkbox>
        </span>
        <span>
          <Button
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => toTransactionType(1)}
          >
            {transaction_set_all[1]}
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => toTransactionType(2)}
          >
            {transaction_set_all[2]}
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => toTransactionType(3)}
          >
            {transaction_set_all[3]}
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={true}
          >
            {transaction_set_all[4]}
          </Button>
        </span>
      </div>
      <Table
        className="global-table"
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={list}
        rowKey={record => record.orderId.toString()}
        scroll={{ x: 1400 }}
      />
      <div className="global-pagination">
        <Pagination
          className="components-table-demo-nested"
          current={currPage}
          onChange={(currPage: number) => setCurrPage(currPage)}
          defaultPageSize={DEFAULT_PAGE_SIZE}
          total={total}
          showQuickJumper={true}
        />
        <span className="global-pagination-data">
          共 {total} 条 ,每页 {DEFAULT_PAGE_SIZE} 条
        </span>
      </div>
      <GlobalModal
        modalVisible={modalVisible}
        title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>{transaction_set_all[transactionType]}</div>}
        confirmLoading={confirmLoading}
        onOk={() => setTransactionStatus()}
        onCancel={() => setModalVisible(false)}
        width={560}
      >
        <MapForm className="filter-form" layout="horizontal" onCreate={setForm}>
          <CstInput
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            name="ids"
            label="订单号"
            style={{ display: 'none' }}
          />
          <CstInput
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            name="orderId"
            label="订单号"
            placeholder={selectedRow[0]?.orderId.toString()}
            disabled={true}
          />
          <CstInput
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            name="orderId"
            label="商品"
            placeholder={selectedRow[0]?.goodsName + selectedRow[0]?.goodsCode}
            disabled={true}
          />
          <CstInput
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            name="orderId"
            label="充值金额(元)"
            placeholder={getFloat(selectedRow[0]?.totalPay / TRANSTEMP, 4).toString()}
            disabled={true}
          />
          <CstInput
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            name="orderId"
            label="当前状态"
            placeholder={TransactionStatus[selectedRow[0]?.status]}
            disabled={true}
          />
          <CstTextArea
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            name="remark"
            label='备注'
            rules={[
              {
                required: true,
                message: '请填写备注',
              },
              {
                max: 50,
                message: '长度不能超过50个字符',
              },
            ]}
          />
        </MapForm>
      </GlobalModal>
      <GlobalModal
        modalVisible={visible}
        title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>路由详情</div>}
        confirmLoading={confirmLoading}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <Table columns={listColumns} dataSource={lists} pagination={false} scroll={{ x: 1800 }} />
      </GlobalModal>
    </div>
  );
};

export default connect(({ orderManagerTransaction, loading }: ConnectState) => ({
  list: orderManagerTransaction.list,
  total: orderManagerTransaction.total,
  loading: loading.effects['orderManagerTransaction/fetchList'],
}))(Comp);
