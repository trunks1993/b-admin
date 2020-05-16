import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import {
  Table,
  Button,
  Pagination,
  Modal,
  message,
  Checkbox,
  Select,
  Form,
  Card,
  Radio,
  Input,
  DatePicker,
} from 'antd';
import { add, modify, EditeItemType, getInfo } from '../services/list';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { queryListSub } from '../services/management';
import { ListItemSubType } from '../management';
import { FILE_ERROR_SIZE, FILE_ERROR_TYPE } from '@/components/GlobalUpload';
import GlobalCheckbox from '@/components/GlobCheckbox';
import GlobalEditor from '@/components/GlobalEditor';
import { router } from 'umi';

const {
  CstInput,
  CstBlockCheckbox,
  CstTextArea,
  CstSelect,
  CstUpload,
  CstRadio,
  CstCheckbox,
  CstDatePicker,
  CstEditor,
} = MapForm;

const { confirm } = Modal;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
}

interface ErrMsgType {
  stock?: string;
  iconUrl?: string;
}

const HELP_MSG_PRODUCT_NAME = '填写商品名称，方便快速检索相关产品';
const HELP_MSG_RESUME = '在商品详情页标题下面展示卖点信息，建议60字以内';
const HELP_MSG_ICONURL =
  '建议尺寸：800*800像素，大小不超过1M的JPEG、PNG图片，你可以拖拽图片调整顺序，最多上传15张';
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
    message.error('操作失败');
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, loading, match }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [helpMsg, setHelpMsg] = useState<ErrMsgType>({
    stock: HELP_MSG_STOCK,
    iconUrl: HELP_MSG_ICONURL,
  });
  const [options, setOptions] = useState<ListItemSubType[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
  const [check, setCheck] = useState('Y');

  useEffect(() => {
    if (match.params.id !== '-1' && form) getGoodsInfo();
  }, [form]);

  useEffect(() => {
    handleSearch('');
  }, []);

  const getGoodsInfo = async () => {
    const [err, data, msg] = await getInfo(match.params.id);
    if (!err) {
      const {
        productName,
        resume,
        iconUrl,
        productSubCode,
        price,
        facePrice,
        stockType,
        stock,
        undisplayStock,
        usageIllustration,
        upTime,
        upType,
      } = data;
      setRadioValue(upType);
      form?.setFieldsValue({
        productName,
        resume,
        iconUrl,
        productSubCode,
        price,
        facePrice,
        stockType,
        stock,
        undisplayStock,
        usageIllustration,
        upTime,
        upType,
      });
    }
  };

  /**
   * @name: 表单提交
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      if (error) return;
      setConfirmLoading(true);
      const isSuccess = await handleEdite(value);
      setConfirmLoading(false);
      if (isSuccess) {
        setModalVisible(false);
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

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <CstInput
          name="goodsId"
          defaultValue={match.params.id === '-1' ? '' : match.params.id}
          style={{ display: 'none' }}
        />
        <Card
          size="small"
          type="inner"
          title="商品类型"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstBlockCheckbox name="productTypeCode" />
        </Card>
        <Card
          size="small"
          type="inner"
          title="基本信息"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstInput
            label="商品名称"
            help={HELP_MSG_PRODUCT_NAME}
            placeholder="请输入商品名称"
            name="productName"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
          <CstTextArea
            label="描述"
            placeholder="请输入商品描述"
            name="resume"
            autoSize={{ minRows: 4, maxRows: 5 }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            help={HELP_MSG_RESUME}
          />
          <CstUpload
            name="iconUrl"
            rules={[
              {
                validator: (rule, value, callback) => {
                  if (value === FILE_ERROR_TYPE) {
                    setHelpMsg({ ...helpMsg, iconUrl: '文件格式错误' });
                    callback(new Error('文件格式错误'));
                  } else if (value === FILE_ERROR_SIZE) {
                    setHelpMsg({ ...helpMsg, iconUrl: '文件大小不能超过2M' });
                    callback(new Error('文件大小不能超过2M'));
                  } else {
                    setHelpMsg({ ...helpMsg, iconUrl: HELP_MSG_ICONURL });
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
            }}
            help={helpMsg.iconUrl}
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
            showSearch
            showArrow={false}
            filterOption={false}
            onChange={e =>
              form?.setFieldsValue({
                facePrice: _.find(options, item => item.code === e)?.facePrice,
              })
            }
            onSearch={handleSearch}
          >
            {_.map(options, item => (
              <Select.Option key={item.id} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </CstSelect>
        </Card>
        <Card
          size="small"
          type="inner"
          title="价格/库存"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstInput
            label="价格"
            placeholder="请输入商品价格"
            name="price"
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
            disabled
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
          <CstInput
            label="库存"
            placeholder="请输入库存数量"
            name="stock"
            help={
              <>
                <CstCheckbox
                  title="商品详情不显示剩余件数"
                  name="undisplayStock"
                  keyMap={['Y', 'N']}
                  className="minHeightFormItem"
                />
                <div>{helpMsg.stock}</div>
              </>
            }
            rules={[
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    setHelpMsg({ ...helpMsg, stock: '商品库存不能为空' });
                    callback(new Error('商品库存不能为空'));
                  } else {
                    setHelpMsg({ ...helpMsg, stock: HELP_MSG_STOCK });
                    callback();
                  }
                },
              },
            ]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="其他信息"
          style={{ width: '100%', marginBottom: '10px' }}
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
                  <CstDatePicker className="minHeightFormItem" name="upTime" showTime />
                </span>
              ) : null}
              {/* </div> */}
            </Radio>
            <Radio style={radioStyle} value={3}>
              暂不售卖，放入仓库
            </Radio>
          </CstRadio>
          <CstEditor
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            label="使用须知"
            name="usageIllustration"
          />
        </Card>
      </MapForm>
      <div className={Styles.btn}>
        <Button type="primary" onClick={handleSubmit}>
          保存
        </Button>
        <Button style={{ marginLeft: '20px' }} onClick={() => router.goBack()}>
          返回
        </Button>
      </div>
    </div>
  );
};

export default connect()(Comp);
