import React, { useEffect, useState, useRef } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { Table, Button, Modal, message, Select, Card, Upload } from 'antd';
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
  TRANSTEMP,
} from '@/const';
import { EditeItemType, GoodsItemType, check, add } from '../services/warehousing';
import { ConnectState } from '@/models/connect';
import GlobalModal from '@/components/GlobalModal';
import ProductSelect from './components/ProductSelect';
import { ColumnProps } from 'antd/lib/table/interface';
import { ListItemType } from '@/models/product';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { getFloat } from '@/utils';

const { CstInput, CstTextArea, CstSelect, CstDatePicker, CstOther, CstInputNumber } = MapForm;

const { confirm } = Modal;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  supplierList: SuppliersItemType[];
}

const handleEdite = async (fields: EditeItemType) => {
  const [err, data, msg] = await add(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error('操作失败');
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, loading, supplierList, match }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currPage, setCurrPage] = useState(DEFAULT_PAGE_NUM);
  const [pageSize, setPageSize] = useState(5);

  const [uploadDisableList, setUploadDisableList] = useState({});
  const [countMap, setCountMap] = useState({});
  const [goodsForm, setGoodsForm] = useState<GoodsItemType[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

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
  const getSupplierList = () => {
    dispatch({
      type: 'stockManagerSuppliers/fetchList',
      queryParams: {},
    });
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
        paramObj.data = _.map(codeMap, item => item);
        try {
          const [err, data, msg] = await add(paramObj);
          if (!err) {
            message.success('商品入库成功');
            router.goBack();
          } else {
            message.error(msg);
          }
        } catch (error) {}
      }

      // if (error) return;
      // setConfirmLoading(true);
      // const isSuccess = await handleEdite(value);
      // setConfirmLoading(false);
      // if (isSuccess) {
      //   setModalVisible(false);
      // }
    });
  };

  /**
   * @name:
   * @param {type}
   */
  const handleInputChange = (value: string, key: string, code: number) => {
    // const val = parseFloat(value);
    // const count = parseInt(form?.getFieldValue('count-' + code));
    // const purchasePrice = parseFloat(form?.getFieldValue('purchasePrice-' + code)) * TRANSTEMP;
    // const taxRate = parseFloat(form?.getFieldValue('taxRate-' + code)) * 100;

    // let noTax: string | number = '--',
    //   tax: string | number = '--';

    // if (key === 'purchasePrice') {
    //   if (count && val) {
    //     const res = (val * TRANSTEMP * count) / TRANSTEMP;
    //     tax = noTax = getFloat(res, 4);
    //     if (taxRate) {
    //       tax = getFloat((res * (taxRate + TRANSTEMP)) / TRANSTEMP, 4);
    //     }
    //   }
    // } else if (key === 'count') {
    //   const data = _.clone(uploadDisableList);
    //   data[code] = !!val;
    //   setUploadDisableList(data);

    //   if (purchasePrice && val) {
    //     const res = (purchasePrice * val) / TRANSTEMP;
    //     tax = noTax = getFloat(res, 4);
    //     if (taxRate) {
    //       tax = getFloat((res * (taxRate + TRANSTEMP)) / TRANSTEMP, 4);
    //     }
    //   }
    // } else if (key === 'taxRate') {
    //   if (purchasePrice && count) {
    //     const res = (purchasePrice * count) / TRANSTEMP;
    //     tax = noTax = getFloat(res, 4);
    //     if (taxRate) {
    //       tax = getFloat((res * (val * 100 + TRANSTEMP)) / TRANSTEMP, 4);
    //     }
    //   }
    // }
    const val = parseFloat(value);

    if (key === 'count') {
      const data = _.clone(uploadDisableList);
      data[code] = !!val;
      setUploadDisableList(data);
    }

    const map = {
      purchasePrice: {
        purchasePrice: val || 0,
        taxRate: parseFloat(form?.getFieldValue('taxRate-' + code)) * 100 || 0,
        count: parseInt(form?.getFieldValue('count-' + code)) || 0,
      },
      count: {
        count: val || 0,
        purchasePrice: parseFloat(form?.getFieldValue('purchasePrice-' + code)) || 0,
        taxRate: parseFloat(form?.getFieldValue('taxRate-' + code)) * 100 || 0,
      },
      taxRate: {
        taxRate: val * 100 || 0,
        purchasePrice: parseFloat(form?.getFieldValue('purchasePrice-' + code)) || 0,
        count: parseInt(form?.getFieldValue('count-' + code)) || 0,
      },
    };

    const { purchasePrice, taxRate, count } = map[key];
    const res = purchasePrice * TRANSTEMP * count;
    const noTax = getFloat(res / TRANSTEMP, 4);
    const tax = getFloat((res * (taxRate + TRANSTEMP)) / TRANSTEMP / TRANSTEMP, 4);

    form?.setFieldsValue({
      ['noTax-' + code]: noTax,
      ['tax-' + code]: tax,
    });
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

        // 移除文件 setUploadDisableList
        //移除countMap对应数据
        const newCountMap = _.clone(countMap);
        delete newCountMap[goodsCode];
        setCountMap(newCountMap);
      },
      onCancel() {},
    });
  };

  /**
   * @name:
   * @param {type}
   */
  const handleFileChange = async (info: UploadChangeParam<UploadFile<any>>, code: number) => {
    if (info.file.status === 'done') {
      message.success('上传成功');
      const { result } = info.file.response;
      const fileUrl = result.fileList[0].url;
      form?.setFieldsValue({
        ['fileUrl-' + code]: fileUrl,
      });
      const [err, data, msg] = await check(code, fileUrl);
      if (err) {
        form?.setFields({
          ['count-' + code]: {
            value: '',
            errors: [new Error('请核对入库数量')],
          },
        });
        return message.error(msg);
      }
      const m = _.clone(countMap);
      m[code] = data.count;
      setCountMap(m);

      const count = form?.getFieldValue('count-' + code);
      if (count == data.count) message.success('商品数量校验成功');
      else {
        form?.setFields({
          ['count-' + code]: {
            value: count,
            errors: [new Error('请核对入库数量')],
          },
        });
      }
    }
  };

  const columns: ColumnProps<GoodsItemType>[] = [
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
      title: '采购价(元)',
      align: 'center',
      width: 100,
      render: record => (
        <CstInputNumber
          name={'purchasePrice-' + record.goodsCode}
          placeholder="请输入"
          className="dynamic-inpui-2"
          size="small"
          precision={4}
          min={0}
          rules={[
            {
              required: true,
              message: '请填写采购价',
            },
          ]}
          onBlur={e => handleInputChange(e.target.value, 'purchasePrice', record.goodsCode)}
        />
      ),
    },
    {
      title: '入库数量',
      align: 'center',
      width: 100,
      render: record => (
        <CstInputNumber
          name={'count-' + record.goodsCode}
          placeholder="请输入"
          className="dynamic-inpui-2"
          size="small"
          min={1}
          precision={0}
          rules={[
            {
              validator: (rule, value, callback) => {
                if (!value) return callback(new Error('请填写入库数量'));
                if (!countMap[record.goodsCode]) return callback();
                if (value != countMap[record.goodsCode]) return callback(new Error('数量校验有误'));
                callback();
              },
            },
          ]}
          onBlur={e => handleInputChange(e.target.value, 'count', record.goodsCode)}
        />
      ),
    },
    {
      title: '税率(%)',
      align: 'center',
      width: 100,
      render: record => (
        <CstInputNumber
          name={'taxRate-' + record.goodsCode}
          placeholder="请输入"
          className="dynamic-inpui-2"
          size="small"
          min={0}
          precision={2}
          // rules={[
          //   {
          //     required: true,
          //     message: '请填写税率',
          //   },
          // ]}
          onBlur={e => handleInputChange(e.target.value, 'taxRate', record.goodsCode)}
        />
      ),
    },
    {
      title: '不含税小计(元)',
      align: 'center',
      render: record => (
        <CstInput
          disabled
          className="dynamic-inpui-2"
          defaultValue="--"
          name={'noTax-' + record.goodsCode}
        />
      ),
    },
    {
      title: '含税小计(元)',
      align: 'center',
      render: record => (
        <CstInput
          disabled
          className="dynamic-inpui-2"
          defaultValue="--"
          name={'tax-' + record.goodsCode}
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render: record => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {uploadDisableList[record.goodsCode] ? (
            <CstOther
              name={'fileUrl-' + record.goodsCode}
              className="dynamic-inpui-2"
              rules={[
                {
                  required: true,
                  message: '请上传文件',
                },
              ]}
            >
              <Upload
                showUploadList={false}
                action={`${process.env.BASE_FILE_SERVER}/upload`}
                method="POST"
                data={{
                  userName: 'yunjin_file_upload',
                  password: 'yunjin_upload_password',
                  domain: 'warehousing',
                }}
                onChange={e => handleFileChange(e, record.goodsCode)}
              >
                <Button type="link">{countMap[record.goodsCode] ? '已上传' : '文件上传'}</Button>
              </Upload>
            </CstOther>
          ) : null}
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
        <Card
          size="small"
          type="inner"
          title="基本信息"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstSelect
            label="供应商"
            // help={HELP_MSG_PRODUCT_NAME}
            placeholder="请选择供应商"
            name="supplierCode"
            rules={[
              {
                required: true,
                message: '供应商不能为空',
              },
            ]}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 8 }}
          >
            {_.map(supplierList, item => (
              <Select.Option key={item.id} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </CstSelect>
          <CstDatePicker
            label="入库日期"
            name="importTime"
            rules={[
              {
                required: true,
                message: '入库日期不能为空',
              },
            ]}
            showTime={true}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 8 }}
          />
          <CstTextArea
            label="备注"
            placeholder="请输入备注信息"
            name="remark"
            autoSize={{ minRows: 4, maxRows: 6 }}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 8 }}
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="商品明细"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <div>
            <Button type="primary" onClick={() => setModalVisible(true)}>
              选择商品
            </Button>
            <Button style={{ marginLeft: '20px' }}>批量导入</Button>
          </div>
          <span style={{ marginTop: '20px', display: 'inline-block' }}>
            共 1 件商品，合计不含税小计：0.00 元， 含税小计：0.00 元
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
              确认入库
            </Button>
            <Button style={{ marginLeft: '20px' }} onClick={() => router.goBack()}>
              取消
            </Button>
          </div>
        </Card>
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
        width={800}
      >
        <ProductSelect ref={ref} />
      </GlobalModal>
    </div>
  );
};

export default connect(({ stockManagerSuppliers, loading }: ConnectState) => ({
  supplierList: stockManagerSuppliers?.list,
  loading: loading.effects['stockManagerSuppliers/fetchList'],
}))(Comp);
