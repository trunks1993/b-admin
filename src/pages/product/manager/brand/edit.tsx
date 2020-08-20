import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';

import { Button, message } from 'antd';
import { add, modify, EditeItemType, getInfo } from '../services/brand';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { queryListSub } from '../services/management';
import { ListItemSubType } from '../management';
import { FILE_ERROR_SIZE, FILE_ERROR_TYPE } from '@/components/GlobalUpload';
import { router } from 'umi';
import { getCategoryTree } from '../services/group';
import { loopTree, TreeDataItem2 } from '@/utils';
import { ConnectState } from '@/models/connect';

const { CstInput, CstUpload, CstTreeSelect, CstTextArea } = MapForm;

interface CompProps {
  dispatch: Dispatch<AnyAction>;
  loading: boolean;
  id: string;
}

interface ErrMsgType {
  stock?: string;
  iconUrl?: string;
}

const HELP_MSG_RESUME = '用一句话描述该品牌，建议60字以内';
const HELP_MSG_ICONURL = '建议尺寸：800*800像素，大小不超过1M的JPEG、PNG图片';
const HELP_MSG_STOCK =
  '库存为 0 时，会放到『已售罄』的商品列表里，保存后买家看到的商品可售库存同步更新';

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.brandId ? modify : add;
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
  const [ConfirmLoading, setConfirmLoading] = useState(false);
  const [helpMsg, setHelpMsg] = useState<ErrMsgType>({
    stock: HELP_MSG_STOCK,
    iconUrl: HELP_MSG_ICONURL,
  });
  const [treeData, setTreeData] = useState<TreeDataItem2[]>();
  const [msgResume, setMsgResume] = useState(HELP_MSG_RESUME);

  useEffect(() => {
    if (id && form) getBrandInfo();
  }, [form]);

  useEffect(() => {
    getTree();
  }, []);

  const getTree = async () => {
    const [err, data, msg] = await getCategoryTree(1);
    if (!err) {
      const tree = loopTree(data.children, item => {
        item.value = item.id;
        item.title = item.label;
        item.key = item.id;
      });
      setTreeData(tree);
    } else {
      message.error(msg);
    }
  };

  /**
   * @name:
   * @param {type}
   */
  const getBrandInfo = async () => {
    const [err, data, msg] = await getInfo(id);
    if (!err) {
      const { categoryCodes, resume, iconUrl, name } = data;
      form?.setFieldsValue({
        categoryCodes,
        resume,
        iconUrl,
        name,
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

    timeout = setTimeout(fake, 500);
  };

  return (
    // <div style={{ height: '100%', position: 'relative', paddingTop: '30px' }}>
    <div className={Styles.container}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <CstInput name="brandId" defaultValue={id} style={{ display: 'none' }} />
        <CstInput
          label="品牌名"
          name="name"
          placeholder="请输入品牌名称"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          rules={[
            {
              required: true,
              message: '请输入品牌名称',
            },
            {
              max: 20,
              message: '最多输入20个字符',
            },
          ]}
        />
        <CstTextArea
          label="描述"
          placeholder="请输入品牌描述"
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
          label="品牌logo"
          name="iconUrl"
          rules={[
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  setHelpMsg({ ...helpMsg, iconUrl: '图片不能为空' });
                  callback(new Error('图片不能为空'));
                } else if (value === FILE_ERROR_TYPE) {
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
            domain: 'brand',
            secret: 'N',
          }}
          help={helpMsg.iconUrl}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        />
        <CstTreeSelect
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          label="关联分组"
          name="categoryCodes"
          treeData={treeData}
          placeholder="选择所属分组"
        />
        <CstTextArea
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 15 }}
          placeholder="请输入使用须知"
          label="使用须知"
          name="introduction"
          autoSize={{ minRows: 4, maxRows: 5 }}
        />
      </MapForm>
      <div className={Styles.btnBlock} />
      <div className={Styles.btn}>
        <Button loading={ConfirmLoading} type="primary" onClick={handleSubmit}>
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
