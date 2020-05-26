import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/role';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import { remove, getAuthorityList, EditeItemType, add, modify, getInfo } from '../services/role';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { TreeDataItem } from './components/TreeCheck/index';
import { listToTree } from '@/utils';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstTreeCheck } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

interface FormDataType {
  sysAuthorityList?: number[];
  sysRole?: ListItemType;
}

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.code ? modify : add;
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
  const [treeData, setTreeData] = React.useState<TreeDataItem[]>([]);
  const [oldTreeData, setOldTreeData] = React.useState<TreeDataItem[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({});
  // confirmLoading
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    if (modalVisible) {
      initAuth();
    }
  }, [modalVisible]);

  useEffect(() => {
    const { sysAuthorityList, sysRole } = formData;
    if (modalVisible && sysRole?.code) {
      form?.setFieldsValue({
        code: sysRole.code,
        name: sysRole?.name,
        remark: sysRole.remark,
        authorityCodes: sysAuthorityList,
      });
    }
  }, [formData]);

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
   * @name: 触发列表加载effect
   * @param {type}
   */
  const dispatchInit = (callback?: () => void) => {
    callback && callback();
    currPage === 1 ? initList() : setCurrPage(1);
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
    setOldTreeData(data);
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
        dispatchInit();
      },
      onCancel() {},
    });
  };

  const handleModalVisible = async (record: ListItemType) => {
    const [err, data, msg] = await getInfo(record.code);
    setModalVisible(true);
    setFormData(data);
  };

  const columns: ColumnProps<ListItemType>[] = [
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
        <Button type="link" icon="plus" onClick={() => setModalVisible(true)}>
          添加角色
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
        title="编辑角色"
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="code" style={{ display: 'none' }} />
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
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          <CstTreeCheck
            label="权限"
            rules={[{ required: true, message: '权限不能为空' }]}
            name="authorityCodes"
            treeData={treeData}
            oldTreeData={oldTreeData}
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
