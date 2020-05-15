import React from 'react';
import Styles from './index.css';
import { Checkbox, Button, Upload, Icon, Row, Col } from 'antd';
import _ from 'lodash';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import Item from 'antd/lib/list/Item';

interface ProductSubPanelProps {
  ref: React.RefObject<HTMLDivElement>;
}

const InputItem = ({ item, imgVisible }) => {
  const [imageUrl, setImageUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  /**
   * @name: 核心逻辑
   * @param {type} code
   */
  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setLoading(true);
    if (info.file.status === 'done') {
      setLoading(false);
      const { result } = info.file.response;
      setImageUrl(result.fileList[0].url);
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      {/* <div className="ant-upload-text">+</div> */}
    </div>
  );

  return (
    <span style={{ display: 'inline-block', width: '60px', marginRight: '20px' }}>
      <input className={Styles.snameInput} defaultValue={item.shortName} />
      {imgVisible ? (
        <Upload
          name="avatar"
          listType="picture-card"
          className="global-uploader"
          showUploadList={false}
          method="POST"
          data={{
            userName: 'yunjin_file_upload',
            password: 'yunjin_upload_password',
            domain: 'productSub',
          }}
          action="/file/upload"
          onChange={handleChange}
        >
          {imageUrl ? (
            <img
              src={process.env.BASE_FILE_SERVER + imageUrl}
              alt="avatar"
              style={{ width: '100%' }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
      ) : null}
    </span>
  );
};

const RowItem = ({ item }) => {
  return (
    <Row className={Styles.th}>
      <Col className={Styles.td} span={4}>
        {item.shortName}
      </Col>
      <Col className={Styles.td} span={10}>
        <input className={Styles.nameInput} style={{ height: '26px' }} defaultValue={item.name} />
      </Col>
      <Col className={Styles.td} span={6}>
        <input
          className={Styles.faceInput}
          style={{ height: '26px', width: '50px' }}
          defaultValue={item.facePrice}
        />
      </Col>
      <Col className={Styles.td} span={4}>
        <Button type="link">删除</Button>
      </Col>
    </Row>
  );
};

const ProductSubPanel = React.forwardRef<HTMLInputElement, ProductSubPanelProps>((props, ref) => {
  const [imgVisible, setImgVisible] = React.useState(false);

  const { onChange, value } = props;

  return (
    <div className={Styles.container} ref={ref}>
      <div className={Styles.head}>
        <Checkbox defaultChecked={imgVisible} onChange={e => setImgVisible(!imgVisible)}>
          添加规格图片
        </Checkbox>
        <Button type="link" icon="plus">
          添加规格值
        </Button>
      </div>

      <div className={Styles.inputbox}>
        {_.map(value, item => (
          <InputItem key={item.id} item={item} imgVisible={imgVisible} />
        ))}
      </div>

      <div className={Styles.tablebox}>
        <div className={Styles.table}>
          <Row className={Styles.th}>
            <Col className={Styles.td} span={4}>
              规格
            </Col>
            <Col className={Styles.td} span={10}>
              子产品名称
            </Col>
            <Col className={Styles.td} span={6}>
              面值(元)
            </Col>
            <Col className={Styles.td} span={4}>
              操作
            </Col>
          </Row>
          {_.map(value, item => (
            <RowItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProductSubPanel;
