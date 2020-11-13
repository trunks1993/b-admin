import React, { useEffect, useState } from 'react';
import GlobalModal from '@/components/GlobalModal';
import { Icon, message, Steps } from 'antd';
import request from '@/utils/request';
import _ from 'lodash'

interface BigDataModalProps {
  okFunc: () => void;
  cancelFunc: () => void;
  visible: boolean;
  webPath: string;
}

const BigDataModal: React.FC<BigDataModalProps> = (props) => {
  const { visible, okFunc, cancelFunc, webPath } = props
  const [confirmLoading, setConfirmLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [prompt, setprompt] = useState('下载中')

  let timer: any;

  useEffect(() => {
    if (_.isEmpty(webPath)) return;
    timer = setInterval(() => {
      getExcelStatus();
    }, 3000)
  }, [webPath])

  useEffect(() => {
    if (current == 2 && !visible) window.open(window.location.origin + '/file/' + webPath)
  }, [current])

  const getExcelStatus = async () => {
    try {
      const [err, data, msg] = await request('/report/bigProcess', {
        method: 'POST',
        data: { path: webPath },
      });
      if (!err) {
        setprompt(data.msg)
        if (data.processStatus == "END") {
          setCurrent(2);
          clearInterval(timer);
          setConfirmLoading(false);
        }
      } else message.error(msg)
    } catch (error) { }
  }

  const modalWillUnMount = () => {
    setCurrent(1);
    setprompt('下载中');
    setConfirmLoading(true);
  }

  return (
    <div>
      <GlobalModal
        modalVisible={visible}
        title={<div style={{ textAlign: 'center' }}>生成大数据报表</div>}
        onOk={() => {
          modalWillUnMount();
          window.open(window.location.origin + '/file/' + webPath)
          okFunc();
        }}
        onCancel={() => {
          modalWillUnMount();
          cancelFunc()
        }}
        okText='下载'
        cancelText='离线下载'
        closable={false}
        confirmLoading={confirmLoading}
      >
        <div>
          <Steps current={current}>
            <Steps.Step title="准备生成" icon={<Icon type="snippets" />} />
            <Steps.Step title={prompt} icon={<Icon type="loading" />} />
            <Steps.Step title="生成成功" icon={<Icon type="smile-o" />} />
          </Steps>
        </div>
      </GlobalModal>
    </div>
  )
}
export default BigDataModal
