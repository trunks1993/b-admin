import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/group';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import { remove, EditeItemType, add, modify, getInfo } from '../services/group';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { FILE_ERROR_TYPE, FILE_ERROR_SIZE } from '@/components/GlobalUpload';
import moment from 'moment';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstUpload } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}
interface ErrMsgType {
  iconUrl?: string;
}
const HELP_MSG_ICONURL = '建议上传120*120px大小的JPEG、PNG格式图片, 且文件小于1M';
const handleEdite = async (fields: EditeItemType) => {
  const api = fields.categoryCode ? modify : add;
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
      type: 'productManagerGroup/fetchList',
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
      title: '分组名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '商品数量',
      dataIndex: 'goodsCount',
      align: 'center',
    },
    {
      title: '创建时间',
      align: 'center',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
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
          新建商品分组
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
        title={formData.code ? '编辑分组' : '新增分组'}
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
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10, push: 1 }}
            rules={[
              {
                required: true,
                message: '分组名称不能为空',
              },
              {
                max: 20,
                message: '最多输入20个字符',
              },
            ]}
          />
          <CstUpload
            name="iconUrl"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10, push: 1 }}
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (value === FILE_ERROR_TYPE) {
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
            help={helpMsg.iconUrl}
            action={`${process.env.BASE_FILE_SERVER}/upload`}
            method="POST"
            data={{
              userName: 'yunjin_file_upload',
              password: 'yunjin_upload_password',
              domain: 'category',
            }}
            label="分组图标"
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ productManagerGroup, loading }: ConnectState) => ({
  list: productManagerGroup.list,
  total: productManagerGroup.total,
  loading: loading.effects['productManagerGroup/fetchList'],
}))(Comp);
