import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'antd';
import Styles from './index.css';
import { getSonsTree, TreeDataItem, getFather } from '@/utils';

// export interface TreeDataItem {
//   value: number;
//   label: string;
//   isLeaf: 'Y' | 'N';
//   level: number;
//   parentCode: number;
//   children: TreeDataItem[];
// }

interface TreeCheckProps {
  treeData: TreeDataItem[];
  onChange?: (value: number[]) => void;
  value?: number[];
}

interface ItemProps {
  item: TreeDataItem;
  onChange?: (code: number) => void;
  value: number[];
}

const FatherItem: React.FC<ItemProps> = props => {
  const { item, onChange, value } = props;
  return (
    <div className="fatherItem" key={item.value}>
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          checked={value.includes(item.value)}
          onChange={() => onChange && onChange(item.value)}
        >
          {item.label}
        </Checkbox>
      </div>
      {props.children}
    </div>
  );
};

const ChildItem: React.FC<ItemProps> = props => {
  const { item, onChange, value } = props;
  return (
    <div className={Styles.childItem}>
      <span className={Styles.childItemLeft}>
        <Checkbox
          checked={value.includes(item.value)}
          onChange={() => onChange && onChange(item.value)}
        >
          {item.label}
        </Checkbox>
      </span>
      <span className="childItemRight">{props.children}</span>
    </div>
  );
};

const LeafItem: React.FC<ItemProps> = props => {
  const { item, onChange, value } = props;
  return (
    <Checkbox
      checked={value.includes(item.value)}
      onChange={() => onChange && onChange(item.value)}
    >
      {item.label}
    </Checkbox>
  );
};

class TreeCheck extends React.Component<TreeCheckProps> {
  /**
   * @name: 核心逻辑
   * @param {type} code
   */
  handleChangeChecked = (code: number) => {
    const { treeData, oldTreeData, onChange, value = [] } = this.props;
    // 获取所有子节点
    const sons = getSonsTree(oldTreeData, code);

    // 获取点击的父亲节点
    const father = getFather(oldTreeData, code);

    let newVal = [...value];

    // 先判断是选中还是取消
    const isCancel = newVal.includes(code);
    if (!isCancel) {
      const ffather = getFather(oldTreeData, father);
      newVal = _.uniq([...newVal, father, ffather, code]);

      // 如果是叶节点
      if (sons.length > 0) {
        newVal = [...newVal, ...sons];
      }
    } else {
      _.remove(newVal, item => item === code);

      if (sons.length > 0) {
        newVal = _.filter(newVal, item => !sons.includes(item));
      }
      // debugger;
      const currentSons = getSonsTree(oldTreeData, father);
      if (newVal.every(item => !currentSons.includes(item))) {
        _.remove(newVal, item => item === father);

        const ffather = getFather(oldTreeData, father);
        const ssons = getSonsTree(oldTreeData, code);
        if(newVal.every(item => !ssons.includes(item))) {
          _.remove(newVal, item => item === ffather);
        }
      }
    }

    onChange && onChange(newVal.filter(item => item));
  };

  render() {
    const { treeData, value = [] } = this.props;
    return (
      <div>
        {_.map(treeData, item => (
          <FatherItem
            onChange={this.handleChangeChecked}
            value={value}
            key={item.value}
            item={item}
          >
            {_.map(item.children, item => (
              <ChildItem
                onChange={this.handleChangeChecked}
                value={value}
                key={item.value}
                item={item}
              >
                {_.map(item.children, item => (
                  <LeafItem
                    onChange={this.handleChangeChecked}
                    value={value}
                    key={item.value}
                    item={item}
                  />
                ))}
              </ChildItem>
            ))}
          </FatherItem>
        ))}
      </div>
    );
  }
}

export default TreeCheck;
