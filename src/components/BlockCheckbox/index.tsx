import React from 'react';
import {
  ProductTypes,
  PRODUCT_TYPE_1,
  PRODUCT_TYPE_2,
  PRODUCT_TYPE_3,
  PRODUCT_TYPE_4,
} from '@/const';
import _ from 'lodash';
import Styles from './index.css';
import classnames from 'classnames';

const describeMap = {
  [PRODUCT_TYPE_1]: '(卡号+密码)',
  [PRODUCT_TYPE_2]: '(电子兑换码)',
  [PRODUCT_TYPE_3]: '(URL访问地址)',
  [PRODUCT_TYPE_4]: '(批充+API接口)',
};

interface BlockCheckboxProps {
  onChange?: (key: string) => void;
  value?: string;
}
class BlockCheckbox extends React.Component<BlockCheckboxProps> {
  render() {
    const { value = PRODUCT_TYPE_1, onChange } = this.props;
    return (
      <div>
        <ul className={Styles.blockBox}>
          {_.map(ProductTypes, (item, key) => {
            return (
              <li
                className={classnames(Styles.block, { active: value == key })}
                key={key}
                onClick={() => {
                  onChange && onChange(key);
                }}
              >
                <span className={Styles.title}>{item}</span>
                <span className={Styles.describe}>{describeMap[key]}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default BlockCheckbox;
