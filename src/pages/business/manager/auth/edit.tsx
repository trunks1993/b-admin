import React, { useEffect, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'dva';
import { Button, message, Select, Card, Row, Col } from 'antd';
import { EditeItemType, getInfo, verify, VerifyType } from '../services/auth';
import { FormComponentProps } from 'antd/es/form';
import _ from 'lodash';
import { RouteComponentProps } from 'dva/router';
import MapForm from '@/components/MapFormComponent';
import Styles from './edit.css';
import { IdentifyTypes, IDENTIFY_TYPE_1, IDENTIFY_TYPE_2, IdCardTypes } from '@/const';
import { ConnectState, UserType } from '@/models/connect';
import { router } from 'umi';

const { CstInput, CstBlockCheckbox, CstTextArea, CstSelect, CstUpload } = MapForm;

interface CompProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<AnyAction>;
  user: UserType;
}

interface ErrMsgType {
  stock?: string;
  idCardFront?: string;
  idCardBack?: string;
}

const HELP_MSG_IDCARDFRONT = '人像面照片';
const HELP_MSG_IDCARDBACK = '国徽面照片';

const handleEdite = async (fields: VerifyType) => {
  const [err, data, msg] = await verify(fields);
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

  const [helpMsg, setHelpMsg] = useState<ErrMsgType>({
    idCardBack: HELP_MSG_IDCARDBACK,
    idCardFront: HELP_MSG_IDCARDFRONT,
  });

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [identifyType, setIdentifyType] = useState(0);

  useEffect(() => {
    if (match.params.id !== '-1' && form) getGoodsInfo();
  }, [form]);

  // useEffect(() => {
  //   handleSearch('');
  // }, []);

  const getGoodsInfo = async () => {
    const [err, data, msg] = await getInfo(match.params.id);

    if (!err) {
      const { telephone, identifyType, remark } = data;
      setIdentifyType(identifyType);
      let formData = {};
      if (identifyType === IDENTIFY_TYPE_1) {
        const { realName, idCard, idCardBack, idCardFront, idCardType } = JSON.parse(data.data);
        formData = {
          identifyType,
          telephone,
          idCard,
          idCardType,
          idCardBack,
          idCardFront,
          remark,
          realName,
        };
      } else {
        const {
          contactName,
          contactTelephone,
          businessName,
          creditCode,
          identityPhoto,
        } = JSON.parse(data.data);
        formData = {
          identifyType,
          telephone,
          contactTelephone,
          businessName,
          creditCode,
          identityPhoto,
          remark,
          contactName,
        };
      }
      form?.setFieldsValue(formData);
    }
  };

  /**
   * @name: 表单提交
   * @param {string} auditResult
   */
  const handleSubmit = (auditResult: string) => {
    form?.validateFields(async (error, value: EditeItemType) => {
      if (error) return;
      setConfirmLoading(true);
      const isSuccess = await handleEdite({ ...value, auditResult });
      setConfirmLoading(false);
      if(isSuccess) router.goBack();
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
  }));

  return (
    <div style={{ background: '#f1f2f7', height: '100%', position: 'relative' }}>
      <MapForm className="global-form global-edit-form" onCreate={setForm}>
        <CstInput name="userId" defaultValue={user.userId} style={{ display: 'none' }} />
        <CstInput name="realname" defaultValue={user.realname} style={{ display: 'none' }} />
        <CstInput name="id" defaultValue={match.params.id} style={{ display: 'none' }} />
        <Card
          size="small"
          type="inner"
          title="认证类型"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstBlockCheckbox
            defaultValue={IDENTIFY_TYPE_1}
            options={blockCheckboxOptions}
            name="identifyType"
          />
        </Card>
        <Card
          size="small"
          type="inner"
          title="认证信息"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {identifyType === IDENTIFY_TYPE_1 ? (
            <>
              <CstInput
                label="认证手机号"
                name="telephone"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstSelect
                label="证件类型"
                name="idCardType"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              >
                {_.map(IdCardTypes, (item, key) => (
                  <Select.Option key={key} value={key}>
                    {item}
                  </Select.Option>
                ))}
              </CstSelect>
              <Row>
                <Col span={12} push={2}>
                  <CstUpload
                    name="idCardFront"
                    help={helpMsg.idCardFront}
                    label="身份证照片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  />
                </Col>
                <Col span={4} pull={5}>
                  <CstUpload
                    name="idCardBack"
                    help={helpMsg.idCardBack}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                  />
                </Col>
              </Row>
              <CstInput
                label="身份证姓名"
                placeholder="请输入商品名称"
                name="realName"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstInput
                label="身份证号码"
                placeholder="请输入商品名称"
                name="idCard"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
            </>
          ) : (
            <>
              <CstInput
                label="认证手机号"
                name="contactTelephone"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstInput
                label="企业名称"
                placeholder="请输入商品名称"
                name="businessName"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstInput
                label="统一社会信用代码"
                name="creditCode"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
              <CstUpload
                label="营业执照照片"
                name="identityPhoto"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
              />
            </>
          )}
        </Card>
        <Card
          size="small"
          type="inner"
          title="其它信息"
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <CstInput
            label="联系人姓名"
            name={identifyType === IDENTIFY_TYPE_1 ? 'realName' : 'contactName'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
          <CstInput
            label="联系人手机"
            name="telephone"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
          <CstTextArea
            label="备注"
            placeholder="请输入备注信息"
            name="remark"
            autoSize={{ minRows: 4, maxRows: 5 }}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          />
        </Card>
      </MapForm>
      <div className={Styles.btn}>
        <Button loading={confirmLoading} type="primary" onClick={() => handleSubmit('PASS')}>
          审批通过
        </Button>
        <Button loading={confirmLoading} style={{ marginLeft: '20px' }} onClick={() => handleSubmit('REJECT')}>
          审批否决
        </Button>
      </div>
    </div>
  );
};

export default connect(({ user }: ConnectState) => ({
  user: user.user,
}))(Comp);
