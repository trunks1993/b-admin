import { Form } from 'antd';
import React, { Component } from 'react';
import { FormComponentProps } from 'antd/es/form';
import FormContext, { FormContextProps } from './FormContext';
import FormItem, { FormItemProps, FormItemType } from './FormItem';
import { LoginParamsType } from '@/services/login';

export interface MapFormProps {
  defaultActiveKey?: string;
  onTabChange?: (key: string) => void;
  style?: React.CSSProperties;
  onSubmit?: (error: unknown, values: LoginParamsType) => void;
  layout?: any;
  className?: string;
  form: FormComponentProps['form'];
  onCreate: (form: FormComponentProps['form']) => void;
  children: React.ReactElement[] | React.ReactElement;
}

interface MapFormState {
  tabs?: string[];
  type?: string;
  active?: { [key: string]: unknown[] };
}
// 动态表单组件 支持接口获取、可视化拖拽等任何形式拓展
class MapForm extends Component<MapFormProps, MapFormState> {
  public static CstInput: React.FunctionComponent<FormItemProps>;
  public static CstPassword: React.FunctionComponent<FormItemProps>;
  public static CstOther: React.FunctionComponent<FormItemProps>;
  public static CstTextArea: React.FunctionComponent<FormItemProps>;
  public static CstTreeCheck: React.FunctionComponent<FormItemProps>;

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props: MapFormProps) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
    };
  }

  componentDidMount() {
    const { form, onCreate } = this.props;
    if (onCreate) {
      onCreate(form);
    }
  }

  onSwitch = (type: string) => {
    this.setState(
      {
        type,
      },
      () => {
        const { onTabChange } = this.props;
        if (onTabChange) {
          onTabChange(type);
        }
      },
    );
  };

  getContext: () => FormContextProps = () => {
    const { form } = this.props;
    return {
      form: { ...form },
    };
  };

  render() {
    const { children, className, layout } = this.props;
    return (
      <FormContext.Provider value={this.getContext()}>
        <div>
          <Form {...layout} className={className}>{children}</Form>
        </div>
      </FormContext.Provider>
    );
  }
}

(Object.keys(FormItem) as (keyof FormItemType)[]).forEach(item => {
  MapForm[item] = FormItem[item];
});

export default Form.create<MapFormProps>()(MapForm);
