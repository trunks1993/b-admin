import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/application';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, IdCardTypes } from '@/const';
import { remove, EditeItemType, add, modify, getInfo } from '../services/application';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { FILE_ERROR_TYPE, FILE_ERROR_SIZE } from '@/components/GlobalUpload';
import { router } from 'umi';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstUpload } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

interface ErrMsgType {
  iconUrl?: string;
}

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.appId ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error('操作失败');
    return false;
  }
};

const HELP_MSG_ICONURL = '建议512*512px、JPEG、PNG格式, 文件小于1M';
const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<ListItemType>({});
  // confirmLoading
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [helpMsg, setHelpMsg] = useState<ErrMsgType>({
    iconUrl: HELP_MSG_ICONURL,
  });

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    if (modalVisible) {
      //   initAuth();
    }
  }, [modalVisible]);

  useEffect(() => {
    const { id, iconUrl, appName, resume, industry } = formData;
    if (modalVisible && id) {
      form?.setFieldsValue({
        appId: id,
        iconUrl,
        appName,
        resume,
        industry,
      });
    }
  }, [formData]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    dispatch({
      type: 'businessManagerApplication/fetchList',
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
   * @param {number} appId
   */
  const showConfirm = (appId: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(appId);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        dispatchInit();
      },
      onCancel() {},
    });
  };

  const handleModalVisible = async (record: ListItemType) => {
    const [err, data, msg] = await getInfo(record.id);
    setModalVisible(true);
    setFormData(data);
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '应用名',
      dataIndex: 'appName',
      align: 'center',
    },
    {
      title: '应用图标',
      align: 'center',
      render: record => (
        <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
      ),
    },
    {
      title: '所属商户',
      dataIndex: 'userNumber',
      align: 'center',
    },
    {
      title: '一句话介绍',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button type="link" onClick={() => router.push(`/business/manager/application/${record.id}`)}>
            配置
          </Button>
          <Button type="link" onClick={() => handleModalVisible(record)}>
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
        setCurrPage(1);
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
          新增应用
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
        title="编辑应用"
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="appId" style={{ display: 'none' }} />
          <CstUpload
            label="图标"
            name="iconUrl"
            rules={[
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    setHelpMsg({ ...helpMsg, iconUrl: '图片不能为空' });
                    callback(new Error('图片不能为空'));
                  } else if (value === FILE_ERROR_TYPE) {
                    setHelpMsg({ ...helpMsg, iconUrl: '文件格式错误' });
                    callback(new Error('文件格式错误'));
                  } else if (value === FILE_ERROR_SIZE) {
                    setHelpMsg({ ...helpMsg, iconUrl: '文件大小不能超过2M' });
                    callback(new Error('文件大小不能超过2M'));
                  } else {
                    setHelpMsg({ ...helpMsg, iconUrl: HELP_MSG_ICONURL });
                    callback();
                  }
                },
              },
            ]}
            action={`${process.env.BASE_FILE_SERVER}/upload`}
            method="POST"
            data={{
              userName: 'yunjin_file_upload',
              password: 'yunjin_upload_password',
              domain: 'product',
            }}
            help={helpMsg.iconUrl}
          />
          <CstInput
            name="appName"
            label="应用名称"
            placeholder="请输入应用名称"
            rules={[
              {
                required: true,
                message: '应用名称不能为空',
              },
            ]}
          />
          <CstTextArea
            name="resume"
            label="一句话介绍"
            placeholder="最多输入50个字"
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ businessManagerApplication, loading }: ConnectState) => ({
  list: businessManagerApplication.list,
  total: businessManagerApplication.total,
  loading: loading.effects['businessManagerApplication/fetchList'],
}))(Comp);
