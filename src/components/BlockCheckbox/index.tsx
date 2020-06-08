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
  disabled?: boolean;
}

class BlockCheckbox extends React.Component<BlockCheckboxProps> {
  render() {
    const { value, onChange, options, disabled } = this.props;
    return (
      <div>
        <ul className={Styles.blockBox}>
          {_.map(options, (item, key) => {
            return (
              <li
                className={classnames(Styles.block, { [Styles.active]: value == item.value })}
                key={item.value}
                onClick={() => {
                  if(disabled) return;
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
