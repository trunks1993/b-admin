import React, { useEffect, useState, useRef } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { Table, Button, Modal, message, Select, Card, Upload, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { ListItemType as SuppliersItemType } from '../models/suppliers';

import { router } from 'umi';
import {
  PRODUCT_TYPE_1,
  PRODUCT_TYPE_2,
  PRODUCT_TYPE_3,
  PRODUCT_TYPE_4,
  ProductTypes,
  DEFAULT_PAGE_NUM,
  WorkTypes,
} from '@/const';
import { EditeItemType, GoodsItemType, check, getInfo } from '../services/warehousing';
import { add } from '../services/suppliers';
import { ConnectState } from '@/models/connect';
import GlobalModal from '@/components/GlobalModal';
import ProductSelect from './components/ProductSelect';
import { ColumnProps } from 'antd/lib/table/interface';
import { ListItemType } from '@/models/product';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';

const { CstInput, CstTextArea, CstSelect, CstDatePicker, CstOther } = MapForm;

const { confirm } = Modal;

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
      dataIndex: 'purchasePrice',
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
      render: record => record.purchasePrice * record.buyNumber,
    },
    {
      title: '含税小计(元)',
      align: 'center',
      render: record =>
        record.purchasePrice * record.buyNumber * Number(1).add(record.taxRate / 100),
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
          <Col span={8}>入库类型：{WorkTypes[baseInfo.bizType]}</Col>

          <Col span={8}>供应商：{baseInfo.supplierName}</Col>
          <Col span={8}>
            入库日期：
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
        <span>共 1 件商品，合计不含税小计：0.00 元， 含税小计：0.00 元</span>
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
