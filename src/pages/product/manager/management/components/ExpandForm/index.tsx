import React, { useState, useEffect } from 'react';
import { ListItemSubType } from '../..';
import { Table, Button, Input, Icon, Modal, message } from 'antd';
import _ from 'lodash';
import Styles from './index.css';
import { EditeItemSubType, modifySub, addSub, removeSub } from '../../../services/management';
import moment from 'moment';
import { TRANSTEMP } from '@/const';
import { getFloat } from '@/utils';
const { confirm } = Modal;

interface ExpandFormProps {
  dataSource?: ListItemSubType[];
  brandName?: string;
  reload: () => void;
  addFormList?: EditeItemSubType[];
  handleAddInputChange: (value: string, index: number, key: string) => void;
  removeFormItem: (index: number, reload?: boolean) => void;
}

const ExpandForm: React.FC<ExpandFormProps> = props => {
  const {
    dataSource,
    brandName,
    reload,
    addFormList,
    handleAddInputChange,
    removeFormItem,
  } = props;
  const [editList, setEditList] = useState<EditeItemSubType[]>([]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * @name:
   * @param {type}
   */
  const handleInputChange = (value: string, id: number, key: string) => {
    const obj = _.map(editList, item => {
      if (key === 'facePrice' && item.productSubId === id)
        item[key] = getFloat(value / TRANSTEMP, 4);
      else item.productSubId === id && (item[key] = value);
      return item;
    });
    setEditList(obj);
  };

  /**
   * @name: 删除
   * @param {number} productSubId
   */
  const handleDelete = async (id: number) => {
    confirm({
      title: '提示',
      content: '是否删除',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [err, data, msg] = await removeSub(id);
        if (!err) {
          message.success('删除成功，即将刷新');
          reload();
        } else message.error('删除失败，请重试');
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <ul>
        {_.map(dataSource, item => {
          const index = _.findIndex(editList, v => v.productSubId === item.id);
          return (
            <li key={item.id} className={Styles.item}>
              <span className={Styles.name}>
                {index === -1 ? (
                  item.name
                ) : (
                  <input
                    defaultValue={item.name}
                    onChange={e => handleInputChange(e.target.value, item.id, 'name')}
                  />
                )}
              </span>
              <span className={Styles.brandName}>{brandName}</span>
              <span className={Styles.value}>
                {index === -1 ? (
                  getFloat(item.facePrice / TRANSTEMP, 4) + ' / ' + item.shortName
                ) : (
                  <>
                    <input
                      style={{ width: '40px' }}
                      defaultValue={getFloat(item.facePrice / TRANSTEMP, 4)}
                      onChange={e => handleInputChange(e.target.value, item.id, 'facePrice')}
                    />
                    <span style={{ margin: '0 5px' }}>/</span>
                    <input
                      style={{ width: '40px' }}
                      defaultValue={item.shortName}
                      onChange={e => handleInputChange(e.target.value, item.id, 'shortName')}
                    />
                  </>
                )}
              </span>
              <span className={Styles.createTime}>
                {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
              <span className={Styles.btn}>
                {index === -1 ? (
                  <>
                    <Button
                      type="link"
                      onClick={() => {
                        const data = {
                          name: item.name,
                          facePrice: item.facePrice,
                          shortName: item.shortName,
                          productSubId: item.id,
                        };
                        setEditList([...editList, data]);
                      }}
                    >
                      编辑
                    </Button>
                    <Button type="link" onClick={() => handleDelete(item.id)}>
                      删除
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="link"
                      onClick={async () => {
                        const params = editList[index];
                        if (confirmLoading) return;
                        setConfirmLoading(true);
                        const [err, data, msg] = await modifySub(params);
                        setConfirmLoading(false);
                        setEditList(
                          editList.filter(item => item.productSubId !== params.productSubId),
                        );
                        reload();
                      }}
                    >
                      {confirmLoading ? <Icon type="loading" /> : '保存'}
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditList(editList.filter(v => v.productSubId !== item.id));
                      }}
                    >
                      取消
                    </Button>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      {addFormList && addFormList.length ? (
        <ul className={Styles.addbox}>
          {_.map(addFormList, (item, index) => {
            return (
              <li key={item.uuid} className={Styles.item}>
                <span className={Styles.name}>
                  <input
                    defaultValue={item.name}
                    onChange={e => handleAddInputChange(e.target.value, index, 'name')}
                  />
                </span>
                <span className={Styles.brandName}>{brandName}</span>
                <span className={Styles.value}>
                  <input
                    style={{ width: '40px' }}
                    defaultValue={item.facePrice}
                    onChange={e => handleAddInputChange(e.target.value, index, 'facePrice')}
                  />
                  <span style={{ margin: '0 5px' }}>/</span>
                  <input
                    style={{ width: '40px' }}
                    defaultValue={item.shortName}
                    onChange={e => handleAddInputChange(e.target.value, index, 'shortName')}
                  />
                </span>
                <span className={Styles.createTime}></span>
                <span className={Styles.btn}>
                  <Button
                    type="link"
                    onClick={async () => {
                      if (confirmLoading) return;
                      setConfirmLoading(true);
                      const [err, data, msg] = await addSub(item);
                      setConfirmLoading(false);
                      removeFormItem(index, true);
                      reload();
                    }}
                  >
                    {confirmLoading ? <Icon type="loading" /> : '保存'}
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      removeFormItem(index);
                    }}
                  >
                    取消
                  </Button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default ExpandForm;
