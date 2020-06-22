import React from 'react';
import _ from 'lodash';
import { Upload, Icon } from 'antd';
// import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';
import Styles from './index.css';
import GlobalModal from '../GlobalModal';

export const FILE_ERROR_TYPE = '0';
export const FILE_ERROR_SIZE = '1';

interface UploadParams {
  userName: string;
  password: string;
  domain: string;
  secret: 'Y' | 'N';
}

interface GlobalUpLoadProps {
  onChange?: (value: string) => void;
  value?: string;
  action?: string;
  method?: 'POST' | 'PUT';
  data?: UploadParams;
  disabled: boolean;
}
interface GlobalUpLoadStates {
  loading: boolean;
  modalVisible: boolean;
}
class GlobalUpLoad extends React.Component<GlobalUpLoadProps, GlobalUpLoadStates> {
  state = {
    loading: false,
    modalVisible: false,
  };

  /**
   * @name: 核心逻辑
   * @param {type} code
   */
  handleChangeChecked = (info: UploadChangeParam<UploadFile<any>>) => {
    this.setState({ loading: true });
    const { onChange } = this.props;
    if (info.file.status === 'done') {
      this.setState({ loading: false });
      const { result } = info.file.response;
      onChange && onChange(result.fileList[0].url);
    }
  };

  beforeUpload = (file: File) => {
    const { onChange } = this.props;
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      onChange && onChange(FILE_ERROR_TYPE);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      onChange && onChange(FILE_ERROR_SIZE);
    }
    return isJpgOrPng && isLt2M;
  };

  handleDelete = (e: Event) => {
    const { onChange } = this.props;
    e.stopPropagation();
    onChange && onChange('');
  };

  render() {
    const { value, action, method, data, disabled } = this.props;
    const { loading, modalVisible } = this.state;
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <>
        {!disabled ? (
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={action}
            method={method}
            data={data}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChangeChecked}
          >
            {value ? (
              <div className={Styles.imgbox}>
                <img
                  src={process.env.BASE_FILE_SERVER + value}
                  alt="avatar"
                  style={{ width: '100%' }}
                />
                <div className={Styles.delete}>
                  <Icon type="delete" onClick={this.handleDelete} />
                </div>
              </div>
            ) : (
              uploadButton
            )}
          </Upload>
        ) : (
          <img
            width="60px"
            height="60px"
            src={process.env.BASE_FILE_SERVER + value}
            onClick={() => this.setState({ modalVisible: true })}
          />
        )}

        <GlobalModal
          modalVisible={modalVisible}
          title="图片预览"
          onCancel={() => this.setState({ modalVisible: false })}
          onOk={() => this.setState({ modalVisible: false })}
        >
          <img width="100%" src={process.env.BASE_FILE_SERVER + value} />
        </GlobalModal>
      </>
    );
  }
}

export default GlobalUpLoad;
