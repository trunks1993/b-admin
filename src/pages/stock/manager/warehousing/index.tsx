import React, { useEffect, useState, useReducer } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/warehousing';
// import { ListItemType as CategoryItemType } from '../models/group';

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
  StockStatus,
  WarehousingStatus,
} from '@/const';
// import { remove, add, modify, EditeItemType, modifyStatus } from '../services/list';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import router from 'umi/router';
import { queryList as queryGroupList } from '@/pages/product/manager/services/group';
import { queryList as queryBrandList } from '@/pages/product/manager/services/brand';

import { ListItemType as CategoryItemType } from '@/pages/product/manager/models/group';
import { ListItemType as BrandItemType } from '@/pages/product/manager/models/brand';

import { ListItemType as SuppliersItemType } from '../models/suppliers';

import GlobalModal from '@/components/GlobalModal';
import { EditeItemType, batchBuyGoods } from '../services/productStock';
import moment from 'moment';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstCheckbox } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  supplierList: SuppliersItemType[];
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
  const [err, data, msg] = await batchBuyGoods(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error('操作失败');
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, list, supplierList, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([]);
  const [brandList, setBrandList] = useState<BrandItemType[]>([]);
  const [goodsCode, setGoodsCode] = useState<number>();

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  // useEffect(() => {
  //   getCategoryList();
  // }, []);

  // useEffect(() => {
  //   getBrand();
  // }, []);

  // useEffect(() => {
  //   getSupplierList();
  // }, []);

  useEffect(() => {
    form?.setFieldsValue({
      goodsCode,
    });
  }, [form]);

  /**
   * @name: 获取供应商
   */
  const getSupplierList = () => {
    dispatch({
      type: 'stockManagerSuppliers/fetchList',
      queryParams: {},
    });
  };

  /**
   * @name: 获取商品分组
   */
  const getCategoryList = async () => {
    const [err, data, msg] = await queryGroupList({});
    if (!err) setCategoryList(data.list);
  };

  /**
   * @name: 获取商品分组
   */
  const getBrand = async () => {
    const [err, data, msg] = await queryBrandList({});
    if (!err) setBrandList(data.list);
  };

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'stockManagerWarehousing/fetchList',
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
   * @param {number} goodsCode
   */
  const handleModalVisible = async (goodsCode: number) => {
    // const [err, data, msg] = await getSysUserInfo(record.id);
    setModalVisible(true);
    setGoodsCode(goodsCode);
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '单据编号',
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '采购订单号',
      align: 'center',
      dataIndex: 'orderId',
    },
    {
      title: '采购自供应商',
      align: 'center',
      dataIndex: 'supplierName',
    },
    {
      title: '状态',
      align: 'center',
      render: record => WarehousingStatus[record.status],
    },
    {
      title: '制单时间',
      align: 'center',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button
            type="link"
            onClick={() =>
              router.push(`/stock/manager/warehousing/detail/${record.code}-${record.status}`)
            }
          >
            详情
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
        dispatchInit();
        setModalVisible(false);
      }
    });
  };

  return (
    <div>
      <div className={Styles.toolbar}>
        <Button
          type="link"
          icon="plus"
          onClick={() => router.push(`/stock/manager/warehousing/edit`)}
        >
          新建商品入库
        </Button>
      </div>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
          <Row>
            <Col span={6}>
              <CstInput
                name="code"
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
                name="brandCode"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="品牌"
                placeholder="请选择品牌"
              >
                {_.map(brandList, (item, key) => (
                  <Select.Option key={key} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={6}>
              <CstSelect
                name="stockStatus"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="状态"
                placeholder="请选择状态"
              >
                {_.map(StockStatus, (item, key) => (
                  <Select.Option key={key} value={key}>
                    {item}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={6}>
              <CstCheckbox name="hasStock" title="仅显示有库存" keyMap={['Y', 'N']} />
            </Col>
            <Col span={6} push={1}>
              <Form.Item>
                <Button type="primary" icon="search" onClick={() => dispatchInit()}>
                  筛选
                </Button>
                <Button
                  icon="undo"
                  onClick={() => filterForm?.resetFields()}
                  style={{ marginLeft: '10px' }}
                >
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </MapForm>
      </div>

      <Table
        className="global-table"
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
    </div>
  );
};

export default connect(
  ({ stockManagerWarehousing, stockManagerSuppliers, loading }: ConnectState) => ({
    list: stockManagerWarehousing?.list,
    total: stockManagerWarehousing?.total,
    supplierList: stockManagerSuppliers?.list,
    loading: loading.effects['stockManagerWarehousing/fetchList'],
  }),
)(Comp);
