import React, { useEffect, useState, useReducer } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/recharge';

import { TableListData } from '@/pages/data';
import { Table, Button, Pagination, Modal, message, Checkbox, Select, Form, Row, Col } from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  RechargeStatus,
  TRANSTEMP,
  RECHARGE_STATUS_2,
} from '@/const';
// import { remove, add, modify, EditeItemType, modifyStatus } from '../services/recharge';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import TabsPanel from './components/TabsPanel';
import router from 'umi/router';
import moment from 'moment';
import GlobalModal from '@/components/GlobalModal';
import { modify } from '../services/recharge';
import { getFloat } from '@/utils';

const { confirm } = Modal;
const { CstInput, CstTextArea, CstSelect, CstPassword } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
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

const Comp: React.FC<CompProps> = ({ dispatch, list, total, loading }) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [filterForm, setFilterForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeItemType>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImg, setPreviewImg] = useState();

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    initList();
  }, [currPage]);

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
      type: 'financeManagerRecharge/fetchList',
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
   * @name: 确认
   * @param {ListItemType} record
   */
  const handleMakeSure = (record: ListItemType) => {
    confirm({
      title: '提示',
      content: '是否确认',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await modify(record.code, 2);
        if (!err) message.success('操作成功，即将刷新');
        else message.error(msg);
        dispatchInit();
      },
    });
  };

  /**
   * @name: 打开弹窗设置回显字段
   * @param {ListItemType} record
   */
  const handleModalVisible = async (record: ListItemType) => {
    // const [err, data, msg] = await getSysUserInfo(record.id);
    setPreviewImg(process.env.BASE_FILE_SERVER + record.receiptUrl);
    setModalVisible(true);
    // setFormData(data);
  };

  const columns: ColumnProps<ListItemType>[] = [
    // {
    //   title: '申请时间',
    //   align: 'center',
    //   render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    // },
    {
      title: '业务单号',
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '账户编号',
      align: 'center',
      dataIndex: 'accountNo',
    },
    {
      title: '充值金额(元)',
      align: 'center',
      // dataIndex: 'amount',
      render: record => getFloat(record.amount / TRANSTEMP, 4),
    },
    {
      title: '状态',
      align: 'center',
      render: record => RechargeStatus[record.status],
    },
    {
      title: '入款银行账户',
      align: 'center',
      dataIndex: 'rechargeChannelName',
    },
    {
      title: '完成时间',
      align: 'center',
      render: record =>
        record.completeTime && moment(record.completeTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: record => (
        <>
          {record.status !== RECHARGE_STATUS_2 ? (
            <Button type="link" onClick={() => handleMakeSure(record)}>
              确认
            </Button>
          ) : null}
          <Button type="link" onClick={() => handleModalVisible(record)}>
            查看回单
          </Button>
        </>
      ),
    },
  ];

  /**
   * @name: 状态筛选
   * @param {string} activeKey
   */
  const handleTabsPanelChange = (activeKey: string) => {
    filterForm?.setFieldsValue({ status: activeKey });
    dispatchInit();
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>账户充值</div>
      <div className={Styles.filter}>
        <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
          <CstInput name="status" style={{ display: 'none' }} />
          <Row>
            <Col span={6}>
              <CstInput
                name="accountNo"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="账户编号"
                placeholder="请输入"
              />
            </Col>
            <Col span={6}>
              <CstInput
                name="code"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                label="业务单号"
                placeholder="请输入"
              />
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
      <div style={{ padding: '0 40px' }}>
        <TabsPanel onChange={handleTabsPanelChange}>
          <Table
            className="global-table"
            loading={loading}
            columns={columns}
            pagination={false}
            dataSource={list}
            style={{ marginTop: '30px' }}
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
        </TabsPanel>
      </div>
      <GlobalModal
        modalVisible={modalVisible}
        title="回单"
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
      >
        <img width="100%" src={previewImg} />
      </GlobalModal>
    </div>
  );
};

export default connect(({ financeManagerRecharge, loading }: ConnectState) => ({
  list: financeManagerRecharge.list,
  total: financeManagerRecharge.total,
  loading: loading.effects['financeManagerRecharge/fetchList'],
}))(Comp);
