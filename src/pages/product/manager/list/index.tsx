import React, { useEffect, useState, useReducer } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
// import { ListItemType } from '../models/list';
import { ListItemType as CategoryItemType } from '../models/group';

import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  UserStatuMap,
  ProductTypes,
  PRODUCT_STATUS_1,
  PRODUCT_STATUS_2,
  ProductStatusGU,
  TRANSTEMP,
} from '@/const';
import { remove, add, modify, EditeItemType, modifyStatus } from '../services/list';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import TabsPanel from './components/TabsPanel';
import router from 'umi/router';
import { ListItemType } from '@/models/product';
import LazyLoad from 'react-lazyload';
import { getFloat } from '@/utils';
import moment from 'moment';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstPassword } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  categoryList: CategoryItemType[];
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
    message.error(msg);
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, list, categoryList, total, loading }) => {
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
    getCategoryList();
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
      type: 'productManagerList/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
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
   * @name: 获取所有角色
   */
  const getCategoryList = () => {
    dispatch({
      type: 'productManagerGroup/fetchList',
      queryParams: {},
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
        const [err, data, msg] = await remove([id]);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        dispatchInit();
      },
      onCancel() {},
    });
  };

  /**
   * @name: 打开弹窗设置回显字段
   * @param {ListItemType} record
   */
  //   const handleModalVisible = async (record: ListItemType) => {
  //     const [err, data, msg] = await getSysUserInfo(record.id);
  //     setModalVisible(true);
  //     setFormData(data);
  //   };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      width: 260,
      key: 'id',
      fixed: 'left',
      render: record => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
          <span style={{ textAlign: 'left' }}>
            <div style={{ marginLeft: '5px' }}>{record.productSub.name}</div>
            <div style={{ marginLeft: '5px' }}>{record.code}</div>
          </span>
        </div>
      ),
    },
    {
      title: '价格（元）',
      align: 'center',
      // dataIndex: 'price',
      render: record => getFloat(record.price / TRANSTEMP, 4),
    },
    {
      title: '商品类型',
      align: 'center',
      render: record => ProductTypes[record.productTypeCode],
    },
    {
      title: '库存',
      align: 'center',
      dataIndex: 'stock',
    },
    {
      title: '销量',
      dataIndex: 'soldNum',
      align: 'center',
    },
    {
      title: '创建时间',
      align: 'center',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '商品状态',
      align: 'center',
      render: record => ProductStatusGU[record.status],
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: record => (
        <>
          <Button
            type="link"
            onClick={() => router.push(`/product/manager/list/edit?id=${record.id}`)}
          >
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
   * @name: 批量修改表单数据状态
   * @param {type}
   */
  const handleChangeDataStatus = async (status: number) => {
    confirm({
      title: '提示',
      content: `是否${ProductStatusGU[status]}`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await modifyStatus({ goodsIds: selectedRowKeys, status });
        if (!err) {
          dispatchInit(() => setSelectedRowKeys([]));
          message.success('操作成功');
        } else {
          message.error(msg);
        }
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
   * @name: 批量删除
   * @param {type}
   */
  const handleRemoveList = () => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(selectedRowKeys);
        if (!err) {
          dispatchInit(() => setSelectedRowKeys([]));
          message.success('操作成功');
        } else {
          message.error('操作失败');
        }
      },
      onCancel() {},
    });
  };

  /**
   * @name: 商品状态筛选
   * @param {string} activeKey
   */
  const handleTabsPanelChange = (activeKey: string) => {
    filterForm?.setFieldsValue({ status: activeKey });
    dispatchInit(() => setSelectedRowKeys([]));
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
        <Button type="primary" onClick={() => router.push(`/product/manager/list/edit`)}>
          发布商品
        </Button>
      </div>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
          <CstInput name="status" style={{ display: 'none' }} />
          <Row>
            <Col span={6}>
              <CstInput
                name="goods"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="商品筛选"
                placeholder="输入商品名称/编码"
              />
            </Col>
            <Col span={6}>
              <CstSelect
                name="categoryCode"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="商品分组"
                placeholder="请选择分组"
              >
                {_.map(categoryList, (item, key) => (
                  <Select.Option key={key} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={6}>
              <CstSelect
                name="productTypeCode"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="商品类型"
                placeholder="请选择商品类型"
              >
                {_.map(ProductTypes, (item, key) => (
                  <Select.Option key={key} value={key}>
                    {item}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={6} push={1}>
              <Form.Item>
                <Button type="primary" icon="search" onClick={() => dispatchInit()}>
                  筛选
                </Button>
                <Button
                  icon="undo"
                  onClick={() => {
                    const status = filterForm?.getFieldValue('status');
                    filterForm?.resetFields();
                    filterForm?.setFieldsValue({ status });
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </MapForm>
      </div>
      <div style={{ padding: '0 40px' }}>
        <TabsPanel onChange={handleTabsPanelChange}>
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
                onClick={() => handleChangeDataStatus(PRODUCT_STATUS_1)}
              >
                上架
              </Button>
              <Button
                loading={confirmLoading}
                disabled={selectedRowKeys.length === 0}
                onClick={() => handleChangeDataStatus(PRODUCT_STATUS_2)}
                style={{ marginLeft: '10px' }}
              >
                下架
              </Button>
              <Button
                loading={confirmLoading}
                disabled={selectedRowKeys.length === 0}
                onClick={handleRemoveList}
                style={{ marginLeft: '10px' }}
              >
                删除
              </Button>
              <Button
                loading={confirmLoading}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {}}
                style={{ marginLeft: '10px' }}
              >
                批量设置
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
            scroll={{ x: 1500 }}
            rowKey={record => record.id.toString()}
          />
          <div className="global-pagination">
            <Pagination
              current={currPage}
              onChange={(currPage: number) => setCurrPage(currPage)}
              defaultPageSize={DEFAULT_PAGE_SIZE}
              total={total}
              showQuickJumper={true}
            />
            <span className="global-pagination-data">
              共 {total} 条 ,每页 {DEFAULT_PAGE_SIZE} 条
            </span>
          </div>
        </TabsPanel>
      </div>
    </div>
  );
};

export default connect(({ productManagerList, productManagerGroup, loading }: ConnectState) => ({
  list: productManagerList.list,
  categoryList: productManagerGroup.list,
  total: productManagerList.total,
  loading: loading.effects['productManagerList/fetchList'],
}))(Comp);
