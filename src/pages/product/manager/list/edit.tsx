import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { Button, message, Select, Radio, Form } from 'antd';
import { add, modify, EditeItemType, getInfo } from '../services/list';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { queryListSub } from '../services/management';
import { ListItemSubType } from '../management';
import { FILE_ERROR_SIZE, FILE_ERROR_TYPE } from '@/components/GlobalUpload';
import { router } from 'umi';
import {
  PRODUCT_TYPE_1,
  PRODUCT_TYPE_2,
  PRODUCT_TYPE_3,
  PRODUCT_TYPE_4,
  ProductTypes,
  TRANSTEMP,
} from '@/const';
import { getFloat } from '@/utils';
import GlobalCard from '@/components/GlobalCard';
import { ConnectState } from '@/models/connect';
import GlobalEditor from '@/components/GlobalEditor';

const {
  CstInput,
  CstBlockCheckbox,
  CstEditor,
  CstTextArea,
  CstSelect,
  CstUpload,
  CstRadio,
  CstCheckbox,
  CstDatePicker,
  CstInputNumber,
} = MapForm;

interface CompProps {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  id: string;
}

const HELP_MSG_PRODUCT_NAME = '填写商品名称，方便快速检索相关产品';
const HELP_MSG_RESUME = '在商品详情页标题下面展示卖点信息，建议60字以内';
const HELP_MSG_ICONURL = '建议尺寸：800*800像素，大小不超过1M的JPEG、PNG图片';
const HELP_MSG_FACE_PRICE = '默认情况下，官方价为产品面值，在商品详情会以划线形式显示';
const HELP_MSG_STOCK =
  '库存为 0 时，会放到『已售罄』的商品列表里，保存后买家看到的商品可售库存同步更新';

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

