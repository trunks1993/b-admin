import React, { useState, useEffect, useImperativeHandle } from 'react';
import { message, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { getFloat } from '@/utils';
import { setGoodsChannelList } from '../services/suppliers';
import moment from 'moment';

import MapForm from '@/components/MapFormComponent';
import _ from 'lodash';
const { CstInput, CstSelect, CstDatePicker } = MapForm;

interface CompProps extends RouteComponentProps<{ id: string }> {
  goodsItem: any,
  myForwardedRef: any
}

const Comp: React.FC<CompProps> = props => {
  const { myForwardedRef, goodsItem } = props;
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  useEffect(() => {
    if (form) showGoodsModal();
  }, [form])

  useImperativeHandle(myForwardedRef, () => ({
    getModalValue: (callBack: any) => {
      form?.validateFields(async (error, value) => {
        if (error) return
        callBack({
          goodsChannelList: [{
            ...value,
            id: goodsItem?.id,
            goodsCode: goodsItem?.goodsCode,
            supplierCode: props?.location?.query?.code,
            effectiveTime: value?.effectiveTime ? moment(value?.effectiveTime).format('YYYY-MM-DD HH:MM:SS') : ""
          }]
        })


      })
    }
  }));

  const showGoodsModal = () => {
    const { facePrice, price = facePrice, withTicket, effectiveTime, channelGoodsCode, priority, singleBuyLimit, taxPrice, remark } = goodsItem
    form?.setFieldsValue({
      facePrice: facePrice / 10000,
      price: price / 10000,
      priority,
      channelGoodsCode,
      singleBuyLimit,
      taxPrice,
      remark,
      withTicket,
      effectiveTime,
      zhekou: price / facePrice * 10
    })
  }

  /**
 * @name:
 * @param {type}
 */
  const handleInputChange = (value: number, key: string) => {
    const zhekou = form?.getFieldValue('zhekou')
    const facePrice = form?.getFieldValue('facePrice')
    if (key === 'facePrice') form?.setFieldsValue({ 'price': getFloat(value * (zhekou / 10), 2) });
    if (key === 'zhekou') form?.setFieldsValue({ 'price': getFloat(facePrice * (value / 10), 2) });
    if (key === 'price') form?.setFieldsValue({ 'zhekou': facePrice / value * 10 });
  };

  return (
    <>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <CstInput
          label="渠道商品编号"
          name="channelGoodsCode"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
        />
        <CstInput
          label="面值(元)"
          name="facePrice"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          onBlur={e => handleInputChange(e.target.value, 'facePrice')}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
        />
        <CstSelect
          label="是否带票"
          name="withTicket"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '是否带票',
            },
          ]}
        >
          <Select.Option key='1' value="1">带票</Select.Option>
          <Select.Option key='0' value="0">不带票</Select.Option>
        </CstSelect>
        <CstInput
          label="折扣"
          name="zhekou"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          onBlur={e => handleInputChange(e.target.value, 'zhekou')}
        />
        <CstInput
          label="采购价(元)"
          name="price"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
          onBlur={e => handleInputChange(e.target.value, 'price')}
        />
        <CstInput
          label="优先级别"
          name="priority"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
        />
        <CstInput
          label="单次限制"
          name="singleBuyLimit"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入',
            },
          ]}
        />
        <CstInput
          label="含税价"
          name="taxPrice"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        />
        <CstDatePicker
          label="生效时间"
          name="effectiveTime"
          showTime={true}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        />
        <CstInput
          label="备注"
          name="remark"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        />
      </MapForm>
    </>
  );
};

export default React.forwardRef((props, ref) => <Comp {...props} myForwardedRef={ref} />);
