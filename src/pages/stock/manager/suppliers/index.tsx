import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/suppliers';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  IdentifyTypes,
  IDENTIFY_TYPE_1,
  IdentifyStatus,
  SupplierStatus,
  TRANSTEMP,
  SUPPLIER_STATUS_1,
} from '@/const';
import {
  remove,
  batchModifyStatus,
  modify,
  add,
  EditeItemType,
  batchModifyAmount,
  ModifyAmountParamsType,
} from '../services/suppliers';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import GlobalModal from '@/components/GlobalModal';
import { getFloat } from '@/utils';

const { confirm } = Modal;
const { CstInput, CstSelect } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.id ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error(msg);
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalBlanceVisible, setModalBlanceVisible] = useState(false);
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeItemType>({});

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    const {
      id,
      name,
      address,
      mainTelephone,
      mainContactName,
      minorTelephone,
      minorContactName,
    } = formData;
    if (modalVisible && id) {
      form?.setFieldsValue({
        id,
        name,
        address,
        mainTelephone,
        mainContactName,
        minorTelephone,
        minorContactName,
      });
    }
  }, [form]);

  /**
   * @name: 触发列表加载effect
   * @param {type}
   */
  const dispatchInit = (callback?: () => void) => {
    callback && callback();
    currPage === 1 ? initList() : setCurrPage(1);
  };

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'stockManagerSuppliers/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
      },
    });
  };

  /**
   * @name: 删除
   * @param {number} id
   */
  const showConfirm = (id: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(id);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        initList();
      },
      onCancel() {},
    });
  };

  /**
   * @name: 批量删除表单数据状态
   * @param {number} status
   * @param {string[]} selectedRowKeys
   */
  const handleBatchModifyStatus = async (status: number) => {
    confirm({
      title: '提示',
      content: status === 0 ? '是否启用' : '是否关闭',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await batchModifyStatus(selectedRowKeys, status);
        if (!err) {
          initList();
          setSelectedRowKeys([]);
          message.success('操作成功，即将刷新');
        } else message.error('操作失败，请重试');
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
    const keys = _.map(list, item => item.id.toString());
    const selections =
      (selectedRowKeys.length > 0 || checked) && selectedRowKeys.length !== keys.length ? keys : [];
    setSelectedRowKeys(selections);
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
        dispatchInit();
        setModalVisible(false);
      }
    });
  };

  /**
   * @name:
   * @param {void}
   */
  const handleBlanceSubmit = () => {
    form?.validateFields(async (error, { amount }: ModifyAmountParamsType) => {
      if (error) return;
      const paramObj = {
        amount,
        userId: '',
        realname: '',
        suppliers: _.map(selectedRowKeys, id => {
          const o = _.find(list, item => item.id == id);
          return {
            supplierCode: o?.code,
            accountNo: o?.accountNo,
          };
        }),
      };
      setConfirmLoading(true);
      const [err, data, msg] = await batchModifyAmount(paramObj);
      if (!err) {
        dispatchInit();
        setModalBlanceVisible(false);
      } else {
        message.error(msg);
      }
      setConfirmLoading(false);
    });
  };

  /**
   * @name:
   * @param {type}
   */
  const handleModalVisible = async (record: ListItemType) => {
    setModalVisible(true);
    setFormData(record);
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '供应商编号',
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '状态',
      align: 'center',
      render: record => SupplierStatus[record.status],
    },
    {
      title: '系统余额(元)',
      align: 'center',
      render: record => getFloat((record.amount || 0) / TRANSTEMP, 4),
    },
    // {
    //   title: '查询余额(元)',
    //   dataIndex: 'name',
    //   align: 'center',
    // },
    // {
    //   title: '近十分钟扣款',
    //   dataIndex: 'name',
    //   align: 'center',
    // },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button type="link" onClick={() => handleModalVisible(record)}>
            编辑
          </Button>
          {record.status !== SUPPLIER_STATUS_1 && (
            <Button type="link" onClick={() => showConfirm(record.id)}>
              删除
            </Button>
          )}
        </>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 15,
      push: 1,
    },
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>
        <Button
          type="link"
          icon="plus"
          onClick={() => {
            setModalVisible(true);
            setFormData({});
          }}
        >
          新增供应商
        </Button>
      </div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <Row>
              <Col span={6}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="status"
                  label="状态"
                  placeholder="全部"
                >
                  {_.map(SupplierStatus, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
              <Col span={8}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="name"
                  label="供应商名称"
                  placeholder="供应商名称"
                />
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
        <span>
          <Button
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleBatchModifyStatus(0)}
          >
            启用
          </Button>
          <Button
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleBatchModifyStatus(1)}
            style={{ marginLeft: '10px' }}
          >
            关闭
          </Button>
          <Button
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setModalBlanceVisible(true)}
            style={{ marginLeft: '10px' }}
          >
            调整余额
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
        rowKey={record => record.id.toString()}
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
      <GlobalModal
        modalVisible={modalVisible}
        title={formData.id ? '编辑供应商' : '新增供应商'}
        onCancel={() => {
          setModalVisible(false);
          setFormData({});
        }}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="id" style={{ display: 'none' }} />
          <CstInput
            name="name"
            label="供应商名称"
            placeholder="请输入供应商名称"
            rules={[
              {
                required: true,
                message: '供应商名称不能为空',
              },
            ]}
          />
          <CstInput
            name="address"
            label="地址"
            placeholder="请输入地址"
            rules={[
              {
                required: true,
                message: '地址不能为空',
              },
            ]}
          />
          <CstInput
            name="mainContactName"
            label="主要联系人"
            placeholder="请输入主要联系人"
            rules={[
              {
                required: true,
                message: '主要联系人不能为空',
              },
            ]}
          />
          <CstInput
            name="mainTelephone"
            label="主要联系人电话"
            placeholder="请输入主要联系人电话"
            rules={[
              {
                required: true,
                message: '主要联系人电话不能为空',
              },
              {
                pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
                message: '手机格式有误',
              },
            ]}
          />
          <CstInput name="minorContactName" label="次要联系人" placeholder="请输入次要联系人" />
          <CstInput
            name="minorTelephone"
            label="次要联系电话"
            placeholder="请输入次要联系电话"
            rules={[
              {
                pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
                message: '手机格式有误',
              },
            ]}
          />
        </MapForm>
      </GlobalModal>
      <GlobalModal
        modalVisible={modalBlanceVisible}
        title="修改余额"
        onCancel={() => setModalBlanceVisible(false)}
        onOk={handleBlanceSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput
            name="amount"
            label="余额"
            placeholder="请输入余额"
            rules={[
              {
                required: true,
                message: '余额不能为空',
              },
            ]}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ stockManagerSuppliers, loading }: ConnectState) => ({
  list: stockManagerSuppliers.list,
  total: stockManagerSuppliers.total,
  loading: loading.effects['stockManagerSuppliers/fetchList'],
}))(Comp);
