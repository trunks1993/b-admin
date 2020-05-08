import React from 'react';
import _ from 'lodash';
import { Checkbox } from 'antd';
import Styles from './index.css';

export interface TreeDataItem {
  value: number;
  label: string;
  isLeaf: 'Y' | 'N';
  level: number;
  parentCode: number;
  children: TreeDataItem[];
}

interface TreeCheckProps {
  treeData?: TreeDataItem[];
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
    const { onChange, value = [] } = this.props;
    if (value.includes(code)) onChange && onChange(value.filter(item => item !== code));
    else onChange && onChange([...value, code]);
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
