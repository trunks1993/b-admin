import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { Button, message, Select, Card, Row, Col } from 'antd';
import { EditeItemType, getInfo, modify, add } from '../services/info';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import {
  IdentifyTypes,
  IDENTIFY_TYPE_1,
  IDENTIFY_TYPE_2,
  IdCardTypes,
  IDENTIFY_TYPE_3,
} from '@/const';
import { ConnectState, UserType } from '@/models/connect';
import { router } from 'umi';
import options from '@/cities';
import { FILE_ERROR_TYPE, FILE_ERROR_SIZE } from '@/components/GlobalUpload';
import { ruleName, patternName } from '@/rules';

const {
  CstInput,
  CstBlockCheckbox,
  CstTextArea,
  CstSelect,
  CstCascader,
  CstUpload,
  CstDatePicker,
} = MapForm;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  user: UserType;
}

interface ErrMsgType {
  idCardFront?: string;
  idCardBack?: string;
  businessName?: string;
  identityPhoto?: string;
}

const HELP_MSG_IDCARDFRONT = '人像面照片';
const HELP_MSG_IDCARDBACK = '国徽面照片';
const HELP_MSG_BUSINESSNAME =
  '若营业执照上商户名称为空或为“无”，请填写"个体户+经营者姓名"，如“个体户张三';
const HELP_MSG_IDENTITYPHOTO = '请上传"营业执照"，需年检章齐全，当年注册除外';

const handleEdite = async (fields: EditeItemType) => {
  const api = fields.merchantId ? modify : add;
  const [err, data, msg] = await api(fields);
  if (!err) {
    message.success('操作成功');
    return true;
  } else {
    message.error('操作失败');
    return false;
  }
};

