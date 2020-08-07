import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/transaction';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import GlobalModal from '@/components/GlobalModal';
import { setToSuccess, setToFailed, reroute } from '../services/transaction';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  TransactionAbnormal,
  TransactionStatus,
  TRANSTEMP,
  TransactionTypes,
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import { getFloat } from '@/utils';

const { CstInput, CstSelect, CstTextArea, CstCheckbox } = MapForm;
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

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
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
    const isAbnormal = data?.isAbnormals ? 'Y' : undefined
    dispatch({
      type: 'orderManagerTransaction/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
        isAbnormal,
      },
    });
  };


  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商户信息',
      align: 'center',
      dataIndex: 'merchantId',
    },
    {
      title: '订单号/外部订单号',
      align: 'center',
      width: 200,
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
      width: 100,
      render: record => TransactionTypes[record.bizType],
    },
    {
      title: '状态',
      align: 'center',
      width: 100,
      render: record => TransactionStatus[record.status],
    },
    {
      title: '充值账号',
      align: 'center',
      dataIndex: 'rechargeAccount',
    },
    {
      title: '异常订单',
      align: 'center',
      render: (record) => {
        if (record.isAbnormal === 'Y') return <div>是</div>
        else return <div>否</div>
      }
    },
    {
      title: '充值金额(元)',
      align: 'center',
      render: record => getFloat(record.totalPay / TRANSTEMP, 4),
    },
    {
      title: '商品',
      align: 'center',
      // dataIndex: 'goodsName',
      render: record => `${record.goodsName}(${record.goodsCode})`
    },
    {
      title: '请求时间',
      align: 'center',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '完成时间',
      align: 'center',
      render: record =>
        record.completeTime && moment(record.completeTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '耗时',
      align: 'center',
      width: 100,
      render: record => {
        const time = moment(record.completeTime).valueOf() - moment(record.createTime).valueOf();
        return record.completeTime ? time / 1000 + 's' : '';
      },
    },
    {
      title: '供应商通道',
      align: 'center',
      dataIndex: 'supplierCode',
    },
  ];

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
    if (selectedRowKeys.length !== 1) return message.error('只能选择一条数据进行操作!')
    if (selectedRow[0]?.status === 4 || selectedRow[0]?.status === 5) return message.error('订单已完成,无法修改!')
    if (selectedRow[0]?.isAbnormal !== 'Y') return message.error('订单没有异常!')
    setTransactionType(type);
    if (type === 3) {
      console.log(selectedRow)
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
              <Col span={4}>
                <CstCheckbox
                  labelCol={{ span: 14 }}
                  wrapperCol={{ span: 10 }}
                  name="isAbnormals"
                  label="异常订单"
                />
              </Col>
              <Col span={5} >
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
        scroll={{ x: 1800 }}
      />
      <div className="global-pagination">
        <Pagination
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
            ]}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ orderManagerTransaction, loading }: ConnectState) => ({
  list: orderManagerTransaction.list,
  total: orderManagerTransaction.total,
  loading: loading.effects['orderManagerTransaction/fetchList'],
}))(Comp);
