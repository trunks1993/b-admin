import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/pos';
import { TableListData } from '@/pages/data';
import copy from 'copy-to-clipboard';
import { Table, Button, Pagination, Modal, message, Typography, Select, Form, Col, Row } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import BigDataModal from '@/components/BigDataModal'
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  IdentifyTypes,
  IDENTIFY_TYPE_1,
  IdentifyStatus,
  TransactionStatus,
  TRANSTEMP,
  BizTypes,
} from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { downloadBigFinancialDetails } from '../services/details'
import moment from 'moment';
import { getFloat } from '@/utils';
import { getAjax } from '@/utils/index';

const { CstInput, CstSelect, CstRangePicker } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [webPath, setWebPath] = useState('');
  const [bigDataModalVisible, setBigDataModalVisible] = useState(false);

  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    if (!_.isEmpty(webPath)) setBigDataModalVisible(true)
  }, [webPath])

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    const beginCreateTime = !_.isEmpty(data?.time) ? moment(data?.time[0]).format('YYYY-MM-DD 00:00:00') : undefined
    const endCreateTime = !_.isEmpty(data?.time) ? moment(data?.time[1]).format('YYYY-MM-DD 23:59:59') : undefined
    dispatch({
      type: 'financeManagerDetails/fetchList',
      queryParams: {
        currPage,
        pageSize,
        beginCreateTime,
        endCreateTime,
        ...data,
      },
    });
  };

  /**
   * 
   * @name: 下载大报表
   */
  const superDownload = async () => {
    const obj = filterForm?.getFieldsValue();
    if (!obj?.time) return message.error('请选择下载的时间段!')
    try {
      const [err, data, msg] = await downloadBigFinancialDetails({
        ...obj,
        beginCreateTime: moment(obj?.time[0]).format('YYYY-MM-DD 00:00:00'),
        endCreateTime: moment(obj?.time[1]).format('YYYY-MM-DD 23:59:59')
      })
      if (!err) setWebPath(data?.webPath)
      else message.error(msg)
    } catch (error) { }
  }

  /**
   * 
   * @name: 下载报表
   */
  const download = () => {
    const data = filterForm?.getFieldsValue();
    if (!data?.time) return message.error('请选择下载的时间段!')
    getAjax({
      ...data,
      beginCreateTime: moment(data?.time[0]).format('YYYY-MM-DD 00:00:00'),
      endCreateTime: moment(data?.time[1]).format('YYYY-MM-DD 23:59:59')
    }, '/report/downloadFinancialDetails')
  }

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '业务单号',
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '入账时间',
      align: 'center',
      key: 'createTime',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '账户编号',
      align: 'center',
      dataIndex: 'accountNo',
    },
    {
      title: '业务类型',
      align: 'center',
      render: record => BizTypes[record.bizType],
    },
    {
      title: '收支类型',
      align: 'center',
      render: record => (record.type === 1 ? '收入' : '支出'),
    },
    {
      title: '变动金额(元)',
      align: 'center',
      render: record => getFloat(record.changeAmount / TRANSTEMP, 4),
    },
    {
      title: '当前余额(元)',
      align: 'center',
      render: record => getFloat(record.amount / TRANSTEMP, 4),
    },
    {
      title: '关联订单号',
      align: 'center',
      dataIndex: 'orderNo',
    },
    // {
    //   title: '备注',
    //   align: 'center',
    //   render: record => moment(record.modifyTime).format('YYYY-MM-DD HH:mm:ss'),
    // },
  ];

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>账户明细</div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
            <Row>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="code"
                  label="业务单号"
                  placeholder="请输入"
                />
              </Col>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="merchantId"
                  label="商户号"
                  placeholder="请输入"
                />
              </Col>
              <Col span={7}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="bizType"
                  label="业务类型"
                  placeholder="全部"
                >
                  {_.map(BizTypes, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item}
                    </Select.Option>
                  ))}
                </CstSelect>
              </Col>
            </Row>

            {/* <Row>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="telephone"
                  label="交易时间"
                  placeholder="请输入订单号"
                />
              </Col>
            </Row> */}
            <Row>
              <Col span={7}>
                <CstInput
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="accountNo"
                  label="账户编号"
                  placeholder="请输入"
                />
              </Col>
              <Col span={7}>
                <CstSelect
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="type"
                  label="收支类型"
                  placeholder="全部"
                >
                  <Select.Option value={1}>收入</Select.Option>
                  <Select.Option value={2}>支出</Select.Option>
                </CstSelect>
              </Col>
              <Col span={10}>
                <CstRangePicker
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="time"
                  label="订单时间"
                  placeholder="请输入订单时间"
                />
              </Col>
              <Col span={9} push={1}>
                <Form.Item>
                  <Button
                    type="primary"
                    icon="search"
                    onClick={() => (currPage === 1 ? initList() : setCurrPage(1))}
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
                  <Button
                    icon="download"
                    onClick={() => download()}
                    style={{ marginLeft: '10px' }}
                  >
                    下载
                  </Button>
                  <Button
                    icon='download'
                    onClick={() => superDownload()}
                    style={{ marginLeft: '10px' }}
                  >
                    大数据下载
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </MapForm>
        </div>
      </div>
      <Table
        className="global-table"
        loading={loading}
        columns={columns}
        pagination={false}
        dataSource={list}
        // scroll={{ x: 1300 }}
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
      <BigDataModal
        visible={bigDataModalVisible}
        okFunc={() => setBigDataModalVisible(false)}
        cancelFunc={() => setBigDataModalVisible(false)}
        webPath={webPath}
      />
    </div>
  );
};

export default connect(({ financeManagerDetails, loading }: ConnectState) => ({
  list: financeManagerDetails.list,
  total: financeManagerDetails.total,
  loading: loading.effects['financeManagerDetails/fetchList'],
}))(Comp);
