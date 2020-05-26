import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/info';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  IdentifyTypes,
  IdentifyStatus,
  MerchantStatus,
} from '@/const';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { router } from 'umi';
import { remove } from '../services/info';

const { confirm } = Modal;
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
      type: 'businessManagerInfo/fetchList',
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
   * @param {number} merchantId
   */
  const showConfirm = (merchantId: number) => {
    confirm({
      title: '提示',
      content: '是否注销',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(merchantId);
        if (!err) message.success('注销成功，即将刷新');
        else message.error('注销失败，请重试');
        dispatchInit();
      },
      onCancel() {},
    });
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      align: 'center',
    },
    {
      title: '商户号',
      align: 'center',
      dataIndex: 'merchantId',
    },
    {
      title: '商户类型',
      align: 'center',
      render: record => IdentifyTypes[record.merchantType],
    },
    {
      title: '状态',
      align: 'center',
      render: record => MerchantStatus[record.status],
    },
    {
      title: '联系人',
      align: 'center',
      dataIndex: 'contactName',
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button type="link" onClick={() => router.push(`/business/manager/info/${record.merchantId}`)}>
            编辑
          </Button>
          <Button type="link" onClick={() => showConfirm(record.merchantId)}>
            注销
          </Button>
        </>
      ),
    },
  ];

  /**
   * @name: checkbox onChange 事件
   * @param {CheckboxChangeEvent} e
   */
  const handleSelectAll = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const keys = _.map(list, item => item.merchantId.toString());
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
      <div className={Styles.toolbar}>
        <Button type="link" icon="plus" onClick={() => router.push(`/business/manager/info/-1`)}>
          新增商户
        </Button>
      </div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <Row>
              <Col span={6}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantName"
                  label="商户名称"
                  placeholder="请输入商户名称"
                />
              </Col>
              <Col span={6}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantType"
                  label="商户类型"
                  placeholder="请选择商户类型"
                >
                  {_.map(IdentifyTypes, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
              {/* <Col span={6}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="status"
                  label="状态"
                  placeholder="请选择状态"
                >
                  {_.map(MerchantStatus, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col> */}
              <Col span={6}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantId"
                  label="商户号"
                  placeholder="请输入商户号"
                />
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="telephone"
                  label="手机号码"
                  placeholder="请输入手机号码"
                />
              </Col>
              <Col span={12} push={12}>
                <Form.Item>
                  <Button
                    type="primary"
                    icon="search"
                    onClick={() => dispatchInit()}
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
        {/* <span>
          <Button
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => removeAll()}
          >
            批量删除
          </Button>
        </span> */}
      </div>
      <Table
        className="global-table"
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={list}
        rowKey={record => record.merchantId.toString()}
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

export default connect(({ businessManagerInfo, loading }: ConnectState) => ({
  list: businessManagerInfo.list,
  total: businessManagerInfo.total,
  loading: loading.effects['businessManagerInfo/fetchList'],
}))(Comp);
