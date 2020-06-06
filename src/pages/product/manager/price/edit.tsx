import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';

import { Table, Button, Modal, message, Select, Card, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { queryList as queryMerchantList } from '@/pages/business/manager/services/info';
import { ListItemType as MerchantItemType } from '@/pages/business/manager/models/info';

import { router } from 'umi';
import { ProductTypes, DEFAULT_PAGE_NUM, TRANSTEMP } from '@/const';
import GlobalModal from '@/components/GlobalModal';
import ProductSelect from '@/components/ProductSelect';
import { ColumnProps } from 'antd/lib/table/interface';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { PriceItemType, EditeItemType, add } from '../services/price';
import { getFloat } from '@/utils';
import GlobalCard from '@/components/GlobalCard';

const { CstInput, CstSelect, CstCheckbox, CstInputNumber } = MapForm;

const { confirm } = Modal;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

const Comp: React.FC<CompProps> = ({ dispatch, loading, match }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [goodsForm, setGoodsForm] = useState<PriceItemType[]>([]);
  const [merchantList, setMerchantList] = useState<MerchantItemType[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // if (match.params.id !== '-1' && form) getGoodsInfo();
  }, [form]);

  useEffect(() => {
    getMerchantList();
  }, []);

  const ref = React.createRef();

  /**
   * @name: 获取商户列表
   */
  const getMerchantList = async () => {
    const [err, data, msg] = await queryMerchantList({});
    if (!err) setMerchantList(data.list);
  };

  /**
   * @name: 表单提交
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      console.log('handleSubmit -> value', value);
      if (!error) {
        const paramObj = {};
        const codeMap = {};
        _.map(value, (item, key) => {
          if (!key.includes('-')) paramObj[key] = item;
          else {
            const code = key.split('-')[1];
            key = key.split('-')[0];
            if (!codeMap[code]) {
              codeMap[code] = { [key]: item };
            } else {
              codeMap[code][key] = item;
            }
          }
        });
        paramObj.prices = _.map(codeMap, item => item);
        const [err, data, msg] = await add(paramObj);
        if (!err) {
          message.success('操作成功');
          router.goBack();
        } else {
          message.error(msg);
        }
      }
    });
  };

  /**
   * @name:
   * @param {type}
   */
  const handleInputChange = (value: number, key: string, code: number) => {
    const { facePrice } = goodsForm.find(item => item.goodsCode === code);
    if (key === 'rebate') {
      const price = (value * 100 * facePrice) / 1000;
      form?.setFieldsValue({
        ['price-' + code]: price / TRANSTEMP,
        ['decMoney-' + code]: (facePrice - price) / TRANSTEMP,
      });
    }
    if (key === 'price') {
      const transVal = value * TRANSTEMP;
      form?.setFieldsValue({
        ['rebate-' + code]: (transVal / facePrice) * 10,
        ['decMoney-' + code]: (facePrice - transVal) / TRANSTEMP,
      });
    }
    if (key === 'decMoney') {
      const price = facePrice - value * TRANSTEMP;
      form?.setFieldsValue({
        ['price-' + code]: price / TRANSTEMP,
        ['rebate-' + code]: price / facePrice,
      });
    }
  };

  /**
   * @name: 删除
   * @param {number} goodsCode
   */
  const showConfirm = (goodsCode: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 移除表单
        const newGoodsForm = _.filter(goodsForm, item => item.goodsCode !== goodsCode);
        setGoodsForm(newGoodsForm);
      },
      onCancel() {},
    });
  };

  const columns: ColumnProps<PriceItemType>[] = [
    {
      title: '商品名称',
      align: 'center',
      key: 'goodsCode',
      render: record => (
        <>
          <span>{record.productName}</span>
          <CstInput
            style={{ display: 'none' }}
            defaultValue={record.goodsCode}
            name={'goodsCode-' + record.goodsCode}
          />
        </>
      ),
    },
    {
      title: '商品类型',
      align: 'center',
      render: record => ProductTypes[record.productTypeCode],
    },
    {
      title: '面值/规格',
      align: 'center',
      render: record => getFloat(record.facePrice / TRANSTEMP, 4) + '/' + record.shortName,
    },
    {
      title: '折扣',
      align: 'center',
      width: 100,
      render: record => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CstInputNumber
            name={'rebate-' + record.goodsCode}
            placeholder="请输入"
            className="dynamic-inpui-2"
            size="small"
            min={0}
            precision={2}
            rules={[
              {
                required: true,
                message: '请输入',
              },
            ]}
            onChange={e => handleInputChange(e, 'rebate', record.goodsCode)}
          />
          <span>折</span>
        </div>
      ),
    },
    {
      title: '减钱(元)',
      align: 'center',
      width: 100,
      render: record => (
        <CstInputNumber
          name={'decMoney-' + record.goodsCode}
          placeholder="请输入"
          className="dynamic-inpui-2"
          size="small"
          max={record.facePrice / TRANSTEMP}
          precision={4}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          onChange={e => handleInputChange(e, 'decMoney', record.goodsCode)}
        />
      ),
    },
    {
      title: '定价(元)',
      align: 'center',
      width: 100,
      render: record => (
        <CstInputNumber
          name={'price-' + record.goodsCode}
          placeholder="请输入"
          className="dynamic-inpui-2"
          size="small"
          precision={4}
          min={0}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          onChange={e => handleInputChange(e, 'price', record.goodsCode)}
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render: record => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button type="link" onClick={() => showConfirm(record.goodsCode)}>
            移除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <GlobalCard title="基本信息" bodyStyle={{ padding: '20px 0 1px 0' }}>
          <Row>
            <Col span={12}>
              <CstSelect
                label="商户"
                // help={HELP_MSG_PRODUCT_NAME}
                placeholder="请选择"
                name="merchantId"
                rules={[
                  {
                    required: true,
                    message: '商户不能为空',
                  },
                ]}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 8 }}
              >
                {_.map(merchantList, item => (
                  <Select.Option key={item.merchantId} value={item.merchantId}>
                    {item.merchantName}
                  </Select.Option>
                ))}
              </CstSelect>
            </Col>
            <Col span={12}>
              <CstCheckbox name="isEffect" keyMap={['Y', 'N']} title="设置后立即生效"></CstCheckbox>
            </Col>
          </Row>
        </GlobalCard>
        <GlobalCard
          title="商品明细"
          titleStyle={{ marginTop: '10px' }}
          bodyStyle={{ padding: '20px 0' }}
        >
          <div style={{ padding: '0 40px 20px 40px' }}>
            <Button type="primary" onClick={() => setModalVisible(true)}>
              选择商品
            </Button>
            <Button style={{ marginLeft: '20px' }}>批量导入</Button>
          </div>
          <span style={{ padding: '0 40px', display: 'inline-block' }}>
            注：定价 = 原价(面值/规格) * 折扣 = 原价 - 让利金额(减钱)
          </span>
          <Table
            className="global-table"
            columns={columns}
            pagination={false}
            dataSource={goodsForm}
            rowKey={record => record.goodsCode.toString()}
          />
          {/* <div className="global-pagination">
            <Pagination
              current={currPage}
              onChange={(currPage: number) => setCurrPage(currPage)}
              defaultPageSize={pageSize}
              total={goodsForm.length}
              // showQuickJumper
            />
            <span className="global-pagination-data">
              共 {goodsForm.length} 条 ,每页 {pageSize} 条
            </span>
          </div> */}
          <div className={Styles.btn}>
            <Button type="primary" onClick={handleSubmit}>
              确认
            </Button>
            <Button style={{ marginLeft: '20px' }} onClick={() => router.goBack()}>
              取消
            </Button>
          </div>
        </GlobalCard>
      </MapForm>

      <GlobalModal
        modalVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          const newGoodsForm = ref.current.getSelectedGoods();
          setModalVisible(false);
          _.map(newGoodsForm, item => {
            const index = _.findIndex(goodsForm, g => g.goodsCode === item.goodsCode);
            if (index === -1) goodsForm.push(item);
          });
          setGoodsForm(goodsForm);
        }}
        title="选择商品"
        confirmLoading={confirmLoading}
        width={1000}
      >
        <ProductSelect ref={ref} />
      </GlobalModal>
    </div>
  );
};

export default Comp;
