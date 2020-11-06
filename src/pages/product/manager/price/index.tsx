import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/price';
import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  ProductTypes,
  PriceStatus,
  PRICE_STATUS_1,
  PRICE_STATUS_2,
  TRANSTEMP,
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import {
  remove,
  modifyStatus,
  modify,
  EditeItemType,
  ModifyItemType,
  getInfo,
} from '../services/price';
import { ListItemType as BrandItemType } from '@/pages/product/manager/models/brand';
import { queryList as queryBrandList } from '@/pages/product/manager/services/brand';
import { router } from 'umi';
import GlobalModal from '@/components/GlobalModal';
import { getFloat } from '@/utils';

const { CstInput, CstSelect, CstOther, CstInputNumber, CstDatePicker } = MapForm;
const { confirm } = Modal;
interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const handleEdite = async (fields: ModifyItemType) => {
  const [err, data, msg] = await modify(fields);
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

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);
  const [brandList, setBrandList] = useState<BrandItemType[]>([]);
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<ListItemType>({});

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    const {
      id,
      merchantId,
      goodsCode,
      goodsName,
      shortName,
      facePrice,
      rebate,
      decMoney,
      price,
      effectiveTime,
    } = formData;
    if (modalVisible && id) {
      form?.setFieldsValue({
        id,
        merchantId,
        goodsCode,
        shortName,
        goodsName,
        facePrice: getFloat(facePrice / TRANSTEMP, 2),
        rebate,
        decMoney: decMoney / TRANSTEMP,
        price: price / TRANSTEMP,
        effectiveTime,
      });
    }
  }, [formData]);

  useEffect(() => {
    getBrand();
  }, []);

  /**
   * @name: 获取商品分组
   */
  const getBrand = async () => {
    const [err, data, msg] = await queryBrandList({});
    if (!err && data) setBrandList(data.list);
  };

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'productManagerPrice/fetchList',
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
   * @param {number[]} ids
   */
  const showConfirm = (ids: number[]) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await remove(ids);
        if (!err) message.success('删除成功，即将刷新');
        else message.error('删除失败，请重试');
        dispatchInit(() => setSelectedRowKeys([]));
      },
      onCancel() { },
    });
  };

  /**
   * @name: 批量修改表单数据状态
   * @param {type}
   */
  const handleChangeDataStatus = async (status: number) => {
    confirm({
      title: '提示',
      content: `是否${status === PRICE_STATUS_1 ? '启用' : '关闭'}`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await modifyStatus({ ids: selectedRowKeys, status });
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

  const handleModalVisible = async (record: ListItemType) => {
    const [err, data, msg] = await getInfo(record?.id);
    setModalVisible(true);
    setFormData(data);
  };

  /**
   * @name:
   * @param {type}
   */
  const handleInputChange = (value: number, key: string) => {
    const { facePrice } = formData;
    if (key === 'rebate') {
      const price = (value * 100 * facePrice) / 1000;
      form?.setFieldsValue({
        price: price / TRANSTEMP,
        decMoney: (facePrice - price) / TRANSTEMP,
      });
    } else if (key === 'price') {
      const transVal = value * TRANSTEMP;
      form?.setFieldsValue({
        rebate: (transVal / facePrice) * 10,
        decMoney: (facePrice - transVal) / TRANSTEMP,
      });
    } else if (key === 'decMoney') {
      const price = facePrice - value * TRANSTEMP;
      form?.setFieldsValue({
        price: price / TRANSTEMP,
        rebate: (price / facePrice) * 10,
      });
    }
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      key: 'id',
      width: 200,
      render: record => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img width="30" height="30" src={process.env.BASE_FILE_SERVER + record.iconUrl} />
          <span style={{ textAlign: 'left' }}>
            <div style={{ marginLeft: '5px', whiteSpace: 'nowrap' }}>{record.goodsName}</div>
            <div style={{ marginLeft: '5px' }}>{record.goodsCode}</div>
          </span>
        </div>
      ),
    },
    {
      title: '商户号',
      align: 'center',
      dataIndex: 'merchantId',
    },
    {
      title: '价格(元)',
      align: 'center',
      render: record => getFloat(record.price / TRANSTEMP, 2),
    },
    {
      title: '商品类型',
      align: 'center',
      render: record => ProductTypes[record.goodsTypeCode],
    },
    {
      title: '面值/规格',
      align: 'center',
      render: record => getFloat(record.facePrice / TRANSTEMP, 2) + '/' + record.shortName,
    },
    {
      title: '生效价格(元)',
      align: 'center',
      render: record => record?.newPrice ? getFloat(record?.newPrice / TRANSTEMP, 2) : '',
    },
    {
      title: '生效时间',
      align: 'center',
      dataIndex: 'effectiveTime',
      render: record =>
        record && moment(record).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      align: 'center',
      render: record => PriceStatus[record.status],
    },
    {
      title: '创建时间',
      align: 'center',
      render: record =>
        record.modifyTime && moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      align: 'center',
      render: record =>
        record.modifyTime && moment(record.modifyTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: record => (
        <>
          <Button type="link" onClick={() => handleModalVisible(record)}>
            编辑
          </Button>
          {record.status === PRICE_STATUS_2 && (
            <Button type="link" onClick={() => showConfirm([record.id])}>
              删除
            </Button>
          )}
        </>
      ),
    },
  ];

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

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: true,
    onChange: (selectedRowKeys: string[] | number[], selectedRows: ListItemType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
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
        <Button type="link" icon="plus" onClick={() => router.push(`/product/manager/price/edit`)}>
          新增商品定价
        </Button>
      </div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <Row>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="goods"
                  label="商品筛选"
                  placeholder="输入商品名称/编码"
                />
              </Col>
              <Col span={7}>
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
              <Col span={7}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="status"
                  label="状态"
                  placeholder="全部"
                >
                  {_.map(PriceStatus, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantId"
                  label="商户号"
                  placeholder="请输入商户号"
                />
              </Col>
              <Col span={7} push={2}>
                <Form.Item>
                  <Button
                    type="primary"
                    icon="search"
                    onClick={() => dispatchInit(() => setSelectedRowKeys([]))}
                  >
                    筛选
                  </Button>
                  <Button
                    icon="undo"
                    style={{ marginLeft: '10px' }}
                    onClick={() => filterForm?.resetFields()}
                  >
                    重置
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </MapForm>
        </div>
      </div>
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
            onClick={() => handleChangeDataStatus(PRICE_STATUS_1)}
            disabled={selectedRowKeys.length === 0}
          >
            启用
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            onClick={() => handleChangeDataStatus(PRICE_STATUS_2)}
            disabled={selectedRowKeys.length === 0}
          >
            关闭
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
            onClick={() => showConfirm(selectedRowKeys)}
          >
            删除
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
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
        scroll={{ x: 1800 }}
        rowKey={record => record.id.toString()}
      />
      <div className="global-pagination">
        <Pagination
          current={currPage}
          onChange={(currPage: number) => setCurrPage(currPage)}
          defaultPageSize={pageSize}
          total={total}
          showQuickJumper={true}
        />
        <span className="global-pagination-data">
          共 {total} 条 ,每页 {pageSize} 条
        </span>
      </div>
      <GlobalModal
        modalVisible={modalVisible}
        title="编辑"
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="id" style={{ display: 'none' }} />
          <CstInput name="facePrice" style={{ display: 'none' }} />
          <CstInput name="shortName" style={{ display: 'none' }} />
          <CstInput name="goodsCode" style={{ display: 'none' }} />
          <CstInput name="merchantId" label="商户号" disabled={true} />
          <CstInput name="goodsName" label="商品名称" disabled={true} />
          <CstOther name="shortNameAndfacePrice" label="面值/规格">
            <input
              className={Styles.input}
              value={getFloat(formData.facePrice / TRANSTEMP, 4) + '元'}
              disabled={true}
            />
            <span style={{ margin: '0 5px' }}>/</span>
            <input className={Styles.input} value={formData.shortName} disabled={true} />
          </CstOther>
          <CstInputNumber
            name="rebate"
            label="折扣"
            size="large"
            min={0}
            precision={2}
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
            onChange={e => handleInputChange(e, 'rebate')}
          />
          <CstInputNumber
            name="decMoney"
            label="减钱"
            size="large"
            precision={4}
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
            onChange={e => handleInputChange(e, 'decMoney')}
          />
          <CstInputNumber
            name="price"
            size="large"
            label="定价"
            precision={4}
            min={0}
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
            onChange={e => handleInputChange(e, 'price')}
          />
          <CstDatePicker
            label="生效时间"
            name="effectiveTime"
            showTime={true}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ productManagerPrice, loading }: ConnectState) => ({
  list: productManagerPrice.list || [],
  total: productManagerPrice.total,
  loading: loading.effects['productManagerPrice/fetchList'],
}))(Comp);
