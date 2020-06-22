import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/user';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, UserStatuMap } from '@/const';
import { remove, getInfo, EditeUserItemType, add, modify, modifyStatus } from '../services/user';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { listToTree } from '@/utils';
import { ListItemType as RoleItemType } from '../models/role';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import md5 from 'js-md5';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstPassword } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  roles: RoleItemType[];
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

const handleEdite = async (fields: EditeUserItemType) => {
  const api = fields.userId ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error(msg);
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading, roles }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeUserItemType>({});
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
    const { userId, userName, password, realname, roleCode, remark } = formData;
    if (modalVisible && userId) {
      form?.setFieldsValue({
        userId,
        userName,
        password,
        realname,
        roleCode,
        remark,
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
      type: 'sysManagerRole/fetchList',
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
   * @name: 触发列表加载effect
   * @param {type}
   */
  const dispatchInit = (callback?: () => void) => {
    callback && callback();
    currPage === 1 ? initList() : setCurrPage(1);
  };

  /**
   * @name: 打开弹窗设置回显字段
   * @param {ListItemType} record
   */
  const handleModalVisible = async (record: ListItemType) => {
    const [err, data, msg] = await getInfo(record.userId);
    setModalVisible(true);
    setFormData(data);
  };

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
      render: record => UserStatuMap[record.status],
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
          <Button type="link" onClick={() => handleModalVisible(record)}>
            编辑
          </Button>
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
    form?.validateFields(async (error, value: EditeUserItemType) => {
      value.password && (value.password = md5(value.password));
      if (error) return;
      setConfirmLoading(true);
      try {
        const isSuccess = await handleEdite(value);
        if (isSuccess) {
          dispatchInit();
          setModalVisible(false);
        }
      } catch (error) {}
      setConfirmLoading(false);
    });
  };

  /**
   * @name: 批量修改表单数据状态
   * @param {type}
   */
  const handleChangeDataStatus = async (status: number) => {
    setConfirmLoading(true);
    const [err, data, msg] = await modifyStatus({ userIds: selectedRowKeys, status });
    setConfirmLoading(false);
    if (!err) {
      initList();
      setSelectedRowKeys([]);
      message.success('操作成功');
    } else {
      message.error(msg);
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
          添加用户
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
                  name="roleCode"
                  label="角色"
                  placeholder="全部"
                >
                  {_.map(roles, (item, index) => (
                    <Select.Option key={index} value={item.code}>
                      {item.name}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
              <Col span={6}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="status"
                  label="状态"
                  placeholder="全部"
                >
                  {_.map(UserStatuMap, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
              <Col span={6}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="userName"
                  label="账号"
                  placeholder="输入登录账号"
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
      </div>

      <GlobalModal
        modalVisible={modalVisible}
        title={formData.userId ? '编辑用户' : '新增用户'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="userId" style={{ display: 'none' }} />
          <CstInput
            name="userName"
            label="账号"
            placeholder="请输入账号"
            rules={[
              {
                required: true,
                message: '账号不能为空',
              },
              {
                max: 20,
                message: '最多不超过20位字符',
              },
            ]}
          />
          <CstPassword
            name="password"
            label="密码"
            placeholder="请输入密码"
            rules={[
              {
                required: !formData.userId,
                message: '密码不能为空',
              },
            ]}
          />
          <CstInput
            name="realname"
            label="用户名称"
            placeholder="请输入用户名称"
            rules={[
              {
                required: true,
                message: '用户名称不能为空',
              },
            ]}
          />
          <CstSelect
            name="roleCode"
            label="角色"
            placeholder="请选择角色"
            rules={[
              {
                required: true,
                message: '角色不能为空',
              },
            ]}
          >
            {_.map(roles, (item, index) => (
              <Select.Option key={index} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </CstSelect>
          <CstTextArea
            name="remark"
            label="备注"
            placeholder="最多输入50个字"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ sysManagerUser, sysManagerRole, loading }: ConnectState) => ({
  list: sysManagerUser.list,
  roles: sysManagerRole.list,
  total: sysManagerUser.total,
  loading: loading.effects['sysManagerUser/fetchList'],
}))(Comp);
