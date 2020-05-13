import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/group';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Icon } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from '@/const';
import { remove, EditeItemType, add, modify, getInfo } from '../services/brand';
import Styles from './index.css';
import GlobalModal from '@/components/GlobalModal';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import { FILE_ERROR_TYPE, FILE_ERROR_SIZE } from '@/components/GlobalUpload';
import { queryListSub, EditeItemSubType } from '../services/management';
import ExpandForm from './components/ExpandForm';
import _ from 'lodash';
import { guid } from '@/utils';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstUpload } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

export interface ListItemSubType extends ListItemType {
  facePrice: number | string;
  shortName: string;
  productCode: number;
}

interface ExpandedRowType {
  code: string;
  loading: boolean;
  list: ListItemSubType[];
  addFormList?: EditeItemSubType[];
}

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

  // 表格展开
  const [expandedRows, setExpandedRows] = useState<ExpandedRowType[]>([]);

  //   const [addList, setAddList] = useState<EditeItemSubType[]>([]);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {}, [expandedRows]);

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
      type: 'productManagement/fetchList',
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

  /**
   * @name: 编辑弹窗
   * @param {ListItemType} record
   */
  const handleModalVisible = async (record: ListItemType) => {
    const [err, data, msg] = await getInfo(record.code);
    setModalVisible(true);
    setFormData(data);
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '产品名称',
      align: 'center',
      key: 'name',
      width: 200,
      ellipsis: true,
      render: record => {
        const code = record.code.toString();
        const hasLoaded = expandedRows.find(item => item.code === code && !item.loading);
        const hasKey = expandedRows.find(item => item.code === code);
        return (
          <span>
            {record.name}
            {!hasLoaded && hasKey ? (
              <Icon type="loading" />
            ) : (
              <Icon
                type={hasKey ? 'up' : 'down'}
                onClick={async () => {
                  if (!hasKey) {
                    setExpandedRows([...expandedRows, { code, loading: true, list: [] }]);
                    const [err, data, msg] = await queryListSub(record.code);
                    if (!err)
                      setExpandedRows([...expandedRows, { code, loading: false, list: data }]);
                  } else {
                    setExpandedRows(expandedRows.filter(item => item.code !== code));
                  }
                }}
              />
            )}
          </span>
        );
      },
    },
    {
      title: '所属品牌',
      align: 'center',
      width: 150,
      ellipsis: true,
      dataIndex: 'brandName',
    },
    {
      title: '面值/规格',
      align: 'center',
      width: 100,
      render: () => '--',
    },
    {
      title: '创建时间',
      align: 'center',
      width: 200,
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button
            type="link"
            onClick={async () => {
              const code = record.code.toString();
              const hasKey = expandedRows.find(item => item.code === code);

              const formData = {
                productCode: record.code,
                uuid: guid(),
                name: '',
                shortName: '',
                facePrice: '',
              };

              if (!hasKey) {
                setExpandedRows([...expandedRows, { code, loading: true, list: [] }]);
                const [err, data, msg] = await queryListSub(record.code);
                if (!err)
                  setExpandedRows([
                    ...expandedRows,
                    { code, loading: false, list: data, addFormList: [formData] },
                  ]);
              } else {
                hasKey.addFormList && hasKey.addFormList.push(formData);
                const newExpandedRows = _.map(expandedRows, item => {
                  if (item.code === code) {
                    item.addFormList = hasKey.addFormList || [formData];
                  }
                  return item;
                });
                setExpandedRows(newExpandedRows);
              }
            }}
          >
            +子产品
          </Button>
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
          新增产品
        </Button>
      </div>
      <Table
        className="global-table"
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={list}
        rowKey={record => record.code.toString()}
        expandedRowRender={record => {
          const { list, addFormList } =
            expandedRows.find(item => item.code === record.code.toString()) || {};
          //   const ref = React.createRef();
          //   setRef([...refList, ref]);
          return (
            <ExpandForm
              saveRow={data => {
                const newList = list?.map(item => {
                  if (item.id === data.productSubId) {
                    item.shortName = data.shortName;
                    item.facePrice = data.facePrice;
                    item.name = data.name;
                  }
                  return item;
                });

                const newExpandedRows = expandedRows.map(item => {
                  if (item.code === record.code.toString()) {
                    item.list = newList || [];
                  }
                  return item;
                });

                setExpandedRows(newExpandedRows);
              }}
              brandName={record.brandName}
              dataSource={list}
              addFormList={addFormList}
              handleAddInputChange={(value: string, index: number, key: string) => {
                const newExpandedRows = expandedRows.map(item => {
                  if (item.code === record.code.toString() && item.addFormList) {
                    item.addFormList[index][key] = value;
                  }
                  return item;
                });
                setExpandedRows(newExpandedRows);
              }}
              removeFormItem={async (index: number, reload?: boolean) => {
                let newExpandedRows = expandedRows.map(item => {
                  if (item.code === record.code.toString() && item.addFormList) {
                    item.addFormList.splice(index, 1);
                  }
                  return item;
                });
                setExpandedRows(newExpandedRows);
                if (reload) {
                  const [err, data, msg] = await queryListSub(record.code);
                  if (!err)
                    newExpandedRows = expandedRows.map(item => {
                      if (item.code === record.code.toString()) {
                        item.list = data;
                      }
                      return item;
                    });
                  setExpandedRows(newExpandedRows);
                }
              }}
            />
          );
        }}
        expandedRowKeys={expandedRows.filter(item => !item.loading).map(item => item.code)}
        expandIcon={() => null}
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
            }}
            label="分组图标"
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ productManagement, loading }: ConnectState) => ({
  list: productManagement.list,
  total: productManagement.total,
  loading: loading.effects['productManagement/fetchList'],
}))(Comp);
