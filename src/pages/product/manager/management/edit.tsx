import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { message, Select, Card, Button } from 'antd';
import { add, modify, EditeItemType, getInfo } from '../services/management';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { queryList } from '../services/brand';
import { ListItemSubType } from '../management';
import { FILE_ERROR_SIZE, FILE_ERROR_TYPE } from '@/components/GlobalUpload';
import { router } from 'umi';
import { guid, getFloat } from '@/utils';
import { TRANSTEMP } from '@/const';
import { Editor } from '@tinymce/tinymce-react';
import GlobalCard from '@/components/GlobalCard';

const { CstInput, CstTextArea, CstSelect, CstUpload, CstProductSubPanel, CstOther } = MapForm;

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
const HELP_MSG_STOCK =
  '库存为 0 时，会放到『已售罄』的商品列表里，保存后买家看到的商品可售库存同步更新';

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.productId ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error(msg);
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
  const [msgResume, setMsgResume] = useState(HELP_MSG_RESUME);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tinymceData, setTinymceData] = useState();

  useEffect(() => {
    setTinymceData('');
    if (match.params.id !== '-1' && form) getGoodsInfo();
  }, [form]);

  useEffect(() => {
    handleSearch('');
  }, []);

  const ref = React.createRef();

  const getGoodsInfo = async () => {
    const [err, data, msg] = await getInfo(parseInt(match.params.id));
    if (!err && data) {
      const { brandCode, iconUrl, introduction, name, resume, productSubList } = data;
      setTinymceData(introduction);
      form?.setFieldsValue({
        iconUrl,
        brandCode,
        introduction,
        name,
        resume,
        productSubs: _.map(productSubList, item => {
          item.uuid = guid();
          item.facePrice = getFloat(item.facePrice / TRANSTEMP, 4);
          return item;
        }),
      });
    }
  };

  /**
   * @name: 表单提交
   * @param {type}
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      console.log('handleSubmit -> value', value);
      if (error) return;
      setConfirmLoading(true);
      const isSuccess = await handleEdite(value);
      setConfirmLoading(false);
      if (isSuccess) {
        setModalVisible(false);
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
      const [err, data, msg] = await queryList({ name: value });
      if (!err) {
        callback(data.list || []);
      }
    };

    timeout = setTimeout(fake, 500);
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
          name="productId"
          defaultValue={match.params.id === '-1' ? '' : match.params.id}
          style={{ display: 'none' }}
        />
        <GlobalCard title="基本信息" bodyStyle={{ padding: '20px 0' }}>
          <CstInput
            label="产品名称"
            placeholder="请输入产品名称"
            name="name"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: '产品名称不能为空',
              },
              {
                max: 40,
                message: '最多输入40个字符',
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
              secret: 'N',
            }}
            help={helpMsg.iconUrl}
            label="产品图"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
          <CstSelect
            label="所属品牌"
            name="brandCode"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: '所属品牌不能为空',
              },
            ]}
            showSearch
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
          >
            {_.map(options, item => (
              <Select.Option key={item.id} value={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </CstSelect>
        </GlobalCard>
        <GlobalCard title="其他信息" titleStyle={{ marginTop: '10px' }} bodyStyle={{ padding: '20px 0' }}>
          <CstProductSubPanel
            label="产品规格"
            name="productSubs"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            getFormValue={(key: string) => form?.getFieldValue(key)}
          />
          {/* <CstEditor
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            label="使用须知"
            name="introduction"
            data={tinymceData}
          /> */}
          <CstTextArea
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            label="使用须知"
            name="introduction"
            autoSize={{ minRows: 4, maxRows: 5 }}
          ></CstTextArea>
        </GlobalCard>
      </MapForm>
      <div className={Styles.btnBlock}></div>
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
