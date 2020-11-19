import React, { useEffect } from 'react';
import Styles from './index.css';
import { Checkbox, Button, Upload, Icon, Row, Col, Modal, message } from 'antd';
import _ from 'lodash';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { removeSub } from '@/pages/product/manager/services/management';
import { guid } from '@/utils';
const { confirm } = Modal;

interface ProductSubPanelProps {
  ref: React.RefObject<HTMLDivElement>;
}

const InputItem = props => {
  const { item, imgVisible, onInputChange, onChange, value, getFormValue } = props;
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
      onChange &&
        onChange(
          _.map(value, v => {
            if (item.uuid === v.uuid) v.iconUrl = result.fileList[0].url;
            return v;
          }),
        );
    }
  };

  /**
   * @name:
   * @param {type}
   */
  const handleBlur = () => {
    onChange &&
      onChange(
        _.map(value, v => {
          if (item.uuid === v.uuid) {
            if (v.shortName && !v.name) v.name = getFormValue('name') + v.shortName;
          }
          return v;
        }),
      );
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
    </div>
  );

  return (
    <span style={{ display: 'inline-block', width: '60px', marginRight: '20px' }}>
      <input
        className={Styles.snameInput}
        value={item.shortName}
        onChange={e => onInputChange(e.target.value)}
        onBlur={handleBlur}
      />
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

const RowItem = props => {
  const { item, onChange, value, onInputChange } = props;
  /**
   * @name: 删除
   * @param {any} item
   */
  const handleRemove = (item: any) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        message.success(item)
        // const [err, data, msg] = await removeSub(item.id);
        // if (!err) onChange(value.filter(v => v.uuid !== item.uuid));
        // else message.error(msg);
      },
      onCancel() { },
    });
  };

  return (
    <Row className={Styles.th}>
      <Col className={Styles.td} span={4}>
        {item.shortName}
      </Col>
      <Col className={Styles.td} span={10}>
        <input
          className={Styles.nameInput}
          style={{ height: '26px' }}
          value={item.name}
          onChange={e => onInputChange('name', e.target.value)}
        />
      </Col>
      <Col className={Styles.td} span={6}>
        <input
          className={Styles.faceInput}
          style={{ height: '26px', width: '50px' }}
          value={item.facePrice}
          onChange={e => onInputChange('facePrice', e.target.value)}
        />
      </Col>
      <Col className={Styles.td} span={4}>
        <Button type="link" onClick={() => handleRemove(item)}>
          删除
        </Button>
      </Col>
    </Row>
  );
};

const ProductSubPanel = React.forwardRef<HTMLInputElement, ProductSubPanelProps>((props, ref) => {
  const [imgVisible, setImgVisible] = React.useState(false);

  const { onChange, value, getFormValue } = props;
  const newData = { name: '', shortName: '', iconUrl: '', facePrice: '', uuid: guid() };
  const handleAdd = () => {
    onChange(value ? [...value, newData] : [newData]);
  };

  useEffect(() => { }, [value]);

  /**
   * @name:
   * @param {type}
   */
  const handleInputChange = (uuid, key, val) => {
    onChange &&
      onChange(
        _.map(value, item => {
          if (item.uuid === uuid) item[key] = val;
          return item;
        }),
      );
  };

  return (
    <div className={Styles.container} ref={ref}>
      <div className={Styles.head}>
        <Checkbox defaultChecked={imgVisible} onChange={e => setImgVisible(!imgVisible)}>
          添加规格图片
        </Checkbox>
        <Button type="link" icon="plus" onClick={handleAdd}>
          添加规格值
        </Button>
      </div>

      {value && value.length > 0 ? (
        <>
          <div className={Styles.inputbox}>
            {_.map(value, item => (
              <InputItem
                key={item.uuid}
                item={item}
                imgVisible={imgVisible}
                value={value}
                onInputChange={handleInputChange.bind(null, item.uuid, 'shortName')}
                onChange={onChange}
                getFormValue={getFormValue}
              />
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
                <RowItem
                  key={item.uuid}
                  item={item}
                  onInputChange={handleInputChange.bind(null, item.uuid)}
                  onChange={onChange}
                  value={value}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
});

export default ProductSubPanel;
