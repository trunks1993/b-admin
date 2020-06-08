import React, { useEffect, useState, useReducer } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
// import { ListItemType } from '../models/productStock';
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
import { ListItemType } from '@/models/product';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstCheckbox, CstInputNumber } = MapForm;

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
    message.error(msg);
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, list, supplierList, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([]);
  const [brandList, setBrandList] = useState<BrandItemType[]>([]);
  const [goodsCode, setGoodsCode] = useState<number>();

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    getBrand();
  }, []);

  useEffect(() => {
    getSupplierList();
  }, []);

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
      queryParams: {
        status: 0,
      },
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
      type: 'productManagerList/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
        productTypeCodes: [101, 102, 103],
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
      title: '商品名称',
      align: 'center',
      width: 260,
      key: 'id',
      render: record => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
          <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
          <span style={{ textAlign: 'left' }}>
            <div style={{ marginLeft: '5px' }}>{record.productSub.name}</div>
            <div style={{ marginLeft: '5px' }}>{record.code}</div>
          </span>
        </div>
      ),
    },
    {
      title: '状态',
      align: 'center',
      render: record => StockStatus[record.stockStatus],
    },
    {
      title: '总库存(件)',
      align: 'center',
      dataIndex: 'stock',
    },
    {
      title: '占用库存(件)',
      align: 'center',
      dataIndex: 'lockedStock',
    },
    {
      title: '可用库存(件)',
      align: 'center',
      render: record => record.stock - record.lockedStock,
    },
    // {
    //   title: '平均成本(元)',
    //   align: 'center',
    //   dataIndex: 'lockedStock',
    // },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <>
          <Button type="link" onClick={() => handleModalVisible(record.code)}>
            采购
          </Button>
          <Button
            type="link"
            onClick={() => router.push(`/stock/manager/stockWater?goods=${record.productSub.name}`)}
          >
            库存流水
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
    <div className={Styles.container}>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
          <Row>
            <Col span={8}>
              <CstInput
                name="goods"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="商品筛选"
                placeholder="输入商品名称/编码"
              />
            </Col>

            <Col span={8}>
              <CstSelect
                name="categoryCode"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="商品分组"
                placeholder="全部"
              >
                {_.map(categoryList, (item, key) => (
                  <Select.Option key={key} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>

            <Col span={8}>
              <CstSelect
                name="brandCode"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="品牌"
                placeholder="全部"
              >
                {_.map(brandList, (item, key) => (
                  <Select.Option key={key} value={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={8}>
              <CstSelect
                name="stockStatus"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="状态"
                placeholder="全部"
              >
                {_.map(StockStatus, (item, key) => (
                  <Select.Option key={key} value={key}>
                    {item}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={8} push={1}>
              <CstCheckbox name="hasStock" title="仅显示有库存" keyMap={['Y', 'N']} />
            </Col>
            <Col span={8}>
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

      <GlobalModal
        modalVisible={modalVisible}
        title="商品采购"
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="goodsCode" style={{ display: 'none' }} />
          <CstSelect
            name="supplierCode"
            label="供应商"
            placeholder="请选择供应商"
            rules={[
              {
                required: true,
                message: '供应商不能为空',
              },
            ]}
          >
            {_.map(supplierList, item => (
              <Select.Option key={item.code} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </CstSelect>
          <CstInputNumber
            name="buyNum"
            label="采购数量"
            placeholder="请输入"
            min={1}
            precision={0}
            size="large"
            rules={[
              {
                required: true,
                message: '采购数量不能为空',
              },
            ]}
          />
          <CstTextArea
            name="remark"
            label="备注"
            placeholder="最多输入50个字"
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ productManagerList, stockManagerSuppliers, loading }: ConnectState) => ({
  list: productManagerList.list,
  total: productManagerList.total,
  supplierList: stockManagerSuppliers?.list,
  loading: loading.effects['productManagerList/fetchList'],
}))(Comp);
