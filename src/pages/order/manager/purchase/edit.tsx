import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { getInfo } from '../services/purchase';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';
import Styles from './edit.css';
import { Card, Row, Col, Table, Steps, message } from 'antd';
import { ListItemType, OrderItemType } from '../models/purchase';
import moment from 'moment';
import { PayMethods, TRANSTEMP } from '@/const';
import { ColumnProps } from 'antd/lib/table/interface';
import success from '@/assets/images/order/success.png';
import stepSuccess from '@/assets/images/order/step-success.png';
import { getFloat } from '@/utils';
const { Step } = Steps;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

// interface DataType {
//   order: ListItemType;
//   orderItemList: OrderItemType[];
//   sumInfo: {
//     cardCount: number;
//     checkedCount: number;
//     hasZhiChong: 'N' | 'Y';
//     totalMoney: number;
//   };
// }
const statusText = ['', '待付款', '待发货', '已完成', '已取消'];
const Comp: React.FC<CompProps> = ({ dispatch, loading, match }) => {
  const [data, setData] = useState<ListItemType>();

  useEffect(() => {
    getOrderInfo();
  }, []);

  const getOrderInfo = async () => {
    const [err, data, msg] = await getInfo(match.params.id);
    if (!err) {
      setData(data);
    } else {
      message.error(msg);
    }
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '商品',
      dataIndex: 'productSubName',
      align: 'center',
    },
    {
      title: '单价（元）',
      align: 'center',
      render: record => getFloat(record.price / TRANSTEMP, 4),
    },
    {
      title: '数量',
      align: 'center',
      dataIndex: 'detailCount',
    },
    // {
    //   title: '优惠(元)',
    //   dataIndex: 'soldNum',
    //   align: 'center',
    // },
    {
      title: '小计(元)',
      align: 'center',
      render: record => getFloat((record.detailCount * record.price) / TRANSTEMP, 4),
    },
    {
      title: '退款状态',
      align: 'center',
      // dataIndex: 'status',
      render: record => '',
    },
    // {
    //   title: '发货状态',
    //   dataIndex: 'soldNum',
    //   align: 'center',
    // },
  ];

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <Card
        size="small"
        type="inner"
        title={
          <>
            <span>采购单号：{match.params.id}</span>
            <span style={{ marginLeft: '20px' }}>
              下单时间: {moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </>
        }
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <div className={Styles.resBox}>
          <div className={Styles.res}>
            <img src={success} width="60px" height="60px" />
            <div style={{ margin: '5px 0' }}>{statusText[data?.status]}</div>
            <div className={Styles.info}>
              如果买家提出售后要求，请积极 与买家协商，发起售后订单。
            </div>
          </div>
          <div className={Styles.step}>
            <Steps labelPlacement="vertical" current={data?.status}>
              <Step
                title="买家下单"
                description={
                  data?.createTime ? moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
              />
              <Step
                title="买家付款"
                description={
                  data?.payTime ? moment(data?.payTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
              />
              <Step
                title="平台发货"
                description={
                  data?.deliverTime ? moment(data?.deliverTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
              />
              <Step
                title="交易完成"
                description={
                  data?.completeTime ? moment(data?.completeTime).format('YYYY-MM-DD HH:mm:ss') : ''
                }
              />
            </Steps>
          </div>
        </div>
      </Card>
      <Card
        size="small"
        type="inner"
        title="买家信息"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <Row style={{ paddingLeft: '30px' }}>
          <Col span={24} style={{ paddingBottom: '20px' }}>
            手机号：{data?.telephone}
          </Col>
          <Col span={24} style={{ paddingBottom: '20px' }}>
            商户名称：{data?.merchantName}
          </Col>
          <Col span={24}>商户号：{data?.merchantId}</Col>
        </Row>
      </Card>
      <Card
        size="small"
        type="inner"
        title="付款信息"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <Row style={{ paddingLeft: '30px' }}>
          <Col span={24} style={{ paddingBottom: '20px' }}>
            支付方式：{PayMethods[data?.payMethod || 1]}
          </Col>
          <Col span={24}>支付流水号：{data?.payCode}</Col>
        </Row>
      </Card>
      <Card
        size="small"
        type="inner"
        title="发货信息"
        style={{ width: '100%', marginBottom: '10px' }}
      >
        <Row style={{ paddingLeft: '30px' }}>
          <Col span={24} style={{ paddingBottom: '20px' }}>
            配送方式：{data?.deliverMethod}
          </Col>
          <Col span={24}>配货员：{data?.deliverUserName}</Col>
        </Row>
      </Card>
      <div style={{ background: '#ffffff' }}>
        <Table
          className="global-table"
          columns={columns}
          pagination={false}
          dataSource={data?.orderItemList}
          rowKey={record => record.id.toString()}
        />
        <ul className={Styles.ul}>
          <li className={Styles.liItem}>
            <div>商品总价</div>
            <div>￥{getFloat(data?.totalPay / TRANSTEMP, 4)}</div>
          </li>
          <li className={Styles.liItem}>
            <div>优惠</div>
            <div>￥{getFloat(data?.totalDerateFee / TRANSTEMP, 4) || '--'}</div>
          </li>
          <li className={Styles.liItem}>
            实收金额：
            <span style={{ color: '#d40000' }}>
              ￥{getFloat(data?.realTotalPay / TRANSTEMP, 4)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default connect()(Comp);
