import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/group';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import { remove, EditeItemType, add, modify, getInfo } from '../services/brand';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { FILE_ERROR_TYPE, FILE_ERROR_SIZE } from '@/components/GlobalUpload';
import router from 'umi/router';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstUpload } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.categoryCode ? modify : add;
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

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<ListItemType>({});
  // confirmLoading
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    const { code, iconUrl, name } = formData;
    if (modalVisible && code) {
      form?.setFieldsValue({
        categoryCode: code,
        iconUrl,
        name,
      });
    }
  }, [formData]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    dispatch({
      type: 'productManagerBrand/fetchList',
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
      title: '品牌名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '品牌LOGO',
      align: 'center',
      render: record => (
        <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
      ),
    },
    {
      title: '简单描述',
      dataIndex: 'resume',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button type="link" onClick={() => router.push(`/product/manager/brand/${record.id}`)}>
            编辑
          </Button>
          <Button type="link" onClick={() => showConfirm(record.id)}>
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
    <div className={Styles.container}>
      <div className={Styles.toolbar}>
        <Button type="link" icon="plus" onClick={() => router.push(`/product/manager/brand/-1`)}>
          新增品牌
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
          <CstInput name="categoryCode" style={{ display: 'none' }} />
          <CstInput
            name="name"
            label="分组名称"
            placeholder="请输入分组名称"
            rules={[
              {
                required: true,
                message: '分组名称不能为空',
              },
            ]}
          />
          <CstUpload
            name="iconUrl"
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (value === FILE_ERROR_TYPE) callback(new Error('文件格式错误'));
                  if (value === FILE_ERROR_SIZE) callback(new Error('文件大小不能超过2M'));
                  callback();
                },
              },
            ]}
            action={`${process.env.BASE_FILE_SERVER}/upload`}
            method="POST"
            data={{
              userName: 'yunjin_file_upload',
              password: 'yunjin_upload_password',
              domain: 'category',
              secret: 'N',
            }}
            label="分组图标"
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ productManagerBrand, loading }: ConnectState) => ({
  list: productManagerBrand.list,
  total: productManagerBrand.total,
  loading: loading.effects['productManagerBrand/fetchList'],
}))(Comp);
