import React from 'react';
import { Modal } from 'antd';

interface GlobalModalProps {
  modalVisible: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  title: string;
  confirmLoading: boolean;
  width?: number;
  cancelText?: string | React.ReactNode;
  cancelButtonProps?: any
}

const GlobalModal: React.FC<GlobalModalProps> = props => {
  const { modalVisible, onCancel, onOk, title, confirmLoading, width, cancelText, cancelButtonProps } = props;

  return (
    <Modal
      className="global-modal"
      maskClosable={false}
      destroyOnClose
      confirmLoading={confirmLoading}
      title={title}
      visible={modalVisible}
      width={width || 600}
      onCancel={() => onCancel && onCancel()}
      onOk={() => onOk && onOk()}
      okButtonProps={{ className: 'global-modal-btn-ok' }}
      cancelButtonProps={cancelButtonProps || { className: 'global-modal-btn-cancel' }}
      cancelText={cancelText}
    >
      {props.children}
    </Modal>
  );
};

export default GlobalModal;
