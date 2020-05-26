import { Form, Input, Select, DatePicker, Upload, Cascader, Radio, InputNumber } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { GetFieldDecoratorOptions } from 'antd/es/form/Form';
import ItemMap from './map';
import FormContext from './FormContext';
import moment, { Moment } from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import TreeCheck from '@/pages/sys/manager/role/components/TreeCheck';
import GlobalUpLoad from '../GlobalUpload';
import BlockCheckbox from '../BlockCheckbox';
import GlobalCheckbox from '../GlobCheckbox';
import GlobalEditor from '../GlobalEditor';
import GlobalDatePicker from '../GlobalDatePicker';
import GlobalTreeSelect from '../GlobalTreeSelect';
import ProductSubPanel from '@/pages/product/manager/management/components/ProductSubPanel';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WrappedLoginItemProps = Omit<FormItemProps, 'form' | 'type'>;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface FormItemType {
  CstInput: React.FC<WrappedLoginItemProps>;
  CstSelect: React.FC<WrappedLoginItemProps>;
}

export interface FormItemProps extends GetFieldDecoratorOptions {
  name?: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string | number | Moment;
  form?: FormComponentProps['form'];
  customProps?: { [key: string]: unknown };
  onChange?: (e: any) => void;
  label?: string;
  format?: string;
  children?: React.ReactElement | React.ReactElement[];
  help?: string | React.ReactElement;
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  className?: string;
  style?: React.CSSProperties;
}

interface FormItemState {}

const FormItem = Form.Item;

class WrapFormItem extends Component<FormItemProps, FormItemState> {
  constructor(props: FormItemProps) {
    super(props);
  }

  getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }: FormItemProps) => {
    const options: {
      rules?: FormItemProps['rules'];
      onChange?: FormItemProps['onChange'];
      initialValue?: FormItemProps['defaultValue'];
      normalize?: FormItemProps['normalize'];
    } = {
      rules: rules || (customProps.rules as FormItemProps['rules']),
    };
    if (onChange) {
      options.onChange = onChange;
    }
    if (defaultValue) {
      options.initialValue = defaultValue;
    }
    return options;
  };

  render() {
    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
    const {
      label,
      name,
      onChange,
      customProps,
      defaultValue,
      rules,
      type,
      form,
      children,
      help,
      wrapperCol,
      labelCol,
      className,
      style,
      ...restProps
    } = this.props;
    if (!name) {
      return null;
    }
    if (!form) {
      return null;
    }
    const { getFieldDecorator } = form;
    // get getFieldDecorator props
    const options = this.getFormItemOptions(this.props);
    const otherProps = restProps || {};

    const Map = {
      CstInput: getFieldDecorator(name, options)(<Input autoComplete="off" {...otherProps} />),
      CstTextArea: getFieldDecorator(name, options)(<TextArea {...otherProps} />),
      CstPassword: getFieldDecorator(
        name,
        options,
      )(<Input.Password autoComplete="off" {...otherProps} />),
      CstOther: getFieldDecorator(name, options)(<>{children}</>),
      CstTreeCheck: getFieldDecorator(name, options)(<TreeCheck {...otherProps} />),
      CstSelect: getFieldDecorator(
        name,
        options,
      )(
        <Select getPopupContainer={triggerNode => triggerNode.parentNode} {...otherProps}>
          {children}
        </Select>,
      ),
      CstUpload: getFieldDecorator(
        name,
        options,
      )(<GlobalUpLoad {...otherProps}>{children}</GlobalUpLoad>),
      CstBlockCheckbox: getFieldDecorator(name, options)(<BlockCheckbox {...otherProps} />),
      CstRadio: getFieldDecorator(
        name,
        options,
      )(<Radio.Group {...otherProps}>{children}</Radio.Group>),
      CstCheckbox: getFieldDecorator(name, options)(<GlobalCheckbox {...otherProps} />),
      CstDatePicker: getFieldDecorator(name, options)(<GlobalDatePicker {...otherProps} />),
      CstEditor: getFieldDecorator(name, options)(<GlobalEditor {...otherProps} />),
      CstTreeSelect: getFieldDecorator(name, options)(<GlobalTreeSelect {...otherProps} />),
      CstProductSubPanel: getFieldDecorator(name, options)(<ProductSubPanel {...otherProps} />),
      CstCascader: getFieldDecorator(
        name,
        options,
      )(<Cascader getPopupContainer={triggerNode => triggerNode.parentNode} {...otherProps} />),
      CstInputNumber: getFieldDecorator(name, options)(<InputNumber {...otherProps} />),
    };

    if (wrapperCol && labelCol)
      return (
        <FormItem
          className={className}
          colon={false}
          label={label}
          help={help}
          wrapperCol={wrapperCol}
          labelCol={labelCol}
          style={style}
        >
          {Map[type || '']}
        </FormItem>
      );
    else
      return (
        <FormItem className={className} colon={false} label={label} help={help} style={style}>
          {Map[type || '']}
        </FormItem>
      );
  }
}

const CstFormItem: Partial<FormItemType> = {};

Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  CstFormItem[key] = (props: FormItemProps) => (
    <FormContext.Consumer>
      {context => (
        <WrapFormItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
        />
      )}
    </FormContext.Consumer>
  );
});

export default CstFormItem as FormItemType;
