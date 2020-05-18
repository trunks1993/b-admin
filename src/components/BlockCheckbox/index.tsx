import React from 'react';
import _ from 'lodash';
import Styles from './index.css';
import classnames from 'classnames';

interface OptionItemType {
  title: string;
  value: string | number;
  subTitle: string;
}

interface BlockCheckboxProps {
  onChange?: (key: string | number) => void;
  value?: string | number;
  options: OptionItemType[];
}

class BlockCheckbox extends React.Component<BlockCheckboxProps> {
  render() {
    const { value, onChange, options } = this.props;
    return (
      <div>
        <ul className={Styles.blockBox}>
          {_.map(options, (item, key) => {
            return (
              <li
                className={classnames(Styles.block, { active: value == item.value })}
                key={item.value}
                onClick={() => {
                  onChange && onChange(item.value);
                }}
              >
                <span className={Styles.title}>{item.title}</span>
                <span className={Styles.describe}>{item.subTitle}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default BlockCheckbox;
