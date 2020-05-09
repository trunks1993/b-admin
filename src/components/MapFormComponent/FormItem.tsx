import { Form, Input, Select, DatePicker, Upload, Cascader } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import { GetFieldDecoratorOptions } from 'antd/es/form/Form';
import ItemMap from './map';
import FormContext from './FormContext';
import { Moment } from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import TreeCheck from '@/pages/sys/manager/role/components/TreeCheck';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WrappedLoginItemProps = Omit<FormItemProps, 'form' | 'type'>;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface FormItemType {
  CstInput: React.FC<WrappedLoginItemProps>;
  CstSelect: React.FC<WrappedLoginItemProps>;
}

export interface FormItemProps extends GetFieldDecoratorOptions {
  name?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  type?: string;
  defaultValue?: string | number | Moment;
  form?: FormComponentProps['form'];
  customProps?: { [key: string]: unknown };
  onChange?: (e: any) => void;
  label?: string;
  format?: string;
  children?: React.ReactElement | React.ReactElement[];
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
      CstInput: getFieldDecorator(
        name,
        options,
      )(<Input autoComplete="off" {...customProps} {...otherProps} />),
      CstTextArea: getFieldDecorator(
        name,
        options,
      )(<TextArea {...customProps} {...otherProps}/>),
      CstPassword: getFieldDecorator(
        name,
        options,
      )(<Input.Password autoComplete="off" {...customProps} {...otherProps} />),
      CstOther: getFieldDecorator(name, options)(<>{children}</>),
      CstTreeCheck: getFieldDecorator(name, options)(<TreeCheck {...customProps} {...otherProps} />),
      CstSelect: getFieldDecorator(name, options)(<Select {...customProps} {...otherProps}>{children}</Select>),
    };

    return <FormItem colon={false} label={label}>{Map[type || 'CstInput']}</FormItem>;
    // return Map[type || 'CstInput'];
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
