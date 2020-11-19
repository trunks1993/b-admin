import React from 'react';
import { Modal } from 'antd';

interface GlobalModalProps {
  modalVisible: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  title: string | React.ReactNode;
  confirmLoading?: boolean;
  width?: number;
  cancelText?: string | React.ReactNode;
  cancelButtonProps?: any;
  okText?: string;
  closable?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = props => {
  const { modalVisible, okText, closable, onCancel, onOk, title, confirmLoading, width, cancelText, cancelButtonProps } = props;

  return (
    <Modal
      className="global-modal"
      maskClosable={false}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      title={title}
      visible={modalVisible}
      width={width || 600}
      onCancel={() => onCancel && onCancel()}
      onOk={() => onOk && onOk()}
      okText={okText}
      okButtonProps={{ className: 'global-modal-btn-ok' }}
      cancelButtonProps={cancelButtonProps || { className: 'global-modal-btn-cancel' }}
      cancelText={cancelText}
      closable={closable}
    >
      {props.children}
    </Modal>
  );
};

export default GlobalModal;
