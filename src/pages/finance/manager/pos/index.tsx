import React, { useEffect, useState } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { ListItemType } from '../models/pos';
import { TableListData } from '@/pages/data';
import {
  Table,
  Button,
  Pagination,
  Modal,
  message,
  Checkbox,
  Select,
  Form,
  Col,
  Row,
  Radio,
} from 'antd';
import { ColumnProps } from 'antd/lib/table/interface';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM, TRANSTEMP } from '@/const';
// import { getInfo, remove } from '../services/transaction';
import Styles from './index.css';
import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import { getFloat } from '@/utils';
import GlobalModal from '@/components/GlobalModal';
import { EditeItemType, modify } from '../services/pos';
import md5 from 'js-md5';

const { CstInput, CstSelect, CstRadio, CstInputNumber, CstPassword, CstTextArea } = MapForm;

interface CompProps extends TableListData<ListItemType> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const handleEdite = async (fields: EditeItemType) => {
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

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [formData, setFormData] = useState<EditeItemType>({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSelectedRowKeys([]);
    initList();
  }, [currPage]);

  useEffect(() => {
    const { merchantId, merchantName, accountNo, amount } = formData;
    if (modalVisible && merchantId) {
      form?.setFieldsValue({
        merchantId,
        merchantName: `${merchantName}(${merchantId}) `,
        accountNo,
        amount_copy: getFloat(amount / TRANSTEMP, 4),
      });
    }
  }, [form]);

  /**
   * @name: 列表加载
   */
  const initList = () => {
    const data = filterForm?.getFieldsValue();
    dispatch({
      type: 'financeManagerPos/fetchList',
      queryParams: {
        currPage,
        pageSize,
        ...data,
      },
    });
  };

  const columns: ColumnProps<ListItemType>[] = [
    {
      title: '账户编号',
      align: 'center',
      dataIndex: 'accountNo',
    },
    {
      title: '商户名称/商户号',
      align: 'center',
      // dataIndex: 'customerOrderNo',
      render: record => record.merchantName + '/' + record.merchantId,
    },
    {
      title: '状态',
      align: 'center',
      render: record => (record.status === 1 ? '有效' : '无效'),
    },
    {
      title: '账户余额(元)',
      align: 'center',
      render: record => getFloat(record.amount / TRANSTEMP, 4),
    },
    {
      title: '余额报警阈值(元)',
      align: 'center',
      render: record => getFloat(record.doorsillAmount / TRANSTEMP, 4),
    },
    {
      title: '创建时间',
      align: 'center',
      render: record => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      align: 'center',
      render: record => moment(record.modifyTime).format('YYYY-MM-DD HH:mm:ss'),
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

  /**
   * @name:
   * @param {type}
   */
  const handleModalVisible = () => {
    setModalVisible(true);
    setFormData(_.find(list, item => item.id == selectedRowKeys[0]));
  };

  /**
   * @name:
   * @param {void}
   */
  const handleSubmit = () => {
    form?.validateFields(async (err, value) => {
      value.password = md5(value.password);
      if (!err) {
        const success = await handleEdite(value);
        if (success) {
          setModalVisible(false);
        }
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 15,
      push: 1,
    },
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>商户账单</div>
      <div className={Styles.filter}>
        <div className={Styles.filterBox}>
          <MapForm className="filter-form" layout="horizontal" onCreate={setFilterForm}>
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
                  name="status"
                  label="账户状态"
                  placeholder="全部"
                >
                  <Select.Option value={1}>有效</Select.Option>
                  <Select.Option value={2}>无效</Select.Option>
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
                  name="merchantName"
                  label="商户名称"
                  placeholder="请输入"
                />
              </Col>
              <Col span={7} push={2}>
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
            disabled={selectedRowKeys.length !== 1}
            onClick={handleModalVisible}
          >
            调账
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            冻结
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            解冻
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            注销账户
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            loading={confirmLoading}
            disabled={selectedRowKeys.length === 0}
          >
            设置余额阈值
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
        scroll={{ x: 1300 }}
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

      <GlobalModal
        modalVisible={modalVisible}
        title="调账"
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
      >
        <MapForm className="global-form" layColWrapper={formItemLayout} onCreate={setForm}>
          <CstInput name="merchantId" style={{ display: 'none' }} />
          <CstInput disabled={true} name="merchantName" label="商户名称" />
          <CstInput disabled={true} name="accountNo" label="账户编号" />
          <CstInput disabled={true} name="amount_copy" label="账户余额(元)" />
          <CstRadio
            label="调账类型"
            name="bizType"
            defaultValue={5}
            rules={[
              {
                required: true,
                message: '请选择',
              },
            ]}
          >
            <Radio value={5}>减款</Radio>
            <Radio value={4}>加款</Radio>
          </CstRadio>
          <CstInputNumber
            label="调账金额(元)"
            name="amount"
            size="large"
            min={0}
            precision={4}
            placeholder="请输入调账金额"
            rules={[
              {
                required: true,
                message: '请输入调账金额',
              },
            ]}
          />
          <CstPassword
            label="操作员密码"
            name="password"
            placeholder="请输入登录密码"
            rules={[
              {
                required: true,
                message: '请输入登录密码',
              },
            ]}
          />
          <CstTextArea
            label="备注"
            name="remark"
            placeholder="请输入备注信息"
            autoSize={{ minRows: 4, maxRows: 6 }}
            rules={[
              {
                required: true,
                message: '请输入备注信息',
              },
              {
                max: 50,
                message: '长度不能超过50个字符',
              },
            ]}
          />
        </MapForm>
      </GlobalModal>
    </div>
  );
};

export default connect(({ financeManagerPos, loading }: ConnectState) => ({
  list: financeManagerPos.list,
  total: financeManagerPos.total,
  loading: loading.effects['financeManagerPos/fetchList'],
}))(Comp);
