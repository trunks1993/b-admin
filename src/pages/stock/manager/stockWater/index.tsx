import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Select, Form, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, WaterStatus } from '@/const';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';

import { ListItemType as SuppliersItemType } from '../models/suppliers';

import moment from 'moment';
import { ListItemType } from '../models/stockWater';
import { RouteComponentProps } from 'dva/router';

const { CstInput, CstSelect } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  supplierList: SuppliersItemType[];
  location: Location;
}

const Comp: React.FC<CompProps> = props => {
  const { dispatch, list, supplierList, total, loading } = props;
  const goods = props.location.query.goods;

  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);

  useEffect(() => {
    initList();
  }, [currPage]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    let data = filterForm?.getFieldsValue();
    goods && (data = { ...data, goods });
    dispatch({
      type: 'stockManagerStockWater/fetchList',
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

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '库存流水号',
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '商品名称',
      align: 'center',
      dataIndex: 'goodsName',
    },
    {
      title: '单据类型',
      align: 'center',
      render: record => WaterStatus[record.type],
    },
    {
      title: '出入库（件）',
      align: 'center',
      dataIndex: 'amount',
    },
    {
      title: '剩余量',
      align: 'center',
      dataIndex: 'surplus',
    },
    {
      title: '制单人',
      align: 'center',
      dataIndex: 'operName',
    },
    {
      title: '制单时间',
      align: 'center',
      render: record =>
        record.createTime && moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '关联单据编号',
      align: 'center',
      dataIndex: 'orderNo',
    },
  ];

  return (
    <div className={Styles.container}>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
          <Row>
            <Col span={8}>
              <CstInput
                name="goods"
                defaultValue={goods}
                disabled={!!goods}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="商品筛选"
                placeholder="输入商品名称/编码"
              />
            </Col>

            <Col span={8}>
              <CstSelect
                name="type"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="单据类型"
                placeholder="全部"
              >
                {_.map(WaterStatus, (item, key) => (
                  <Select.Option key={key} value={key}>
                    {item}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={8}>
              <CstInput
                name="code"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="库存流水号"
                placeholder="请输入"
              />
            </Col>
            <Col span={8}>
              <CstInput
                name="orderNo"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="关联单据编号"
                placeholder="请输入"
              />
            </Col>
            <Col span={8} push={1}>
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

export default connect(({ stockManagerStockWater, loading }: ConnectState) => ({
  list: stockManagerStockWater.list,
  total: stockManagerStockWater.total,
  loading: loading.effects['stockManagerStockWater/fetchList'],
}))(Comp);
