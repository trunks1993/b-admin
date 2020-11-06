import React, { useEffect, useState, useReducer } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
// import { ListItemType } from '../models/list';
import { ListItemType as CategoryItemType } from '../models/group';

import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Row, Col, Radio } from 'antd';
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
import { remove, add, modify, EditeItemType, modifyStatus, getGoodsRule, getSupplierList, updateGoodsChannelRule, getGoodsChannelMappersByCode } from '../services/list';
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
import GlobalModal from '@/components/GlobalModal';
import { retry } from '@/pages/order/manager/services/transaction';

const { confirm } = Modal;
const { CstInput, CstSelect, CstRadio } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  categoryList: CategoryItemType[];
}

interface GoodsItem {
  name?: string; // 供应商名字
  supplierCode?: string; // 供应商code
  rule?: string | number; // 选中状态
}

const Comp: React.FC<CompProps> = ({ dispatch, list, categoryList, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalForm, setModalForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeItemType>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<any>({});

  const [goodsVisible, setGoodsVisible] = useState(false);
  const [goodsDetail, setGoodsDetail] = useState<GoodsItem>();//选中的路由规则
  const [goodsList, setGoodsList] = useState({});// 供应商列表
  const [goodsInfo, setGoodsInfo] = useState<string | number>('');//点击路由选中的item

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    getCategoryList();
  }, []);


  useEffect(() => {
    if (goodsVisible) getRouterStatus()
  }, [goodsVisible])

  useEffect(() => {
    if (modalForm) modalForm?.setFieldsValue({ name: goodsInfo?.productSub?.name + '|' + goodsInfo?.code })
  }, [modalForm])

  useEffect(() => {
    if (_.isEmpty(goodsDetail)) return;
    //更新路由规则
    if (goodsDetail?.rule) modalForm?.setFieldsValue({ rule: goodsDetail?.rule })
    else modalForm?.setFieldsValue({ rule: 2 })

    //当路由规则为指定供应商时获取供应商列表
    if (goodsDetail?.rule === 2) getRuleList()

    //选中供应商的code
    if (goodsDetail?.supplierCode && modalForm) modalForm?.setFieldsValue({ supplierCode: goodsDetail?.supplierCode })

  }, [goodsDetail])

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

  const getDetailList = async (goodsCode: number) => {
    try {
      const [err, data, msg] = await getGoodsChannelMappersByCode({ goodsCode })
      if (!err) { setDetailItem(data); setDetailVisible(true); }
      else message.error(msg)
    } catch (error) { }
  }

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
      onCancel() { },
    });
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      width: 210,
      key: 'id',
      fixed: 'left',
      render: record => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
          <span style={{ textAlign: 'left' }}>
            <div style={{ marginLeft: '5px' }}>{record?.productSub?.name}</div>
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
            onClick={() => { getDetailList(record?.code) }}
          >
            渠道详情
          </Button>
          |
          <Button
            type="link"
            onClick={() => { setGoodsVisible(true); setGoodsInfo(record) }}
          >
            路由
          </Button>
          |
          <Button
            type="link"
            onClick={() => router.push(`/product/manager/list/edit?id=${record.id}`)}
          >
            编辑
          </Button>
          |
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
      onCancel() { },
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
      onCancel() { },
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

  /**
   * @name: 获取供应商路由状态
   * @param {string} goodsCode
   */
  const getRouterStatus = async () => {
    try {
      const [err, data, msg] = await getGoodsRule(goodsInfo?.code)
      if (!err) {
        if (!_.isEmpty(data)) setGoodsDetail(data)
        else setGoodsDetail({ rule: 2 })
      }
      else message.error(msg)
    } catch (error) { }
  }

  /**
   * @name: 获取供应商列表
   */
  const getRuleList = async () => {
    try {
      if (!_.isEmpty(goodsList)) return;
      const [err, data, msg] = await getSupplierList()
      if (!err) setGoodsList(data)
      else message.error(msg)
    } catch (error) { }
  }

  /**
   * @name: 商品路由提交
   */
  const handleRule = () => {
    try {
      modalForm?.validateFields(async (err, values) => {
        if (!err) {
          const { rule, supplierCode } = values;
          const obj = { id: goodsDetail?.id, goodsCode: goodsInfo?.code, rule, supplierCode }
          const [err, data, msg] = await updateGoodsChannelRule(obj)
          if (!err) message.success('设置成功')
          else message.error(msg)
          setGoodsVisible(false)
        }
      });
    } catch (error) { }
  }

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const detailColumns: any = [
    {
      title: '供应商名称',
      align: 'center',
      key: 'supplierName',
      dataIndex: 'supplierName',
    },
    {
      title: '面值(元)',
      align: 'center',
      width: 100,
      render: record => record?.facePrice / 10000,
    },
    {
      title: '折扣',
      align: 'center',
      width: 100,
      render: record => {
        if (record?.price) return (record.price / record?.facePrice * 10)
        return 10
      },
    },
    {
      title: '采购价(元)',
      align: 'center',
      width: 100,
      render: record => {
        if (record?.price) return (record.price / record?.facePrice * 10)
        return (record?.facePrice / 10000)
      },
    },
    {
      title: '优先级别',
      align: 'center',
      dataIndex: 'priority',
    },
    {
      title: '单次限制',
      align: 'center',
      dataIndex: 'singleBuyLimit',
    },
    {
      title: '含税价',
      align: 'center',
      dataIndex: 'taxPrice',
    },
    {
      title: '是否带票',
      align: 'center',
      render: record => {
        if (!!record?.withTicket) return '是'
        return '否'
      }
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
  ];
  console.log(detailItem)
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
                onClick={() => { }}
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
      <GlobalModal
        title='商品路由'
        modalVisible={goodsVisible}
        onCancel={() => {
          setGoodsVisible(false)
        }}
        onOk={() => {
          handleRule();
        }}
      >
        <MapForm className="filter-form" layout="horizontal" onCreate={setModalForm}>
          <CstInput
            name="name"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
            label="商品名称"
            disabled={true}
          />
          <CstRadio
            label="路由规则"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
            name="rule"
            onChange={(e) => { setGoodsDetail({ ...goodsDetail, rule: e.target.value }) }}
          >
            <Radio value={2} className={Styles.radioStyle}>指定供应商</Radio>
            {
              goodsDetail?.rule == 2 ? (
                <CstSelect
                  label="供应商"
                  name="supplierCode"
                  placeholder='请选择供应商'
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  style={{ width: 300 }}
                  rules={[
                    {
                      required: true,
                      message: '供应商不能为空',
                    },
                  ]}
                >
                  {_.map(goodsList, item => (
                    <Select.Option key={item?.code} value={item?.code}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </CstSelect>
              ) : ''
            }
            <Radio value={3} className={Styles.radioStyle}>价格优先</Radio>
          </CstRadio>
        </MapForm>
      </GlobalModal>
      <GlobalModal
        modalVisible={detailVisible}
        title='渠道详情'
        onCancel={() => {
          setDetailVisible(false)
        }}
        onOk={() => {
          setDetailVisible(false)
        }}
      >
        <Table
          className="global-table"
          columns={detailColumns}
          dataSource={detailItem}
          scroll={{ x: 1100 }}
          pagination={false}
        />
      </GlobalModal>
    </div>
  );
};

export default connect(({ productManagerList, productManagerGroup, loading }: ConnectState) => ({
  list: productManagerList.list,
  categoryList: productManagerGroup.list,
  total: productManagerList.total,
  loading: loading.effects['productManagerList/fetchList'],
}))(Comp);
