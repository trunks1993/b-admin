import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/auth';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  IdentifyTypes,
  IDENTIFY_TYPE_1,
  IdentifyStatus,
  IDENTIFY_TYPE_2,
  IDENTIFY_STATUS_2,
  IDENTIFY_STATUS_3,
  IDENTIFY_STATUS_1,
} from '@/const';
import { getInfo, remove } from '../services/auth';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { router } from 'umi';

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
      type: 'businessManagerAuth/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
      },
    });
  };

  /**
   * @name: 删除
   * @param {number} userId
   */
  const showConfirm = (merchantIds: number[]) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(merchantIds);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        initList();
      },
      onCancel() {},
    });
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '手机号',
      dataIndex: 'telephone',
      align: 'center',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      align: 'center',
    },
    {
      title: '认证类型',
      align: 'center',
      render: record => IdentifyTypes[record.identifyType],
    },
    {
      title: '状态',
      align: 'center',
      render: record => IdentifyStatus[record.status],
    },
    {
      title: '联系人',
      align: 'center',
      render: record => {
        const data = JSON.parse(record.data);
        return record.identifyType === IDENTIFY_TYPE_1 ? data.realName : data.contactName;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          {record.status === IDENTIFY_STATUS_1 ? (
            <Button type="link" onClick={() => router.push(`/business/manager/auth/edit?id=${record.id}`)}>
              审批
            </Button>
          ) : null}
          {record.status !== IDENTIFY_STATUS_2 ? (
            <Button type="link" onClick={() => showConfirm([record.merchantId])}>
              删除
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  /**
   * @name: 批量删除表单数据状态
   * @param {type}
   */
  const removeAll = async () => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(selectedRowKeys);
        if (!err) {
          initList();
          setSelectedRowKeys([]);
          message.success('删除成功，即将刷新');
        } else message.error('删除失败，请重试');
        initList();
      },
      onCancel() {},
    });
  };

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
    <div className={Styles.container}>
      <div className={Styles.toolbar}>
        {/* <Button type="link" icon="plus" onClick={() => setModalVisible(true)}>
          添加用户
        </Button> */}
        商户认证
      </div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <Row>
              <Col span={6}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="telephone"
                  label="手机号"
                  placeholder="请输入手机号"
                />
              </Col>
              <Col span={6}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantName"
                  label="商户名称"
                  placeholder="商户名称"
                />
              </Col>
              <Col span={6}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="status"
                  label="状态"
                  placeholder="请选择状态"
                >
                  {_.map(IdentifyStatus, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>

              <Col span={6} push={1}>
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

export default connect(({ businessManagerAuth, loading }: ConnectState) => ({
  list: businessManagerAuth.list,
  total: businessManagerAuth.total,
  loading: loading.effects['businessManagerAuth/fetchList'],
}))(Comp);
