import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/transaction';
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
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';

const { CstInput, CstSelect } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'orderManagerTransaction/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
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
      dataIndex: 'customerOrderNo',
    },
    {
      title: '状态',
      align: 'center',
      render: record => TransactionStatus[record.status],
    },
    {
      title: '充值账号',
      align: 'center',
      dataIndex: 'rechargeAccount',
    },
    {
      title: '充值金额(元)',
      align: 'center',
      dataIndex: 'totalPay',
    },
    {
      title: '商品',
      align: 'center',
      dataIndex: 'goodsName',
    },
    {
      title: '请求时间',
      align: 'center',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '完成时间',
      align: 'center',
      render: record => moment(record.completeTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '耗时',
      align: 'center',
      render: record => {
        const time =
          moment(record.completeTime).valueOf() - moment(record.createTime).valueOf();
        return time / 1000 + 's';
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
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div>
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
          <Button loading={confirmLoading} disabled={selectedRowKeys.length === 0}>
            置成功
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            置失败
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            置异常
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            分流至
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            再次充值
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
        scroll={{ x: 1300 }}
      />
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

export default connect(({ orderManagerTransaction, loading }: ConnectState) => ({
  list: orderManagerTransaction.list,
  total: orderManagerTransaction.total,
  loading: loading.effects['orderManagerTransaction/fetchList'],
}))(Comp);