const Comp: React.FC<CompProps> = ({ dispatch, user, match }) => {
  const [form, setForm] = React.useState<FormComponentProps['form'] | null>(null);

  const [msgIdCardBack, setMsgIdCardBack] = useState(HELP_MSG_IDCARDBACK);
  const [msgIdCardFront, setMsgIdCardFront] = useState(HELP_MSG_IDCARDFRONT);
  const [msgBusinessName, setMsgBusinessName] = useState(HELP_MSG_BUSINESSNAME);
  const [msgIdentityPhoto, setMsgIdentityPhoto] = useState(HELP_MSG_IDENTITYPHOTO);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [identifyType, setIdentifyType] = useState(1);

  useEffect(() => {
    if (match.params.id !== '-1' && form) initInfo();
  }, [form]);

  const initInfo = async () => {
    const [err, data, msg] = await getInfo(match.params.id);
    if (!err) {
      const {
        merchantType,
        identityPhoto,
        creditCode,
        idCardType,
        idCardBack,
        idCardFront,
        realName,
        idCard,
        contactName,
        merchantName,
        telephone,
        idCardValidity,
        remark,
        area,
        address,
      } = data;
      setIdentifyType(merchantType);
      form?.setFieldsValue({
        merchantName,
        creditCode,
        identifyType: merchantType,
        businessName: merchantName,
        idCardValidity,
        identityPhoto,
        idCardType,
        idCardBack,
        idCardFront,
        realName,
        idCard,
        contactName,
        remark,
        contactTelephone: telephone,
        area,
        address,
      });
    }
  };

  /**
   * @name: 表单提交
   * @param {string} auditResult
   */
  const handleSubmit = () => {
    form?.validateFields(async (error, value: EditeItemType) => {
      if (!error) {
        setConfirmLoading(true);
        const isSuccess = await handleEdite(value);
        setConfirmLoading(false);
        if (isSuccess) router.goBack();
      }
    });
  };

  const describeMap = {
    [IDENTIFY_TYPE_1]: '一般为个体户、个体工商户 、个体经营',
    [IDENTIFY_TYPE_2]: '一般为有限公司、有限责 任公司',
  };

  const blockCheckboxOptions = _.map(IdentifyTypes, (item, key) => ({
    title: item,
    value: key,
    subTitle: describeMap[key],
  })).filter(item => item.value != IDENTIFY_TYPE_3);

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <CstInput
          name="merchantId"
          defaultValue={match.params.id === '-1' ? '' : match.params.id}
          style={{ display: 'none' }}
        />
        <Card
          size="small"
          type="inner"
          title="选择主体类型"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstBlockCheckbox
            disabled={match.params.id !== '-1'}
            defaultValue={IDENTIFY_TYPE_1}
            options={blockCheckboxOptions}
            name="identifyType"
            onChange={e => {
              setIdentifyType(e);
            }}
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="营业执照"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {identifyType == IDENTIFY_TYPE_1 ? (
            <>
              <CstInput
                label="商户名称"
                name="businessName"
                rules={[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        setMsgBusinessName('商户名称不能为空');
                        callback(new Error('商户名称不能为空'));
                      } else if (!patternName.test(value)) {
                        setMsgBusinessName('只支持6-32位的中英文字母和数字组合');
                        callback(new Error('只支持6-32位的中英文字母和数字组合'));
                      } else if (value.length < 6 || value.length > 32) {
                        setMsgBusinessName('只支持6-32位的中英文字母和数字组合');
                        callback(new Error('只支持6-32位的中英文字母和数字组合'));
                      } else {
                        setMsgBusinessName(HELP_MSG_BUSINESSNAME);
                        callback();
                      }
                    },
                  },
                ]}
                help={msgBusinessName}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstInput
                label="注册号"
                name="creditCode"
                rules={[
                  {
                    required: true,
                    message: '注册号不能为空',
                  },
                  {
                    pattern: /^[0-9a-zA-Z]+$/,
                    message: '只支持英文字母和数字组合',
                  },
                  {
                    min: 6,
                    max: 20,
                    message: '长度为6-20',
                  },
                ]}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstUpload
                label="营业执照"
                name="identityPhoto"
                rules={[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        setMsgIdentityPhoto('请上传营业执照');
                        callback(new Error('请上传营业执照'));
                      } else if (value === FILE_ERROR_TYPE) {
                        setMsgIdentityPhoto('文件格式错误');
                        callback(new Error('文件格式错误'));
                      } else if (value === FILE_ERROR_SIZE) {
                        setMsgIdentityPhoto('文件大小不能超过2M');
                        callback(new Error('文件大小不能超过2M'));
                      } else {
                        setMsgIdentityPhoto(HELP_MSG_IDENTITYPHOTO);
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
                  domain: 'identityPhoto',
                }}
                help={msgIdentityPhoto}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstCascader
                label="注册地址"
                name="area"
                options={options}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                fieldNames={{ value: 'code' }}
              />
              <CstInput
                label=" "
                placeholder="请输入街道等详细地址"
                name="address"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
            </>
          ) : (
            <>
              <CstInput
                label="企业名称"
                placeholder="请输入商品名称"
                rules={[
                  {
                    required: true,
                    message: '请输入企业名称',
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5_0-9a-zA-Z]+$/,
                    message: '只支持6-32位的中英文字母和数字组合',
                  },
                  {
                    min: 6,
                    max: 32,
                    message: '长度为6-32',
                  },
                ]}
                name="businessName"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstInput
                label="统一社会信用代码"
                name="creditCode"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                rules={[
                  {
                    required: true,
                    message: '请输入统一社会信用代码',
                  },
                  {
                    pattern: /^[0-9a-zA-Z]+$/,
                    message: '只支持英文字母和数字组合',
                  },
                  {
                    min: 6,
                    max: 20,
                    message: '长度为6-20',
                  },
                ]}
              />
              <CstUpload
                label="营业执照"
                name="identityPhoto"
                rules={[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        setMsgIdentityPhoto('请上传营业执照');
                        callback(new Error('请上传营业执照'));
                      } else if (value === FILE_ERROR_TYPE) {
                        setMsgIdentityPhoto('文件格式错误');
                        callback(new Error('文件格式错误'));
                      } else if (value === FILE_ERROR_SIZE) {
                        setMsgIdentityPhoto('文件大小不能超过2M');
                        callback(new Error('文件大小不能超过2M'));
                      } else {
                        setMsgIdentityPhoto(HELP_MSG_IDENTITYPHOTO);
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
                  domain: 'identityPhoto',
                }}
                help={msgIdentityPhoto}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstCascader
                label="经营地址"
                name="area"
                options={options}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
                fieldNames={{ value: 'code' }}
              />
              <CstInput
                label=" "
                placeholder="请输入街道等详细地址"
                name="address"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
            </>
          )}
        </Card>

        <Card
          size="small"
          type="inner"
          title={identifyType == IDENTIFY_TYPE_1 ? '经营者证件' : '法定代表人证件'}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstSelect
            label="证件类型"
            name="idCardType"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: '请选择证件类型',
              },
            ]}
          >
            {_.map(IdCardTypes, (item, key) => (
              <Select.Option key={key} value={parseInt(key)}>
                {item}
              </Select.Option>
            ))}
          </CstSelect>
          <Row>
            <Col span={12} push={2}>
              <CstUpload
                name="idCardFront"
                help={msgIdCardFront}
                label="身份证照片"
                rules={[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        setMsgIdCardFront('请上传人像面照片');
                        callback(new Error('请上传人像面照片'));
                      } else if (value === FILE_ERROR_TYPE) {
                        setMsgIdCardFront('文件格式错误');
                        callback(new Error('文件格式错误'));
                      } else if (value === FILE_ERROR_SIZE) {
                        setMsgIdCardFront('文件大小不能超过2M');
                        callback(new Error('文件大小不能超过2M'));
                      } else {
                        setMsgIdCardFront(HELP_MSG_IDCARDFRONT);
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
                  domain: 'identityPhoto',
                }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
            </Col>
            <Col span={4} pull={5}>
              <CstUpload
                name="idCardBack"
                help={msgIdCardBack}
                rules={[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) {
                        setMsgIdCardBack('请上传国徽面照片');
                        callback(new Error('请上传国徽面照片'));
                      } else if (value === FILE_ERROR_TYPE) {
                        setMsgIdCardBack('文件格式错误');
                        callback(new Error('文件格式错误'));
                      } else if (value === FILE_ERROR_SIZE) {
                        setMsgIdCardBack('文件大小不能超过2M');
                        callback(new Error('文件大小不能超过2M'));
                      } else {
                        setMsgIdCardBack(HELP_MSG_IDCARDBACK);
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
                  domain: 'identityPhoto',
                }}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
            </Col>
          </Row>
          <CstInput
            label="身份证姓名"
            name="realName"
            rules={[
              {
                required: true,
                message: '请输入身份证姓名',
              },
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                message: '姓名格式有误',
              },
              {
                max: 6,
                min: 2,
                message: '长度为2-6',
              },
            ]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
          <CstInput
            label="身份证号码"
            name="idCard"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                required: true,
                message: '请输入身份证号码',
              },
              {
                pattern: /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/,
                message: '身份证格式有误',
              },
            ]}
          />
          <CstDatePicker
            label="证件有效期"
            name="idCardValidity"
            rules={[
              {
                required: true,
                message: '请选择证件有效期',
              },
            ]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
        </Card>

        <Card
          size="small"
          type="inner"
          title="其它信息"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstInput
            label="联系人姓名"
            name="contactName"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
                message: '姓名格式有误',
              },
              {
                max: 6,
                min: 2,
                message: '长度为2-6',
              },
            ]}
          />
          <CstInput
            label="联系人手机"
            name="contactTelephone"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
                message: '手机格式有误',
              },
            ]}
          />
          <CstTextArea
            label="备注"
            placeholder="请输入备注信息"
            name="remark"
            autoSize={{ minRows: 4, maxRows: 5 }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
            rules={[
              {
                max: 50,
                message: '长度不能超过300个字符',
              },
            ]}
          />
        </Card>
      </MapForm>
      <div className={Styles.btnBlock}></div>
      <div className={Styles.btn}>
        <Button loading={confirmLoading} type="primary" onClick={handleSubmit}>
          保存
        </Button>
        <Button
          loading={confirmLoading}
          style={{ marginLeft: '20px' }}
          onClick={() => router.goBack()}
        >
          返回
        </Button>
      </div>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  user: user.user,
}))(Comp);
