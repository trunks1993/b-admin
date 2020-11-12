import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'dva/router';
import { ColumnProps } from 'antd/lib/table/interface';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import _ from 'lodash';
import { SuppliersItemType, getGoodsChannelList, setGoodsChannelList, deleteGoodsChannelList } from '../services/suppliers';
import moment from 'moment';

import GlobalCard from '@/components/GlobalCard';
import { Table, Button, Pagination, Select, Col, Row, Icon, Modal, message, Switch } from 'antd';

import MapForm from '@/components/MapFormComponent';
import { FormComponentProps } from 'antd/es/form';
const { CstInput, CstSelect, CstDatePicker } = MapForm;
import GlobalModal from '@/components/GlobalModal';
import ProductSelect from '@/components/ProductSelect';
import EditForm from './editForm';
import Styles from './edit.css';

import { SupplierStatus, DEFAULT_PAGE_NUM, TRANSTEMP, ProductTypes } from '@/const'
import { getFloat } from '@/utils';


interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
}
const ref = React.createRef();
const modalForm = React.createRef();


const Comp: React.FC<CompProps> = (props) => {
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(6);

  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [goodsVisible, setGoodsVisible] = useState(false);

  const [goodsForm, setGoodsForm] = useState<any>([]);
  const [goodsItem, setGoodsItem] = useState<SuppliersItemType[]>([]);

  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    const { code, name, status } = props?.location?.query;
    form?.setFieldsValue({ supplierCode: code, name, status: SupplierStatus[status] })
  }, [form])

  useEffect(() => {
    if (form) getList();
  }, [currPage, form])

  const getList = async () => {
    try {
      setTableLoading(true);
      const obj = form?.getFieldsValue();
      const [err, data, msg] = await getGoodsChannelList({
        pageSize,
        currPage,
        ...obj,
      })
      if (!err) { setGoodsForm(data); }
      else message.error(msg)
      setTableLoading(false);
    } catch (error) { }
  }

  /**
   * @name: 删除
   * @param {} goodsCode
   */
  const showConfirm = (list: {}) => {
    Modal.confirm({
      title: '提示',
      content: '是否更改商品状态',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        console.log(list)
        const obj = { id: list?.id, status: list?.status != 1 ? '1' : "2" }
        const [err, data, msg] = await deleteGoodsChannelList(obj);
        if (!err) { message.success('操作成功'); getList() }
        else message.error(msg)
      },
      onCancel() { },
    });
  };

  const columns: ColumnProps<SuppliersItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      fixed: 'left',
      width: 160,
      render: record => record.name + record.goodsCode
    },
    {
      title: '商品类型',
      align: 'center',
      key: 'productTypeCode',
      dataIndex: 'productTypeCode',
      render: record => ProductTypes[record]
    },
    {
      title: '渠道商品编号',
      align: 'center',
      dataIndex: 'channelGoodsCode',
      render: record => <div className={Styles.channelGoodsCode}>{record}</div>
    },
    {
      title: '面值(元)',
      align: 'center',
      width: 100,
      dataIndex: 'facePrice',
      render: record => record / 10000,
    },
    {
      title: '折扣',
      align: 'center',
      width: 100,
      render: record => {
        if (record?.price) return getFloat(record.price / record?.facePrice * 10, 2)
        return ''
      },
    },
    {
      title: '采购价(元)',
      align: 'center',
      width: 100,
      render: record => {
        if (record?.price) return record.price / 10000
        return ''
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
      render: record => record ? getFloat(record / TRANSTEMP, 2) : '',
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
      title: '生效价格',
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
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: record => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button type="link" onClick={() => { setGoodsItem(record); setGoodsVisible(true) }}>
            编辑
          </Button>
          {
            record?.status == 1 ? (
              <Switch checked={true} checkedChildren="开" onClick={() => showConfirm(record)} />
            ) : (
                <Switch checked={false} unCheckedChildren="关" onClick={() => showConfirm(record)} />
              )
          }
        </div >
      ),
    },
  ];

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <GlobalCard title="供应商信息" bodyStyle={{ padding: '20px' }}>
          <CstInput
            disabled={true}
            label="供应商编号"
            name="supplierCode"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 8 }}
          />
          <CstInput
            disabled={true}
            label="供应商名称"
            name="name"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 8 }}
          />
          <CstInput
            disabled={true}
            label="状态"
            name="status"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 8 }}
          />
        </GlobalCard>
        <GlobalCard title="关联商品列表" bodyStyle={{ padding: '20px' }}>
          <Row>
            <Col span={3}>
              <Button type='primary' onClick={() => setModalVisible(true)}>
                选择商品
              </Button>
            </Col>
            <Col span={10}>
              <CstSelect name='withTicket' placeholder='是否带票' style={{ width: 120 }} onBlur={() => getList()}>
                <Select.Option key='2' value="">全部</Select.Option>
                <Select.Option key='1' value="1">带票</Select.Option>
                <Select.Option key='0' value="0">不带票</Select.Option>
              </CstSelect>
            </Col>
            <Col span={10}>
              <CstInput
                name="goods"
                style={{ width: 240, float: 'right' }}
                placeholder="请输入商品名称/商品编码"
                suffix={<Icon type="search" onClick={() => getList()} />}
                onBlur={() => getList()}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 30 }}>
            <Table
              className="global-table"
              columns={columns}
              pagination={false}
              dataSource={goodsForm?.list}
              scroll={{ x: 1500 }}
              loading={tableLoading}
            />
            {
              goodsForm?.list?.length ?
                (
                  <div className="global-pagination">
                    <Pagination
                      current={currPage}
                      onChange={(currPage: number) => setCurrPage(currPage)}
                      defaultPageSize={pageSize}
                      total={goodsForm?.totalRecords}
                    />
                    <span className="global-pagination-data">
                      共 {goodsForm?.totalRecords} 条 ,每页 {pageSize} 条
                  </span>
                  </div>
                ) : ''
            }
          </div>
          <div>注：采购价 = 面值 * 折扣      相同商品不同供应商价格相等优先级别数</div>
        </GlobalCard>
        <GlobalModal
          modalVisible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => {
            const newGoodsForm = ref.current.getSelectedGoods();
            let index;
            _.map(newGoodsForm, item => {
              index = _.findIndex(goodsForm?.list, g => g.goodsCode === item.goodsCode);
              if (index === 1) message.error('不能重复配置商品')
              else setGoodsItem(item);
            });
            if (index !== 1) { setGoodsVisible(true); setModalVisible(false); }
          }}
          title="选择商品"
          width={1000}
        >
          <ProductSelect ref={ref} />
        </GlobalModal>
        <GlobalModal
          modalVisible={goodsVisible}
          title="配置商品"
          onCancel={() => { setGoodsVisible(false); setGoodsItem([]) }}
          onOk={() => {
            modalForm.current?.getModalValue(async (value: any) => {
              const [err, data, msg] = await setGoodsChannelList(value)
              if (!err) {
                message.success('提交成功');
                setGoodsVisible(false)
                getList();
                setGoodsItem([])
              } else message.error(msg)
            });
          }}
        >
          <EditForm ref={modalForm} goodsItem={goodsItem} supplierCode={props?.location?.query?.code} />
        </GlobalModal>
      </MapForm>
    </div >
  )
}
export default connect(() => { })(Comp)
