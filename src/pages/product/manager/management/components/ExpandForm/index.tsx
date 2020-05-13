import React, { useState, useEffect } from 'react';
import { ListItemSubType } from '../..';
import { Table, Button, Input, Icon } from 'antd';
import _ from 'lodash';
import Styles from './index.css';
import { EditeItemSubType, modifySub, addSub } from '../../../services/management';

interface ExpandFormProps {
  dataSource?: ListItemSubType[];
  brandName?: string;
  saveRow: (data: EditeItemSubType) => void;
  addFormList?: EditeItemSubType[];
  handleAddInputChange: (value: string, index: number, key: string) => void;
  removeFormItem: (index: number, reload?: boolean) => void;
}

const ExpandForm: React.FC<ExpandFormProps> = props => {
  const {
    dataSource,
    brandName,
    saveRow,
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
      item.productSubId === id && (item[key] = value);
      return item;
    });
    setEditList(obj);
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
                  item.facePrice + '/' + item.shortName
                ) : (
                  <>
                    <input
                      style={{ width: '40px' }}
                      defaultValue={item.facePrice}
                      onChange={e => handleInputChange(e.target.value, item.id, 'facePrice')}
                    />
                    /
                    <input
                      style={{ width: '40px' }}
                      defaultValue={item.shortName}
                      onChange={e => handleInputChange(e.target.value, item.id, 'shortName')}
                    />
                  </>
                )}
              </span>
              <span className={Styles.createTime}>{item.createTime}</span>
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
                    <Button type="link">删除</Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="link"
                      onClick={async () => {
                        if (confirmLoading) return;
                        setConfirmLoading(true);
                        const [err, data, msg] = await modifySub(editList[index]);
                        setConfirmLoading(false);
                        const { productSubId, facePrice, name, shortName } = editList[index];
                        saveRow({ productSubId, facePrice, name, shortName });
                        setEditList(editList.filter(item => item.productSubId !== productSubId));
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
                  /
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
