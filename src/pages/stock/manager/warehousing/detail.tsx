import React, { useEffect, useState } from 'react';

import { Table, Card, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';

import { DEFAULT_PAGE_NUM, WorkTypes, TRANSTEMP } from '@/const';
import { GoodsItemType, getInfo } from '../services/warehousing';
// import { add } from '../services/suppliers';
import { ColumnProps } from 'antd/lib/table/interface';
import moment from 'moment';
import { getFloat } from '@/utils';

const add = (arr: GoodsItemType[]) => {
  const o = { hasTax: 0, noTax: 0 };
  if (arr && arr.length > 0) {
    _.map(arr, item => {
      o.hasTax = getFloat((o.hasTax + item.purchasePrice * item.buyNumber) / TRANSTEMP, 4);
      o.noTax = getFloat(
        (o.noTax + item.purchasePrice * item.buyNumber * Number(1).add(item.taxRate / 100)) /
          TRANSTEMP,
        4,
      );
    });
  }
  return o;
};

interface CompProps extends RouteComponentProps<{ id: string }> {}

const Comp: React.FC<CompProps> = ({ match }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(5);

  const [uploadDisableList, setUploadDisableList] = useState({});
  const [countMap, setCountMap] = useState({});
  const [baseInfo, setBaseInfo] = useState({});
  const [goodsList, setGoodsList] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (match.params.id !== '-1' && form) getGoodsInfo();
  }, [form]);

  useEffect(() => {
    getSupplierList();
  }, []);

  const ref = React.createRef();

  /**
   * @name: 获取供应商
   */
  const getSupplierList = async () => {
    setLoading(true);
    const [status, code] = match.params.id.split('-');
    const [err, data, msg] = await getInfo(code, status);
    setLoading(false);
    if (!err) {
      setBaseInfo(data.baseInfo);
      setGoodsList(data.goodsList);
    }
  };

  const columns: ColumnProps<GoodsItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      dataIndex: 'productName',
    },
    {
      title: '采购价(元)',
      align: 'center',
      // dataIndex: 'purchasePrice',
      render: record => getFloat(record.purchasePrice / TRANSTEMP, 4),
    },
    {
      title: '入库数量',
      align: 'center',
      dataIndex: 'buyNumber',
    },
    {
      title: '税率(%)',
      align: 'center',
      dataIndex: 'taxRate',
    },
    {
      title: '不含税小计(元)',
      align: 'center',
      render: record => getFloat((record.purchasePrice * record.buyNumber) / TRANSTEMP, 4),
    },
    {
      title: '含税小计(元)',
      align: 'center',
      render: record =>
        getFloat(
          (record.purchasePrice * record.buyNumber * Number(1).add(record.taxRate / 100)) /
            TRANSTEMP,
          4,
        ),
    },
  ];

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <Card
        size="small"
        type="inner"
        title="基本信息"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <Row>
          <Col span={8}>单据编号：{baseInfo.code}</Col>
          <Col span={8}>采购订单号：{baseInfo.orderId}</Col>
          <Col span={8}>业务类型：{WorkTypes[baseInfo.bizType]}</Col>

          <Col span={8}>供应商：{baseInfo.supplierName}</Col>
          <Col span={8}>
            采购时间：
            {baseInfo.completeTime && moment(baseInfo.completeTime).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
          {/* <Col span={8}>制单人：{baseInfo.orderId}</Col> */}

          <Col span={8}>备注：--</Col>
          <Col span={8}>对账状态：{baseInfo.未对账}</Col>
          <Col span={8}>
            制单时间：
            {baseInfo.createTime && moment(baseInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
        </Row>
      </Card>
      <Card
        size="small"
        type="inner"
        title="商品明细"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <span>
          共 1 件商品，合计不含税小计：
          {add(goodsList)?.hasTax}
          元， 含税小计：
          {add(goodsList)?.noTax}元
        </span>
        <Table
          className="global-table"
          columns={columns}
          pagination={false}
          loading={loading}
          dataSource={goodsList}
          rowKey={record => record.id.toString()}
        />
      </Card>
    </div>
  );
};

export default Comp;
