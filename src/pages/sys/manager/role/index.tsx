import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { RoleItemType } from '../models/role';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import { remove, getAuthorityList, getSysRoleInfo } from '../services/role';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import TreeCheck, { TreeDataItem } from './components/TreeCheck/index';
import { listToTree } from '@/utils';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstTreeCheck } = MapForm;

interface CompProps extends TableListData<RoleItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [treeData, setTreeData] = React.useState<TreeDataItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    if (modalVisible) {
      initAuth();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (modalVisible) {
      form?.setFieldsValue({
        name: '123',
        authorityCodes: [2, 3, 4],
      });
    }
  });

  /**
   * @name: 列表加载
   */
  const initList = () => {
    dispatch({
      type: 'sysManagerRole/fetchList',
      queryParams: {
        currPage,
        pageSize,
      },
    });
  };

  /**
   * @name: 查询权限列表
   */
  const initAuth = async () => {
    const [err, data, msg] = await getAuthorityList();
    const treeData = listToTree(data, item => {
      item.value = item.code;
      item.label = item.name;
    });
    setTreeData(treeData);
  };

  /**
   * @name: 删除
   * @param {number} code
   */
  const showConfirm = (code: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(code);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        initList();
      },
      onCancel() {},
    });
  };

  const handleModalVisible = async (record: RoleItemType) => {
    const [err, data, msg] = await getSysRoleInfo(record.code);
    setModalVisible(true);
  };

  const columns: ColumnProps<RoleItemType>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '用户数量',
      dataIndex: 'userNumber',
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
          <Button type="link" onClick={() => showConfirm(record.code)}>
            删除
          </Button>
        </>
      ),
    },
  ];

  /**
   * @name: 改变页码触发方法
   * @param {number} currPage
   */
  const handlePageChange = (currPage: number) => {
    setCurrPage(currPage);
    // initList();
  };

  /**
   * @name:
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields((err, value) => {
      console.log('handleSubmit -> err, value', err, value);
    });
  };

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 15,
      push: 1,
    },
  };

  return (
    <div>
      <div className={Styles.toolbar}>
        <Button type="link" onClick={() => setModalVisible(true)}>
          + 添加角色
        </Button>
      </div>
      <Table
        className="global-table"
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={list}
        rowKey={record => record.code.toString()}
      />
      <div className="global-pagination">
        <Pagination
          current={currPage}
          onChange={handlePageChange}
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
        title="编辑角色"
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <MapForm className="global-form" layout={formItemLayout} onCreate={setForm}>
          <CstInput
            name="name"
            label="角色名称"
            placeholder="请输入角色名称"
            rules={[
              {
                required: true,
                message: '角色名称不能为空',
              },
            ]}
          />
          <CstTextArea
            name="remark"
            label="角色描述"
            placeholder="最多输入50个字"
            customProps={{
              autoSize: { minRows: 3, maxRows: 5 },
            }}
          />
          <CstTreeCheck
            label="权限"
            rules={[{ required: true, message: '权限不能为空' }]}
            name="authorityCodes"
            customProps={{ treeData }}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ sysManagerRole, loading }: ConnectState) => ({
  list: sysManagerRole.list,
  total: sysManagerRole.total,
  loading: loading.effects['sysManagerRole/fetchList'],
}))(Comp);
