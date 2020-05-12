import React, { useState } from 'react';
import { ListItemSubType } from '../..';
import { Table, Button, Input } from 'antd';
import _ from 'lodash';
import Styles from './index.css';
import { EditeItemSubType } from '../../../services/management';

interface ExpandFormProps {
  dataSource?: ListItemSubType[];
  brandName?: string;
}

const ExpandForm: React.FC<ExpandFormProps> = props => {
  const { dataSource, brandName } = props;
  const [editList, setEditList] = useState<EditeItemSubType[]>([]);

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
                    <input style={{ width: '40px' }} defaultValue={item.facePrice} onChange={e => handleInputChange(e.target.value, item.id, 'facePrice')} />/
                    <input style={{ width: '40px' }} defaultValue={item.shortName} onChange={e => handleInputChange(e.target.value, item.id, 'shortName')} />
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
                      onClick={() => {
                        setEditList(editList.filter(v => v.productSubId !== item.id));
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      type="link"
                      onClick={() => {
                        console.log('handleInputChange -> editList', editList);
                      }}
                    >
                      保存
                    </Button>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ExpandForm;
