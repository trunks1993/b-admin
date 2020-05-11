import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/list';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, userStatuMap } from '@/const';
import { remove, add, modify, EditeItemType } from '../services/list';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import TabsPanel from './components/TabsPanel';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstPassword } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 15,
    push: 1,
  },
};

const filterFormItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
  },
};

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

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeItemType>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    getRols();
  }, []);

  useEffect(() => {
    const {
      goodsId,
      productSubCode,
      productTypeCode,
      price,
      purchaseNotes,
      usageIllustration,
    } = formData;
    if (modalVisible && goodsId) {
      form?.setFieldsValue({
        goodsId,
        productSubCode,
        productTypeCode,
        price,
        purchaseNotes,
        usageIllustration,
      });
    }
  }, [formData]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'sysManagerUser/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
      },
    });
  };

  /**
   * @name: 获取所有角色
   */
  const getRols = () => {
    dispatch({
      type: 'productManagerList/fetchList',
      queryParams: {},
    });
  };

  /**
   * @name: 删除
   * @param {number} userId
   */
  const showConfirm = (userId: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(userId);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        initList();
      },
      onCancel() {},
    });
  };

  /**
   * @name: 打开弹窗设置回显字段
   * @param {ListItemType} record
   */
  //   const handleModalVisible = async (record: ListItemType) => {
  //     const [err, data, msg] = await getSysUserInfo(record.userId);
  //     setModalVisible(true);
  //     setFormData(data);
  //   };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '账号',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'realname',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '状态',
      align: 'center',
      render: record => userStatuMap[record.status],
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          {/* <Button type="link" onClick={() => handleModalVisible(record)}>
            编辑
          </Button> */}
          <Button type="link" onClick={() => showConfirm(record.userId)}>
            删除
          </Button>
        </>
      ),
    },
  ];

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
        setCurrPage(1);
        setModalVisible(false);
      }
    });
  };

  /**
   * @name: 批量修改表单数据状态
   * @param {type}
   */
  const handleChangeDataStatus = async (status: number) => {
    setConfirmLoading(true);
    const [err, data, msg] = await modifySysUserStatus({ userIds: selectedRowKeys, status });
    setConfirmLoading(false);
    if (!err) {
      initList();
      setSelectedRowKeys([]);
      message.success('操作成功');
    } else {
      message.error('操作失败');
    }
  };

  /**
   * @name: checkbox onChange 事件
   * @param {CheckboxChangeEvent} e
   */
  const handleSelectAll = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    const keys = _.map(list, item => item.userId.toString());
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
      <TabsPanel />
      {/* <div className={Styles.toolbar}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          发布商品
        </Button>
      </div>
      <div className={Styles.filter}>
          <MapForm className="filter-form" layout="inline" onCreate={setFilterForm}>
            <CstSelect
              name="roleCode"
              label="商品筛选"
              style={{ width: '160px' }}
              placeholder="请选择角色"
            >
            </CstSelect>
            <CstSelect
              name="status"
              label="商户分组"
              style={{ width: '160px' }}
              placeholder="请选择角色"
            >
              {_.map(userStatuMap, (item, key) => (
                <Select.Option key={key} value={key}>
                  {item}
                </Select.Option>
              ))}
            </CstSelect>
            <CstSelect
              name="status"
              label="商品类型"
              style={{ width: '160px' }}
              placeholder="请选择角色"
            >
              {_.map(userStatuMap, (item, key) => (
                <Select.Option key={key} value={key}>
                  {item}
                </Select.Option>
              ))}
            </CstSelect>
            <Form.Item>
              <Button
                type="primary"
                icon="search"
                onClick={() => (currPage === 1 ? initList() : setCurrPage(1))}
              >
                筛选
              </Button>
            </Form.Item>
            <Form.Item>
              <Button icon="undo" onClick={() => filterForm?.resetFields()}>
                重置
              </Button>
            </Form.Item>
          </MapForm>
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
            onClick={() => handleChangeDataStatus(0)}
          >
            启用
          </Button>
          <Button
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => handleChangeDataStatus(1)}
            style={{ marginLeft: '10px' }}
          >
            关闭
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
        rowKey={record => record.userId.toString()}
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
      </div> */}
    </div>
  );
};

export default connect(({ productManagerList, loading }: ConnectState) => ({
  list: productManagerList.list,
  total: productManagerList.total,
  loading: loading.effects['sysManagerUser/fetchList'],
}))(Comp);