const Comp: React.FC<CompProps> = ({ dispatch, loading, id }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [msgProductName, setMsgProductName] = useState(HELP_MSG_PRODUCT_NAME);
  const [msgResume, setMsgResume] = useState(HELP_MSG_RESUME);
  const [msgIconUrl, setMsgIconUrl] = useState(HELP_MSG_ICONURL);
  const [msgStock, setMsgStock] = useState(HELP_MSG_STOCK);

  const [options, setOptions] = useState<ListItemSubType[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
  const [productType, setProductType] = useState(PRODUCT_TYPE_1);

  useEffect(() => {
    if (id && form) getGoodsInfo();
  }, [form]);

  useEffect(() => {
    handleSearch('');
    if (_.isEmpty(id)) sessionStorage.setItem('editor', '')
  }, []);

  const getGoodsInfo = async () => {
    const [err, data, msg] = await getInfo(id);
    if (!err) {
      const {
        productSubName,
        resume,
        iconUrl,
        productSubCode,
        price,
        facePrice,
        stockType,
        stock,
        singleBuyLimit,
        undisplayStock,
        usageIllustration,
        upTime,
        upType,
        productTypeCode,
      } = data;
      setRadioValue(upType);
      setProductType(productTypeCode);
      form?.setFieldsValue({
        productTypeCode,
        productSubName,
        resume,
        iconUrl,
        productSubCode,
        price: getFloat(price / TRANSTEMP, 4),
        facePrice: getFloat(facePrice / TRANSTEMP, 4),
        stockType,
        stock,
        singleBuyLimit,
        undisplayStock,
        upTime,
        upType,
      });
      sessionStorage.setItem('editor', usageIllustration)
    }
  };

  /**
   * @name: 表单提交
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      if (error) return;
      value.usageIllustration = sessionStorage.getItem('editor')
      setConfirmLoading(true);
      const isSuccess = await handleEdite(value);
      setConfirmLoading(false);
      if (isSuccess) {
        router.goBack();
      }
    });
  };

  let timeout: any;
  const fetch = async (value: string, callback: (data: ListItemSubType[]) => void) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const fake = async () => {
      const [err, data, msg] = await queryListSub(undefined, value);
      callback(data || []);
    };

    timeout = setTimeout(fake, 200);
  };

  const handleSearch = (value: string) => {
    fetch(value, data => setOptions(data));
  };

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  const describeMap = {
    [PRODUCT_TYPE_1]: '(卡号+密码)',
    [PRODUCT_TYPE_2]: '(电子兑换码)',
    [PRODUCT_TYPE_3]: '(URL访问地址)',
    [PRODUCT_TYPE_4]: '(批充+API接口)',
  };

  const blockCheckboxOptions = _.map(ProductTypes, (item, key) => ({
    title: item,
    value: key,
    subTitle: describeMap[key],
  }));

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <CstInput name="goodsId" defaultValue={id} style={{ display: 'none' }} />
        <GlobalCard title="商品类型" bodyStyle={{ padding: '20px 0 1px 0' }}>
          <CstBlockCheckbox
            defaultValue={PRODUCT_TYPE_1}
            options={blockCheckboxOptions}
            name="productTypeCode"
            onChange={e => setProductType(e)}
          />
        </GlobalCard>
        <GlobalCard
          title="基本信息"
          titleStyle={{ marginTop: '10px' }}
          bodyStyle={{ padding: '20px 0' }}
        >
          <CstInput
            label="商品名称"
            help={msgProductName}
            placeholder="请输入商品名称"
            name="productSubName"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    setMsgProductName('商品名称不能为空');
                    callback(new Error('商品名称不能为空'));
                  } else {
                    setMsgProductName(HELP_MSG_PRODUCT_NAME);
                    callback();
                  }
                },
              },
            ]}
          />
          <CstTextArea
            label="描述"
            placeholder="请输入商品描述"
            name="resume"
            autoSize={{ minRows: 4, maxRows: 5 }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            help={msgResume}
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (value && value.length > 60) {
                    setMsgResume('不能超过60个字符');
                    callback(new Error('不能超过60个字符'));
                  } else {
                    setMsgResume(HELP_MSG_RESUME);
                    callback();
                  }
                },
              },
            ]}
          />
          <CstUpload
            name="iconUrl"
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (value === FILE_ERROR_TYPE) {
                    setMsgIconUrl('文件格式错误');
                    callback(new Error('文件格式错误'));
                  } else if (value === FILE_ERROR_SIZE) {
                    setMsgIconUrl('文件大小不能超过2M');
                    callback(new Error('文件大小不能超过2M'));
                  } else {
                    setMsgIconUrl(HELP_MSG_ICONURL);
                    callback();
                  }
                },
              },
            ]}
            action={`${process.env.BASE_FILE_SERVER}/upload`}
            method="POST"
            data={{
              userName: 'yunjin_file_upload',
              password: 'yunjin_upload_password',
              domain: 'product',
              secret: 'N',
            }}
            help={msgIconUrl}
            label="商品图"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
          <CstSelect
            label="所属产品"
            name="productSubCode"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: '所属产品不能为空',
              },
            ]}
            showSearch={true}
            showArrow={false}
            filterOption={false}
            onChange={e => {
              const fp = _.find(options, item => item.code === e)?.facePrice;
              form?.setFieldsValue({
                facePrice: getFloat(fp / TRANSTEMP, 4),
              });
            }}
            onSearch={handleSearch}
          >
            {_.map(options, item => (
              <Select.Option key={item.id} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </CstSelect>
        </GlobalCard>
        <GlobalCard
          title="价格/库存"
          titleStyle={{ marginTop: '10px' }}
          bodyStyle={{ padding: '20px 0' }}
        >
          <CstInputNumber
            label="价格"
            placeholder="请输入"
            name="price"
            min={0}
            precision={4}
            size="large"
            rules={[
              {
                required: true,
                message: '商品价格不能为空',
              },
            ]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
          />
          <CstInput
            label="官方价"
            placeholder="请输入官方价格"
            name="facePrice"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
            help={HELP_MSG_FACE_PRICE}
            disabled={true}
          />

          <CstRadio
            label="库存扣减方式"
            name="stockType"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
            defaultValue={1}
          >
            <Radio style={radioStyle} value={1}>
              拍下减库存
              <span style={{ color: '#CCCCCC' }}>
                （买家提交订单，扣减库存数量，可能存在恶意占用库存风险）
              </span>
            </Radio>
            <Radio style={radioStyle} value={2}>
              付款减库存
              <span style={{ color: '#CCCCCC' }}>
                （买家支付成功，扣减库存数量，可能存在超卖风险）
              </span>
            </Radio>
          </CstRadio>
          <span style={{ position: 'relative' }}>
            <CstInputNumber
              label="库存"
              placeholder="请输入"
              size="large"
              min={0}
              precision={0}
              name="stock"
              help={
                <>
                  <CstCheckbox
                    title="商品详情不显示剩余件数"
                    name="undisplayStock"
                    keyMap={['Y', 'N']}
                    className="minHeightFormItem"
                  />
                  <div>{msgStock}</div>
                </>
              }
              // rules={[
              //   {
              //     required: true,
              //     message: '商品库存不能为空',
              //   },
              // ]}
              rules={[
                {
                  required: true,
                  message: '商品库存不能为空',
                },
                {
                  validator: (rule, value, callback) => {
                    if (value != 0 && !value) {
                      setMsgStock('商品库存不能为空');
                      callback(new Error());
                    } else {
                      setMsgStock(HELP_MSG_STOCK);
                      callback();
                    }
                  },
                },
              ]}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 6 }}
            />
            <span style={{ position: 'absolute', left: '415px', top: '8px' }}>件</span>
          </span>
        </GlobalCard>
        <GlobalCard
          title="其他信息"
          titleStyle={{ marginTop: '10px' }}
          bodyStyle={{ padding: '20px 0' }}
        >
          <CstRadio
            label="上架时间"
            name="upType"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
            defaultValue={1}
            onChange={e => setRadioValue(e.target.value)}
          >
            <Radio style={radioStyle} value={1}>
              立即上架售卖
            </Radio>
            <Radio style={radioStyle} value={2}>
              {/* <div> */}
              <span>自定义上架时间</span>
              {radioValue === 2 ? (
                <span
                  style={{
                    position: 'absolute',
                    left: '150px',
                    top: '-5px',
                  }}
                >
                  <CstDatePicker className="minHeightFormItem" name="upTime" showTime={true} />
                </span>
              ) : null}
              {/* </div> */}
            </Radio>
            <Radio style={radioStyle} value={3}>
              暂不售卖，放入仓库
            </Radio>
          </CstRadio>
          <span style={{ position: 'relative' }}>
            <CstInputNumber
              label="限制单次采购"
              placeholder="请输入"
              size="large"
              min={0}
              precision={0}
              name="singleBuyLimit"
              rules={[
                {
                  required: true,
                  message: '限制单次采购不能为空',
                },
              ]}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 6 }}
            />
            <span style={{ position: 'absolute', left: '415px', top: '8px' }}>件</span>
          </span>

          {/* <CstTextArea
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            label="使用须知"
            name="usageIllustrations"
            autoSize={{ minRows: 4, maxRows: 5 }}
          ></CstTextArea> */}
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            label="使用须知"
          >
            <GlobalEditor />
          </Form.Item>
        </GlobalCard>
      </MapForm>
      <div className={Styles.btnBlock} />
      <div className={Styles.btn}>
        <Button loading={confirmLoading} type="primary" onClick={handleSubmit}>
          保存
        </Button>
        <Button style={{ marginLeft: '20px' }} onClick={() => router.goBack()}>
          返回
        </Button>
      </div>
    </div>
  );
};

export default connect(({ routing }: ConnectState) => ({
  id: routing.location.query.id,
}))(Comp);
